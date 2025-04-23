import { describe, it, expect } from 'vitest'
import { extractStrings } from '../src/utils/extractStringsEnhanced.js'

describe('extractStrings()', () => {
  it('extracts from StringLiteral', () => {
    const node = { type: 'StringLiteral', value: 'btn active' }
    expect(extractStrings(node)).toEqual(['btn active'])
  })

  it('extracts from TemplateLiteral', () => {
    const node = {
      type: 'TemplateLiteral',
      quasis: [{ value: { raw: 'foo bar' } }]
    }
    expect(extractStrings(node)).toEqual(['foo', 'bar'])
  })

  it('extracts from TaggedTemplateExpression', () => {
    const node = {
      type: 'TaggedTemplateExpression',
      quasi: {
        quasis: [{ value: { raw: 'tagged classes' } }]
      }
    }
    expect(extractStrings(node)).toEqual(['tagged', 'classes'])
  })

  it('handles BinaryExpression with raw fallback', () => {
    const node = {
      type: 'BinaryExpression',
      extra: { raw: '"foo bar baz"' }
    }
    const result = extractStrings(node)
    expect(result).toEqual(expect.arrayContaining(['foo', 'bar', 'baz']))
  })

  it('handles BinaryExpression with concat', () => {
    const node = {
      type: 'BinaryExpression',
      operator: '+',
      left: { type: 'StringLiteral', value: 'foo' },
      right: { type: 'StringLiteral', value: 'bar' }
    }
    expect(extractStrings(node)).toContain('foobar')
  })

  it('handles LogicalExpression with fallback recursion', () => {
    const node = {
      type: 'LogicalExpression',
      operator: '||',
      left: { type: 'StringLiteral', value: 'left side' },
      right: { type: 'StringLiteral', value: 'right side' }
    }
    const result = extractStrings(node)
    expect(result).toEqual(expect.arrayContaining(['left side', 'right side']))
  })

  it('handles ArrayExpression of strings', () => {
    const node = {
      type: 'ArrayExpression',
      elements: [
        { type: 'StringLiteral', value: 'alpha beta' },
        { type: 'StringLiteral', value: 'gamma' }
      ]
    }
    expect(extractStrings(node)).toEqual(['alpha beta', 'gamma'])
  })

  it('extracts from ObjectExpression', () => {
    const node = {
      type: 'ObjectExpression',
      properties: [
        { key: { type: 'Identifier', name: 'foo' }, value: { type: 'StringLiteral', value: 'bar baz' } },
        { key: { type: 'StringLiteral', value: 'qux' }, value: { type: 'StringLiteral', value: 'zap' } }
      ]
    }
    const result = extractStrings(node)
    expect(result).toEqual(expect.arrayContaining(['foo', 'bar', 'baz', 'qux', 'zap']))
  })

  it('extracts from clsx CallExpression', () => {
    const node = {
      type: 'CallExpression',
      callee: { name: 'clsx' },
      arguments: [
        { type: 'StringLiteral', value: 'a b' },
        { type: 'StringLiteral', value: 'c' }
      ]
    }
    expect(extractStrings(node)).toEqual(expect.arrayContaining(['a b', 'c']))
  })

  it('handles JSXAttribute string', () => {
    const node = {
      type: 'JSXAttribute',
      value: { type: 'StringLiteral', value: 'hidden active' }
    }
    expect(extractStrings(node)).toEqual(['hidden active'])
  })

  it('handles null node gracefully', () => {
    expect(extractStrings(null)).toEqual([])
  })

  it('handles unknown node types', () => {
    const node = { type: 'UnknownType' }
    expect(extractStrings(node)).toEqual([])
  })
})
