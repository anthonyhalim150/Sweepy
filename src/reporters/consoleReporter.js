import chalk from 'chalk';

export function printReport({ unusedJS, unusedCSS, unusedAssets }) {
  if (!unusedJS.length && !unusedCSS.length && !unusedAssets.length) {
    console.log(chalk.green('🎉 No unused files found — your project is sweepy clean!'));
    return;
  }

  if (unusedJS.length) {
    console.log(chalk.yellow('\n🧹 Unused JS/TS files:'));
    unusedJS.forEach(f => console.log('  •', f));
  }

  if (unusedCSS.length) {
    console.log(chalk.yellow('\n🎨 Unused CSS/SCSS files:'));
    unusedCSS.forEach(f => console.log('  •', f));
  }

  if (unusedAssets.length) {
    console.log(chalk.yellow('\n🖼️ Orphaned assets:'));
    unusedAssets.forEach(f => console.log('  •', f));
  }
}

export function printJsonReport(result) {
  console.log(JSON.stringify(result, null, 2));
}
