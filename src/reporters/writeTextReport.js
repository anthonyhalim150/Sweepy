import fs from 'fs'

export function writeTextReport(result, outputPath) {
  const lines = []

  if (result.unusedHTML?.length) {
    lines.push('📄 Unused HTML files:')
    result.unusedHTML.forEach(f => lines.push(`  • ${f}`))
    lines.push('')
  }
  


  if (result.unusedJS?.length) {
    lines.push('📘 Unused JS/TS files:')
    result.unusedJS.forEach(f => lines.push(`  • ${f}`))
    lines.push('')
  }

  if (result.unusedCSS?.length) {
    lines.push('🎨 Unused CSS/SCSS files:')
    result.unusedCSS.forEach(f => lines.push(`  • ${f}`))
    lines.push('')
  }

  if (result.unusedJSON?.length) {
    lines.push('🗂️ Unused JSON files:')
    result.unusedJSON.forEach(f => lines.push(`  • ${f}`))
    lines.push('')
  }
  
  if (result.unusedAssets?.length) {
    lines.push('🖼️ Orphaned assets:')
    result.unusedAssets.forEach(f => lines.push(`  • ${f}`))
    lines.push('')
  }

  
  if (result.unusedExports && Object.keys(result.unusedExports).length > 0) {
    const all = Object.entries(result.unusedExports).filter(([_, syms]) => syms.length)
    if (all.length > 0) {
      lines.push('📤 Unused exports by file:')
      all.forEach(([file, syms]) => {
        lines.push(`  • ${file}`)
        syms.forEach(s => lines.push(`     - ${s}`))
      })
      lines.push('')
    }
  }


  if (result.unusedCssSelectors && Object.keys(result.unusedCssSelectors).length > 0) {
    lines.push('🧷 Unused CSS Selectors by file:')
    for (const [file, selectors] of Object.entries(result.unusedCssSelectors)) {
      lines.push(`  • ${file}`)
      selectors.forEach(sel => lines.push(`     - ${sel}`))
    }
    lines.push('')
  }


  if (result.unusedEnv?.unused?.length) {
    lines.push('🔐 Unused .env Keys:')
    result.unusedEnv.unused.forEach(key => lines.push(`  • ${key}`))
    lines.push('')
  }


  if (result.unusedDependencies?.length) {
    lines.push('📦 Unused npm dependencies:')
    result.unusedDependencies.forEach(dep => lines.push(`  • ${dep}`))
    lines.push('')
  }


  if (result.missingDependencies?.length) {
    lines.push('❗ Missing (used but undeclared) dependencies:')
    result.missingDependencies.forEach(dep => lines.push(`  • ${dep}`))
    lines.push('')
  }

  if (result.unusedConfigs?.length) {
    lines.push('⚙️ Unused or duplicate config files:')
    result.unusedConfigs.forEach(f => lines.push(`  • ${f}`))
    lines.push('')
  }  


  if (result.deadAliases && Object.keys(result.deadAliases).length > 0) {
    lines.push('🧭 Dead Alias Paths:')
    for (const [source, aliases] of Object.entries(result.deadAliases)) {
      lines.push(`  📁 ${source}:`)
      for (const [alias, target] of Object.entries(aliases)) {
        lines.push(`    • ${alias} → ${target}`)
      }
    }
    lines.push('')
  }


  if (result.unusedVars && Object.keys(result.unusedVars).length > 0) {
    lines.push('🕳️ Unused Variables:')
    for (const [file, vars] of Object.entries(result.unusedVars)) {
      lines.push(`  • ${file}`)
      for (const v of vars) {
        const name = v.name || '[unnamed]'
        const line = v.line ? ` (line ${v.line})` : ''
        lines.push(`     - ${name}${line}`)
      }
    }
    lines.push('')
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')
}
