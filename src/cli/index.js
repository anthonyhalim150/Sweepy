#!/usr/bin/env node
import { createSweepyCLI } from './createSweepyCLI.js'
import { handleInlineHelp } from './helpHandlers.js'
import { runSweepy } from './runSweepy.js'

const rawArgv = process.argv.slice(2)

handleInlineHelp(rawArgv) 

const program = createSweepyCLI()

program
  .name('sweepy')
  .description('Find unused JS/TS/CSS files and orphaned assets in your codebase')
  .option('-j, --json', 'Output as JSON')
  .option('-d, --delete', 'Delete unused files (use with --interactive to select files manually)')
  .option('--dry-run', 'Simulate deletion (use with --delete to preview files that would be deleted)', false)
  .option('-v, --verbose', 'Show verbose logs')
  .option('-i, --ignore <patterns...>', 'Ignore glob patterns (overrides config)', [])
  .option('--confirm', 'Confirm deletion without prompt')
  .option('--interactive', 'Prompt to select which unused files to delete or recover')
  .option('--html-report', 'Generate sweepy-report.html output')
  .option('--export <file>', 'Write unused file list to .txt or .json')
  .option(
    '--only [types...]',
    'Limit scan to specific file types (.js, .ts, .png):\n' +
    'You can combine types: e.g. --only js css'
  )
  .option('--prune-trash', 'Delete all contents of .sweepy-trash folder')
  .option('--recover [file]', 'Recover a specific file from trash or use with --interactive')
  .option('--recover-all', 'Recover all files from trash')
  .option('--since [commit]', 'Only scan files changed since the given Git commit (e.g. HEAD~5, hash)')
  .option('--print-config', 'Print resolved configuration from CLI, .sweepyignore, and package.json')
  .option('--generate-ignore', 'Create a default .sweepyignore file')
  .option('--init', 'Write default sweepy config into package.json')




program.parse(process.argv)

const options = program.opts()
runSweepy(options, process.cwd())
