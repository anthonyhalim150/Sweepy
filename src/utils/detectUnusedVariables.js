import fs from 'fs'
import { parse } from '@babel/parser'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const eslintScope = require('eslint-scope')

export function detectUnusedVariables(files) {
  const result = {}

  for (const file of files) {
    let code = ''
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

    let scopeManager
    try {
        scopeManager = eslintScope.analyze(ast, {
            ecmaVersion: 2022,
            sourceType: 'module',
            optimistic: true,
            ignoreEval: true
        })
    } catch (e) {
        continue
    }

    const unused = []

    for (const scope of scopeManager.scopes) {
      for (const variable of scope.variables) {
        if (variable.defs.length === 0) continue

        const isUnused = variable.references.every(ref =>
          ref.identifier === variable.identifiers[0]
        )

        if (isUnused) {
          const identifier = variable.identifiers[0]
          unused.push({
            name: variable.name,
            line: identifier?.loc?.start?.line ?? null
          })
        }
      }
    }

    if (unused.length > 0) {
      result[file] = unused
    }
  }

  return result
}
