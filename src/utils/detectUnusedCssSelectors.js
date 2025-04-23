import fs from 'fs'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import path from 'path'
import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'
import { extractStrings } from './extractStringsEnhanced.js'

const traverse = typeof traverseModule === 'function' ? traverseModule : traverseModule.default

function extractSelectorsFromCSS(filePath) {
  const css = fs.readFileSync(filePath, 'utf-8')
  const selectors = new Set()
  const keyframes = new Set()
  const animationsUsed = new Set()

  const root = postcss.parse(css)

  root.walkAtRules('keyframes', atRule => {
    keyframes.add(atRule.params.trim())
  })

  root.walkDecls(decl => {
    if (decl.prop === 'animation' || decl.prop === 'animation-name') {
      const names = decl.value.split(/[,\s]+/).filter(Boolean)
      names.forEach(name => animationsUsed.add(name.trim()))
    }
  })

  root.walkRules(rule => {
    selectorParser(selectorsAST => {
      selectorsAST.walk(node => {
        if (node.type === 'class') {
          selectors.add(`.${node.value}`)
        } else if (node.type === 'id') {
          selectors.add(`#${node.value}`)
        } else if (node.type === 'tag') {
          const skip = ['from', 'to', '0%', '100%', '0', '100']
          if (!skip.includes(node.value)) {
            selectors.add(node.value)
          }
        }
      })
    }).processSync(rule.selector)
  })

  return { selectors, keyframes, animationsUsed }
}

function extractUsedSelectorsFromCode(contentMap, customMatchers = [], cssModuleIdentifiers = new Set()) {
  const used = new Set()
  const matchers = new Set(['clsx', 'classnames', ...customMatchers])

  for (const [file, code] of contentMap.entries()) {
    const ext = path.extname(file)

    if (ext === '.html' || ext === '.htm' || ext === '.css') {
      const classMatches = [...code.matchAll(/class=["']([^"']+)["']/g)]
      const idMatches = [...code.matchAll(/id=["']([^"']+)["']/g)]
      const tagMatches = [...code.matchAll(/<([a-z][a-z0-9]*)/gi)]

      classMatches.forEach(match => {
        match[1].split(/\s+/).forEach(cls => used.add(`.${cls}`))
      })
      idMatches.forEach(match => used.add(`#${match[1]}`))
      tagMatches.forEach(match => used.add(match[1]))
    } else {
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
        JSXAttribute({ node }) {
          if (node.name.name === 'className') {
            if (node.value?.type === 'StringLiteral') {
              node.value.value.split(/\s+/).forEach(cls => used.add(`.${cls}`))
            }
            if (node.value?.type === 'JSXExpressionContainer') {
              const extracted = extractStrings(node.value.expression)
              extracted.forEach(cls => {
                if (cls.startsWith('.') || cls.startsWith('#')) {
                  used.add(cls)
                } else {
                  used.add(`.${cls}`)
                }
              })
            }
          }
          if (node.name.name === 'id' && node.value?.type === 'StringLiteral') {
            used.add(`#${node.value.value}`)
          }
        },
        JSXOpeningElement({ node }) {
          if (node.name?.type === 'JSXIdentifier') {
            used.add(node.name.name)
          }
        },
        CallExpression({ node }) {
          const calleeName = node.callee.name
          if (matchers.has(calleeName)) {
            node.arguments.forEach(arg => {
              extractStrings(arg).forEach(cls => used.add(`.${cls}`))
            })
          }
        },
        MemberExpression({ node }) {
          if (node.object?.type === 'Identifier' && cssModuleIdentifiers.has(node.object.name)) {
            if (node.property?.type === 'Identifier') {
              used.add(`.${node.property.name}`)
            }
          }
        },
        ImportDeclaration({ node }) {
          if (/\.module\.css$/.test(node.source.value)) {
            if (node.specifiers.length) {
              cssModuleIdentifiers.add(node.specifiers[0].local.name)
            }
          }
        }
      })
    }
  }

  return { used }
}

export async function detectUnusedCssSelectors(cssFiles, contentMap, customMatchers = [], customCssSafelist = []) {
  const result = {}
  const cssModuleIdentifiers = new Set()
  const { used } = extractUsedSelectorsFromCode(contentMap, customMatchers, cssModuleIdentifiers)

  const safelistRegs = customCssSafelist.map(p => new RegExp(p))

  for (const cssFile of cssFiles) {
    const { selectors, keyframes, animationsUsed } = extractSelectorsFromCSS(cssFile)

    const unusedSelectors = [...selectors].filter(sel =>
      !used.has(sel) && !safelistRegs.some(rx => rx.test(sel))
    )

    const unusedKeyframes = [...keyframes].filter(k =>
      !animationsUsed.has(k) && !safelistRegs.some(rx => rx.test(`@keyframes ${k}`))
    )

    const fullList = [
      ...unusedSelectors,
      ...unusedKeyframes.map(k => `@keyframes ${k}`)
    ]

    if (fullList.length) {
      result[cssFile] = fullList
    }
  }

  return result
}
