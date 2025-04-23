import evaluate from 'static-eval'
import * as acorn from 'acorn'

export function extractStrings(expr, scope = {}) {
  const values = []
  if (!expr) return values

  switch (expr.type) {
    case 'StringLiteral':
      values.push(expr.value)
      break

    case 'TemplateLiteral':
      expr.quasis.forEach(q => {
        const raw = q.value.raw.trim()
        if (raw) values.push(...raw.split(/\s+/))
      })
      break

    case 'TaggedTemplateExpression':
      if (expr.quasi?.quasis) {
        expr.quasi.quasis.forEach(q => {
          const raw = q.value.raw.trim()
          if (raw) values.push(...raw.split(/\s+/))
        })
      }
      break

    case 'ConditionalExpression':
    case 'LogicalExpression':
    case 'BinaryExpression':
      try {
        if (expr.operator === '+' &&
            expr.left?.type === 'StringLiteral' &&
            expr.right?.type === 'StringLiteral') {
          values.push(expr.left.value + expr.right.value)
          break
        }

        const raw = expr.extra?.raw || ''
        if (raw) {
          try {
            const acornAst = acorn.parseExpressionAt(raw, 0, { ecmaVersion: 2020 })
            const evalResult = evaluate(acornAst, scope)
            if (typeof evalResult === 'string') {
              values.push(...evalResult.trim().split(/\s+/))
              break
            }
          } catch {}
        }
        
        if (expr.left) values.push(...extractStrings(expr.left, scope))
        if (expr.right) values.push(...extractStrings(expr.right, scope))
        
      } catch (err) {
        console.warn('Error while processing expression:', err.message)
        if (expr.left) values.push(...extractStrings(expr.left, scope))
        if (expr.right) values.push(...extractStrings(expr.right, scope))
      }
      break

    case 'ArrayExpression':
      expr.elements.forEach(el => {
        if (el) values.push(...extractStrings(el, scope))
      })
      break

    case 'ObjectExpression':
      expr.properties.forEach(p => {
        if (p.key?.type === 'StringLiteral') values.push(p.key.value)
        if (p.key?.type === 'Identifier') values.push(p.key.name)
        if (p.value?.type === 'StringLiteral') {
          values.push(...p.value.value.split(/\s+/))
        }
      })
      break

    case 'CallExpression':
      const calleeName = expr.callee?.name || expr.callee?.property?.name
      if (calleeName === 'classnames' || calleeName === 'clsx') {
        expr.arguments.forEach(arg => values.push(...extractStrings(arg, scope)))
      }
      break

    case 'JSXAttribute':
      if (expr.value?.type === 'StringLiteral') {
        values.push(expr.value.value)
      }
      break

    default:
      if (typeof expr.value === 'string') values.push(expr.value)
      if (typeof expr.name === 'string') values.push(expr.name)
      break
  }

  return values
}
