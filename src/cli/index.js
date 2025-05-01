#!/usr/bin/env node
import { createSweepyCLI } from './createSweepyCLI.js'
import { handleInlineHelp } from './helpHandlers.js'
import { runSweepy } from './runSweepy.js'

const rawArgv = process.argv.slice(2)

const detectIndex = rawArgv.indexOf('--detect')
if (detectIndex !== -1) {
  const detectValues = []
  const validDetectTypes = ['js', 'css', 'assets', 'exports', 'env', 'deps', 'alias', 'vars', 'html', 'json', 'config']

  for (let i = detectIndex + 1; i < rawArgv.length; i++) {
    const arg = rawArgv[i]
    if (arg.startsWith('-')) break
    detectValues.push(arg)
  }

  const hasInvalid = detectValues.length === 0 || detectValues.some(val => !validDetectTypes.includes(val))
  if (hasInvalid) {
    rawArgv.length = 0
    rawArgv.push('--detect', '--help')
  }
}

if (
  (rawArgv.includes('--ignore') || rawArgv.includes('-i')) && rawArgv.length === 1
) rawArgv.push('--help')

if (
  rawArgv.includes('--export') &&
  (rawArgv.length === 1 || rawArgv[rawArgv.indexOf('--export') + 1]?.startsWith('-'))
) rawArgv.push('--help')

handleInlineHelp(rawArgv)

const program = createSweepyCLI()

program
  .name('sweepy')
  .description('Find unused JS/TS/CSS files and orphaned assets in your codebase')

  .option('--init', 'Write default sweepy config, such as ignoring node modules and build folders, into package.json\n')

  .option('-j, --json', 'Output results as JSON')
  .option('--html-report', 'Generate sweepy-report.html output')
  .option('--export <file>', 'Write unused file list to .txt or .json')
  .option('--print-config', 'Print resolved configuration from CLI and package.json\n')

  .option(
    '--detect <types...>',
    'Limit detection types (run --detect --help for full list)'
  )
  .option(
    '--only [extensions...]',
    'Limit scan to specific file types (.js, .ts, .png)\n' +
    'You can combine types: e.g. --only js css'
  )
  .option(
    '-i, --ignore <patterns...>',
    'Glob patterns to exclude files or folders (e.g. **/node_modules/**)\n' +
    'Note: Overrides default config in .sweepyrc.json and package.json (run --ignore --help for examples)'
  )
  .option('--since [commit]', 'Only scan files changed since the given Git commit (e.g. HEAD~5, hash)\n')

  .option('-d, --delete', 'Delete unused files (use with --interactive to select files manually)')
  .option('--confirm', 'Confirm deletion without prompt')
  .option('--dry-run', 'Simulate deletion (use with --delete to preview files that would be deleted)', false)
  .option('--interactive', 'Prompt to select which unused files to delete or recover')
  .option('--recover [file]', 'Recover a specific file from trash or use with --interactive')
  .option('--recover-all', 'Recover all files from trash')
  .option('--prune-trash', 'Delete all contents of .sweepy-trash folder\n')

  .option('-v, --verbose', 'Show verbose logs')


program.exitOverride(() => {
  program.outputHelp()
  process.exit(1)
})

try {
  program.parse(['node', 'sweepy', ...rawArgv]) 
  const options = program.opts()
  runSweepy(options, process.cwd())
} catch {
  program.outputHelp()
  process.exit(1)
}
