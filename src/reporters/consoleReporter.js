import chalk from 'chalk'

export function printReport({ unusedJS, unusedCSS, unusedAssets, unusedExports, unusedCssSelectors, unusedEnv }) {
  const hasUnused =
    unusedJS.length ||
    unusedCSS.length ||
    unusedAssets.length ||
    (unusedExports && Object.values(unusedExports).some(syms => syms.length)) ||
    (unusedCssSelectors && Object.keys(unusedCssSelectors).length > 0) ||
    (unusedEnv?.unused?.length)

  if (!hasUnused) {
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

  if (unusedCssSelectors && Object.keys(unusedCssSelectors).length > 0) {
    console.log(chalk.yellow('\n🎯 Unused CSS Selectors by file:'))
    Object.entries(unusedCssSelectors).forEach(([file, selectors]) => {
      console.log('  •', file)
      selectors.forEach(sel => console.log('     -', sel))
    })
  }

  if (unusedEnv?.unused?.length) {
    console.log(chalk.yellow('\n🔐 Unused .env Keys:'))
    unusedEnv.unused.forEach(key => console.log('  •', key))
  }
}

export function printJsonReport(result) {
  console.log(JSON.stringify(result, null, 2))
}
