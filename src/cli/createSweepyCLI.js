import { Command } from 'commander';
import chalk from 'chalk';

export function createSweepyCLI() {
  const program = new Command();

  program
    .name('sweepy')
    .description('Find unused JS/TS/CSS files and unused assets/exports in your codebase')
    .usage('[options]')
    .addHelpText('beforeAll', chalk.bold.cyan(`
·····················································
:███████╗██╗    ██╗███████╗███████╗██████╗ ██╗   ██╗:
:██╔════╝██║    ██║██╔════╝██╔════╝██╔══██╗╚██╗ ██╔╝:
:███████╗██║ █╗ ██║█████╗  █████╗  ██████╔╝ ╚████╔╝ :
:╚════██║██║███╗██║██╔══╝  ██╔══╝  ██╔═══╝   ╚██╔╝  :
:███████║╚███╔███╔╝███████╗███████╗██║        ██║   :
:╚══════╝ ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝        ╚═╝   :
····················································· v1.0.5
    `) + '\n' + chalk.gray('Find and remove unused JS, CSS, exports, and media files. Keep it clean.\n'))

  program.showHelpAfterError('(use --help to see available options)');

  program.exitOverride((err) => {
    if (err.code === 'commander.unknownOption') {
      console.error(chalk.red('\n🚫 Unknown option:'), err.message);
      console.error(chalk.gray('Run `sweepy --help` to see valid options.\n'));
      process.exit(1);
    }
  

    if (err.code === 'commander.helpDisplayed') {
      process.exit(0);
    }
  
    throw err;
  });
  

  return program;
}
