import chalk from 'chalk'

export function printReport({ unusedJS, unusedCSS, unusedAssets, unusedExports }) {
  if (!unusedJS.length && !unusedCSS.length && !unusedAssets.length && !Object.keys(unusedExports || {}).some(f => unusedExports[f].length)) {
    console.log(chalk.green('🎉 No unused files found — your project is sweepy clean!'))
    return
  }

  if (unusedJS.length) {
    console.log(chalk.yellow('\n🧹 Unused JS/TS files:'))
    unusedJS.forEach(f => console.log('  •', f))
  }

  if (unusedCSS.length) {
    console.log(chalk.yellow('\n🎨 Unused CSS/SCSS files:'))
    unusedCSS.forEach(f => console.log('  •', f))
  }

  if (unusedAssets.length) {
    console.log(chalk.yellow('\n🖼️ Orphaned assets:'))
    unusedAssets.forEach(f => console.log('  •', f))
  }

  if (unusedExports && Object.keys(unusedExports).length > 0) {
    const all = Object.entries(unusedExports).filter(([_, symbols]) => symbols.length > 0)
    if (all.length > 0) {
      console.log(chalk.yellow('\n📦 Unused exports by file:'))
      all.forEach(([file, symbols]) => {
        console.log('  •', file)
        symbols.forEach(sym => console.log('     -', sym))
      })
    }
  }
}

export function printJsonReport(result) {
  console.log(JSON.stringify(result, null, 2))
}
