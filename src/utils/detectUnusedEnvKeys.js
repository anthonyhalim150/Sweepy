import fs from 'fs'
import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'
import { globby } from 'globby'

const traverse = typeof traverseModule === 'function' ? traverseModule : traverseModule.default

export async function detectUnusedEnvKeys(projectDir, ignorePatterns = []) {
  const envFiles = await globby(['.env*'], { cwd: projectDir, absolute: true })
  const definedKeys = new Set()

  for (const envFile of envFiles) {
    const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=/)
      if (match) definedKeys.add(match[1])
    })
  }

  const files = await globby(['**/*.{js,ts,jsx,tsx}'], {
    cwd: projectDir,
    absolute: true,
    ignore: ignorePatterns
  })

  const usedKeys = new Set()

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
      MemberExpression({ node }) {
        if (
          node.object?.type === 'MemberExpression' &&
          node.object.object?.name === 'process' &&
          node.object.property?.name === 'env' &&
          node.property?.type === 'Identifier'
        ) {
          usedKeys.add(node.property.name)
        }
      },
      OptionalMemberExpression({ node }) {
        if (
          node.object?.type === 'MemberExpression' &&
          node.object.object?.name === 'process' &&
          node.object.property?.name === 'env' &&
          node.property?.type === 'Identifier'
        ) {
          usedKeys.add(node.property.name)
        }
      },
      CallExpression({ node }) {
        if (
          node.callee?.type === 'MemberExpression' &&
          node.callee.object?.type === 'MemberExpression' &&
          node.callee.object.object?.name === 'process' &&
          node.callee.object.property?.name === 'env' &&
          node.callee.property?.name === 'hasOwnProperty' &&
          node.arguments?.[0]?.type === 'StringLiteral'
        ) {
          usedKeys.add(node.arguments[0].value)
        }
      }
    })
  }

  const unused = [...definedKeys].filter(k => !usedKeys.has(k))
  return { unused, defined: [...definedKeys], used: [...usedKeys] }
}
