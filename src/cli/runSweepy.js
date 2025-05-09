import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import ora from 'ora'
import { loadSweepyRcConfig } from '../config/rcConfig.js'
import { loadConfig } from '../config/config.js'
import { findUnusedFiles } from '../core/detector.js'
import { filterByTypes } from '../utils/filterByTypes.js'
import { printReport, printJsonReport } from '../reporters/consoleReporter.js'
import { generateHtmlReport } from '../reporters/htmlReporter.js'
import { writeTextReport } from '../reporters/writeTextReport.js'
import { promptFileDeletion } from './prompts.js'
import { moveToTrash } from '../utils/moveToTrash.js'
import { writeSweepyConfigToPackage } from '../utils/writePackageSweepyConfig.js'
import { pruneSweepyTrash } from '../utils/pruneTrash.js'
import { getChangedFilesSinceCommit } from '../utils/getChangedFilesSinceCommit.js'
import { recoverFile, recoverAll, recoverInteractive } from '../utils/recoverFromTrash.js'
import { runDepcheckSweepy } from '../utils/dependencyChecker.js'

export async function runSweepy(options, cwd) {
  if (typeof options.export === 'string' && !/\.[a-z0-9]+$/i.test(options.export)) {
    console.log(chalk.red('\n⚠️  --export requires a valid file name with an extension (e.g. report.txt, output.json)'))
    return
  }

  if (options.export && (options.interactive || options.delete || options.recover || options.recoverAll || options.pruneTrash)) {
    console.log(chalk.red('\n⚠️  --export cannot be combined with deletion, recovery, or interactive options.'))
    return
  }

  if (options.recover === true && !options.interactive) {
    console.log(chalk.red('\n⚠️  --recover requires a filename or --interactive to select files.'))
    return
  }

  if (options.only === true || (Array.isArray(options.only) && options.only.length === 0)) {
    console.log(chalk.red('\n⚠️  --only requires at least one extension. For example: js, css, png'))
    console.log('Example: --only js css')
    return
  }

  if (options.interactive === true && !options.delete && !options.recover) {
    console.log(chalk.red('\n⚠️  --interactive must be combined with --delete or --recover'))
    return
  }

  if (options.delete && !options.confirm && !options.interactive && !options.dryRun) {
    console.log(chalk.red('\n⚠️  Deletion requested, but --confirm or --interactive flag is missing.'))
    console.log('Run with `--confirm` to delete all, or `--interactive` to choose files.')
    return
  }

  if (options.recover && options.interactive) {
    await recoverInteractive()
    return
  }

  if (options.since === true) {
    console.log(chalk.red('\n⚠️  --since requires a Git commit or ref (e.g. HEAD~5 or 57e4323...)'))
    return
  }

  if (typeof options.recover === 'string') {
    recoverFile(options.recover)
    return
  }

  if (options.recoverAll) {
    recoverAll()
    return
  }

  if (options.pruneTrash) {
    pruneSweepyTrash()
    return
  }

  if (options.verbose) {
    console.log(chalk.gray('🔍 Scanning project in:'), cwd)
  }

  if (options.init) {
    writeSweepyConfigToPackage(cwd)
    return
  }

  if (options.printConfig) {
    const rcConfig = loadSweepyRcConfig(cwd)
    const config = loadConfig(cwd, [...(options.ignore || []), ...(rcConfig.ignore || [])])
    console.log(chalk.cyan('\n🔧 Sweepy Resolved Config:'))
    console.log(JSON.stringify(config, null, 2))
    return
  }

  const rcConfig = loadSweepyRcConfig(cwd)
  const config = loadConfig(cwd, [...(options.ignore || []), ...(rcConfig.ignore || [])])
  const onlyTypes = Array.isArray(options.only) ? options.only : []



  let changedFiles = null
  if (options.since) {
    changedFiles = getChangedFilesSinceCommit(options.since)
    if (!changedFiles) return
    if (changedFiles.length === 0) {
      console.log(chalk.yellow('\n⚠️  No files changed since that commit. Nothing to scan.'))
      return
    }
  }

  const spinner = ora('Scanning project for unused files...').start()

  let result
  try {
    result = await findUnusedFiles(
      cwd,
      config.ignore,
      options.verbose,
      changedFiles,
      options.detect
    )
    spinner.succeed('Scan complete.')
  } catch (err) {
    spinner.fail('Scan failed.')
    console.error(err)
    return
  }

  let depcheckResult = { unusedDependencies: [], missingDependencies: [] }

  if (!options.detect || options.detect.includes('deps')) {
    const depSpinner = ora('Checking npm dependencies...').start()
    try {
      depcheckResult = await runDepcheckSweepy(cwd)
      depSpinner.succeed('Dependency check complete.')
    } catch (err) {
      depSpinner.fail('Dependency check failed.')
      console.error(err)
    }
  }
  const filteredResult = onlyTypes.length > 0
  ? filterByTypes(result, onlyTypes):result
  

  filteredResult.unusedDependencies = depcheckResult.unusedDependencies
  filteredResult.missingDependencies = depcheckResult.missingDependencies

  if (options.json) {
    printJsonReport(filteredResult)
  } else {
    printReport(filteredResult)
  }

  if (options.htmlReport) {
    generateHtmlReport(filteredResult)
    console.log(chalk.green('📝 HTML report saved as sweepy-report.html'))
  }

  if (options.export) {
    const ext = path.extname(options.export)
  
    try {
      if (ext === '.json') {
        fs.writeFileSync(options.export, JSON.stringify(filteredResult, null, 2), 'utf-8')
      } else {
        writeTextReport(filteredResult, options.export)
      }
  
      console.log(chalk.green(`📤 Unused file list exported to ${options.export}`))
    } catch (e) {
      console.log(chalk.red(`❌ Failed to export file list: ${e.message}`))
    }
  
    return
  }
  
  const allFiles = []

  if (filteredResult.unusedHTML.length)
    allFiles.push({ separator: '📄 Unused HTML files' }, ...filteredResult.unusedHTML)
  if (filteredResult.unusedJS.length)
    allFiles.push({ separator: '📘 Unused JS/TS files' }, ...filteredResult.unusedJS)
  if (filteredResult.unusedCSS.length)
    allFiles.push({ separator: '🎨 Unused CSS/SCSS files' }, ...filteredResult.unusedCSS)
  if (filteredResult.unusedJSON.length)
    allFiles.push({ separator: '🗂️ Unused JSON files' }, ...filteredResult.unusedJSON)  
  if (filteredResult.unusedAssets.length)
    allFiles.push({ separator: '🖼️ Orphaned assets' }, ...filteredResult.unusedAssets)
  if (filteredResult.unusedConfigs?.length)
    allFiles.push({ separator: '⚙️ Unused or duplicate config files' }, ...filteredResult.unusedConfigs)
  

  if (options.interactive && options.delete) {
    const selected = await promptFileDeletion(allFiles)
    if (!selected.length) {
      console.log(chalk.gray('\nNo files selected.'))
      return
    }
    if (options.dryRun) {
      console.log(chalk.cyan('\n💡 Dry run enabled — selected files would be deleted:'))
      selected.forEach(f => console.log('  •', f))
      return
    }
    for (const file of selected) {
      moveToTrash(file)
      console.log(chalk.red('🗑️ Moved to trash:'), file)
    }
    return
  }

  if (options.delete) {
    if (options.dryRun) {
      console.log(chalk.cyan('\n💡 Dry run enabled — the following files would be deleted:'))
      allFiles.forEach(f => console.log('  •', f))
      return
    }
    for (const file of allFiles) {
      moveToTrash(file)
      console.log(chalk.red('🗑️ Moved to trash:'), file)
    }
  }
}