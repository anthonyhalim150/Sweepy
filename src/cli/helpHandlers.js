import chalk from 'chalk'

export function handleInlineHelp(argv) {
  const [first, second] = argv

  const isHelp = (val) => val === '-h' || val === '--help'

  if (first === '--only' && isHelp(second)) {
    printOnlyHelp()
    process.exit(0)
  }
  if (first === '--since' && isHelp(second)) {
    printSinceHelp()
    process.exit(0)
  }
  

  if (first === '--delete' && isHelp(second)) {
    printDeleteHelp()
    process.exit(0)
  }

  if (first === '--recover' && isHelp(second)) {
    printRecoverHelp()
    process.exit(0)
  }

  if (first === '--recover-all' && isHelp(second)) {
    printRecoverHelp()
    process.exit(0)
  }

  if (first === '--export' && isHelp(second)) {
    printExportHelp()
    process.exit(0)
  }

  if (first === '--html-report' && isHelp(second)) {
    printHtmlReportHelp()
    process.exit(0)
  }

  if (first === '--prune-trash' && isHelp(second)) {
    printPruneTrashHelp()
    process.exit(0)
  }

  if (first === '--interactive' && isHelp(second)) {
    printInteractiveHelp()
    process.exit(0)
  }
}

function printOnlyHelp() {
  console.log(`
--only [types...]

Limit scan to specific file types:

  js      JavaScript and TypeScript files (.js, .ts, .jsx, .tsx)
  css     CSS and SCSS stylesheets (.css, .scss)
  assets  Static media assets (.png, .jpg, .svg, .webp, etc.)

Examples:
  $ sweepy --only js
  $ sweepy --only js css
  $ sweepy --only assets --html-report
`)
}

function printDeleteHelp() {
  console.log(`
--delete

Deletes unused files found in your project.

Recommended:
  $ sweepy --delete --interactive
  Prompts you to select which files to delete safely.

Advanced:
  $ sweepy --delete --confirm
  Instantly deletes all unused files without prompting.

Preview only:
  $ sweepy --delete --dry-run
  Shows which files would be deleted, but takes no action.
`)
}

function printRecoverHelp() {
  console.log(`
--recover [file]

Recovers previously deleted files from the .sweepy-trash folder.

Modes:
  $ sweepy --recover somefile.js
    Recovers a specific file by name.

  $ sweepy --recover --interactive
    Lets you interactively choose which trashed files to recover.

  $ sweepy --recover-all
    Restores all previously deleted files.
`)
}

function printExportHelp() {
  console.log(`
--export <file>

Writes the list of unused files to a file.

Supported formats:
  .txt   → newline-separated file list
  .json  → full structured object with grouped results

Examples:
  $ sweepy --export unused.txt
  $ sweepy --export report.json
`)
}

function printHtmlReportHelp() {
  console.log(`
--html-report

Generates a visual summary of unused files.

Output:
  sweepy-report.html in the current directory

Useful for:
  CI logs, visual audits, sharing with teams

Example:
  $ sweepy --html-report --only assets
`)
}

function printPruneTrashHelp() {
  console.log(`
--prune-trash

Permanently deletes all files from the .sweepy-trash directory.

Use this after you've confirmed nothing in the trash is needed.

Example:
  $ sweepy --prune-trash
`)
}

function printInteractiveHelp() {
  console.log(`
--interactive

Enables interactive selection of files to delete or recover.

Use this when:
  - You want to manually choose which files to delete (instead of auto-deletion with --confirm)
  - You want to interactively recover files from .sweepy-trash

Examples:
  $ sweepy --delete --interactive
  $ sweepy --recover --interactive
`)
}

function printSinceHelp() {
    console.log(`
  --since <commit>
  
  Limits the scan to files changed since a specific Git commit.
  
  Useful for:
    - PR diff scanning
    - CI optimizations
    - Partial audits
  
  Examples:
    $ sweepy --since HEAD~5
    $ sweepy --since 72c1f7d --only js css
  `)
  }
  