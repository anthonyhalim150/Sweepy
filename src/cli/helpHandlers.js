export function handleInlineHelp(argv) {
  const [first, second] = argv
  const isHelp = (val) => val === '-h' || val === '--help'

  if (first === '--only' && isHelp(second)) printOnlyHelp()
  if (first === '--since' && isHelp(second)) printSinceHelp()
  if (first === '--delete' && isHelp(second)) printDeleteHelp()
  if (first === '--recover' && isHelp(second)) printRecoverHelp()
  if (first === '--recover-all' && isHelp(second)) printRecoverHelp()
  if (first === '--export' && isHelp(second)) printExportHelp()
  if (first === '--html-report' && isHelp(second)) printHtmlReportHelp()
  if (first === '--prune-trash' && isHelp(second)) printPruneTrashHelp()
  if (first === '--interactive' && isHelp(second)) printInteractiveHelp()
  if ((first === '--ignore' || first === '-i') && isHelp(second)) printIgnoreHelp()
  if (first === '--detect' && isHelp(second)) printDetectHelp()
  if ((first === '--ignore' || first === '-i') && !second) {printIgnoreHelp()}
  if (first === '--detect' && !second) {printDetectHelp()}    
}

function printOnlyHelp() {
  console.log(`
--only [extensions...]

Filter output to show only files with the specified extensions.

Examples:
  $ sweepy --only js
  $ sweepy --only .js
  $ sweepy --only js ts jsx
  $ sweepy --only css scss
  $ sweepy --only env
`)
  process.exit(0)
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
  process.exit(0)
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
  process.exit(0)
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
  process.exit(0)
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
  process.exit(0)
}

function printPruneTrashHelp() {
  console.log(`
--prune-trash

Permanently deletes all files from the .sweepy-trash directory.

Use this after you've confirmed nothing in the trash is needed.

Example:
  $ sweepy --prune-trash
`)
  process.exit(0)
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
  process.exit(0)
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
  process.exit(0)
}

function printIgnoreHelp() {
  console.log(`
--ignore <patterns...>

Glob patterns for files or folders to exclude from scanning.

You can add ignore patterns in .sweepyrc.json or package.json > sweepy.ignore (e.g. src/generated, **/components/**).

Default config in package.json can be generated with:
  $ sweepy --init

Examples:
  $ sweepy --ignore "**/node_modules/**" "**/*.test.js"
  $ sweepy --ignore "src/generated/**"
`)
  process.exit(0)
}

function printDetectHelp() {
  console.log(`
--detect <types...>

Choose specific detection categories to run:

  js       → Unused JS/TS modules
  css      → Unused CSS/SCSS files and selectors
  assets   → Unused media assets (.png, .svg, etc.)
  exports  → Unused exported symbols in modules
  env      → Unused .env keys
  deps     → Unused or undeclared npm dependencies (from package.json)
  alias    → Dead or misconfigured alias paths (tsconfig, webpack, babel, vite)
  vars     → Unused local variables and function parameters


By default, Sweepy runs all detectors.

Examples:
  $ sweepy --detect js css
  $ sweepy --detect env exports
  $ sweepy --detect deps
    `)    
  process.exit(0)
}
