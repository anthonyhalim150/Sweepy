import fs from 'fs'
import path from 'path'

export function generateHtmlReport(result, outputPath = 'sweepy-report.html') {
  const {
    unusedJS = [],
    unusedCSS = [],
    unusedAssets = [],
    unusedExports = {},
    unusedCssSelectors = {},
    unusedEnv = {},
    unusedDependencies = [],
    missingDependencies = [],
    unresolvedDependencies = []
  } = result

  const section = (title, items) =>
    items.length
      ? `<section><h2>${title} (${items.length})</h2><ul>${items.map(f => `<li>${f}</li>`).join('')}</ul></section>`
      : ''

  const nestedSection = (title, obj) => {
    const entries = Object.entries(obj).filter(([_, list]) => list.length > 0)
    if (!entries.length) return ''
    return `
      <section><h2>${title} (${entries.length})</h2>
      <ul>
        ${entries
          .map(([file, values]) => `<li><strong>${file}</strong><ul>${values.map(v => `<li>${v}</li>`).join('')}</ul></li>`)
          .join('')}
      </ul>
      </section>
    `
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sweepy Report</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #fff5ee; color: #222; }
    h1, h2 { color: #d6336c; }
    section { margin-bottom: 2rem; }
    ul { margin-left: 1.5rem; }
    li { margin: 0.25rem 0; }
  </style>
</head>
<body>
  <h1>🧹 Sweepy Report</h1>

  ${section('📄 Unused JS/TS Files', unusedJS)}
  ${section('🎨 Unused CSS/SCSS Files', unusedCSS)}
  ${section('🖼️ Orphaned Assets', unusedAssets)}
  ${nestedSection('📦 Unused Exports', unusedExports)}
  ${nestedSection('🎯 Unused CSS Selectors', unusedCssSelectors)}
  ${section('🔐 Unused .env Keys', unusedEnv?.unused || [])}
  ${section('📦 Unused Dependencies', unusedDependencies)}
  ${section('🚫 Missing (Used but Not Declared) Dependencies', missingDependencies)}
  ${section('❌ Unresolved Dependencies', unresolvedDependencies)}

</body>
</html>
  `

  fs.writeFileSync(path.resolve(outputPath), html, 'utf-8')
}
