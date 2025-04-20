import fs from 'fs'
import path from 'path'

export function generateHtmlReport(result, outputPath = 'sweepy-report.html') {
  const { unusedJS, unusedCSS, unusedAssets, unusedExports } = result

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sweepy Report</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #fff5ee; }
    h1, h2 { color: #d6336c; }
    ul { margin: 0 0 2rem 1rem; }
    li { margin: 0.25rem 0; }
  </style>
</head>
<body>
  <h1>🧹 Sweepy Report</h1>

  <h2>📄 Unused JS/TS Files</h2>
  <ul>
    ${unusedJS.map(f => `<li>${f}</li>`).join('')}
  </ul>

  <h2>🎨 Unused CSS/SCSS Files</h2>
  <ul>
    ${unusedCSS.map(f => `<li>${f}</li>`).join('')}
  </ul>

  <h2>🖼️ Orphaned Assets</h2>
  <ul>
    ${unusedAssets.map(f => `<li>${f}</li>`).join('')}
  </ul>

  <h2>📦 Unused Exports</h2>
  <ul>
    ${Object.entries(unusedExports || {}).map(([file, symbols]) =>
      symbols.length
        ? `<li><strong>${file}</strong><ul>${symbols.map(sym => `<li>${sym}</li>`).join('')}</ul></li>`
        : ''
    ).join('')}
  </ul>

</body>
</html>
  `;

  fs.writeFileSync(path.resolve(outputPath), html, 'utf-8');
}
