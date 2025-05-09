import fs from 'fs'
import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'
import { globby } from 'globby'

const traverse = typeof traverseModule === 'function' ? traverseModule : traverseModule.default

function toKebabCase(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function possibleJSXFileNames(name) {
  const base = toKebabCase(name)
  return [
    `${name}.js`, `${name}.jsx`, `${name}.ts`, `${name}.tsx`,
    `${base}.js`, `${base}.jsx`, `${base}.ts`, `${base}.tsx`,
    `${name}/index.js`, `${name}/index.jsx`, `${name}/index.ts`, `${name}/index.tsx`,
    `${base}/index.js`, `${base}/index.jsx`, `${base}/index.ts`, `${base}/index.tsx`
  ]
}

export async function detectJSXComponentsUsed(files, projectDir) {
  const usedComponentNames = new Set()

  for (const file of files) {
    let code
    try {
      code = fs.readFileSync(file, 'utf-8')
    } catch {
      continue
    }

    let ast
    try {
      ast = parse(code, {
        sourceType: 'unambiguous',
        plugins: ['jsx', 'typescript']
      })
    } catch {
      continue
    }

    traverse(ast, {
      JSXOpeningElement({ node }) {
        if (node.name?.type === 'JSXIdentifier') {
          usedComponentNames.add(node.name.name)
        }
      }
    })
  }

  const matchedFiles = new Set()
  const candidates = await globby(['**/*.{js,jsx,ts,tsx}'], { cwd: projectDir, absolute: true })

  for (const tag of usedComponentNames) {
    const matches = possibleJSXFileNames(tag).map(m => m.toLowerCase())
    for (const candidate of candidates) {
      const norm = candidate.replace(/\\/g, '/').toLowerCase()
      if (matches.some(m => norm.endsWith(m))) {
        matchedFiles.add(candidate)
        break
      }
    }
  }

  return matchedFiles
}
