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
    unresolvedDependencies = [],
    deadAliases = {},
    unusedVars = {}
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
          .map(([file, values]) => `
            <li><strong>${file}</strong>
              <ul>
                ${values
                  .map(v => {
                    if (typeof v === 'string') return `<li>${v}</li>`
                    const name = v.name || '[unnamed]'
                    const line = v.line ? ` (line ${v.line})` : ''
                    return `<li>${name}${line}</li>`
                  })
                  .join('')}
              </ul>
            </li>
          `)
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
    :root {
      --accent: #d6336c;
      --bg: #fff5ee;
      --text: #222;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 2rem;
      line-height: 1.6;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: var(--accent);
    }

    h2 {
      font-size: 1.25rem;
      margin-top: 1.5rem;
      color: var(--accent);
    }

    section {
      margin-bottom: 2rem;
    }

    ul {
      margin-left: 1.5rem;
      list-style-type: disc;
    }

    li {
      margin: 0.25rem 0;
    }
  </style>
</head>
<body>
  <h1>🧹 Sweepy Report</h1>

  ${section('🧠 Unused JS/TS Files', unusedJS)}
  ${section('🎨 Unused CSS/SCSS Files', unusedCSS)}
  ${section('🖼️ Orphaned Assets', unusedAssets)}
  ${nestedSection('📤 Unused Exports', unusedExports)}
  ${nestedSection('🧷 Unused CSS Selectors', unusedCssSelectors)}
  ${section('🔐 Unused .env Keys', unusedEnv?.unused || [])}
  ${section('📦 Unused Dependencies', unusedDependencies)}
  ${section('❗ Missing (Used but Not Declared) Dependencies', missingDependencies)}
  ${section('🚧 Unresolved Dependencies', unresolvedDependencies)}
  ${nestedSection(
    '🧭 Dead Alias Paths',
    Object.fromEntries(
      Object.entries(deadAliases).map(([source, entries]) => [
        source,
        Object.entries(entries).map(([alias, target]) => `${alias} → ${target}`)
      ])
    )
  )}
  ${nestedSection('🕳️ Unused Variables', unusedVars || {})}
  

</body>
</html>
  `

  fs.writeFileSync(path.resolve(outputPath), html, 'utf-8')
}
