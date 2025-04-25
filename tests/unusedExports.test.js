import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { detectUnusedExports } from '../src/utils/detectUnusedExports.js'

vi.mock('fs')

const mockFile = path.resolve('fileA.js')
const mockImportFile = path.resolve('fileB.js')

beforeEach(() => {
  vi.restoreAllMocks()
})

it('detects unused named and default exports', () => {
  fs.readFileSync = vi.fn((filePath) => {
    if (filePath === mockFile) return `export const foo = 1; export default function bar() {}`
    if (filePath === mockImportFile) return `import bar from './fileA'`
    return ''
  })

  const result = detectUnusedExports([mockFile, mockImportFile])
  const unused = result[mockFile] || []
  expect(unused).toContain('foo')
  expect(unused).not.toContain('default')
})

it('handles ExportNamedDeclaration with specifiers', () => {
  fs.readFileSync = vi.fn((filePath) => {
    if (filePath === mockFile) return `const a = 1; export { a };`
    return ''
  })

  const result = detectUnusedExports([mockFile, mockImportFile])
  const unused = result[mockFile] || []
  expect(unused).toContain('a')
})

it('handles ExportDefaultDeclaration unnamed', () => {
  fs.readFileSync = vi.fn((filePath) => {
    if (filePath === mockFile) return `export default () => {}`
    if (filePath === mockImportFile) return `import x from './fileA'`
    return ''
  })

  const result = detectUnusedExports([mockFile, mockImportFile])
  const unused = result[mockFile] || []
  expect(unused).not.toContain('default')
})

it('detects symbols used via member expressions and function calls', () => {
  fs.readFileSync = vi.fn((filePath) => {
    if (filePath === mockFile) return `export function boom() {}; export const x = 1;`
    if (filePath === mockImportFile) return `boom(); console.log(x);`
    return ''
  })

  const result = detectUnusedExports([mockFile, mockImportFile])
  expect(result[mockFile]).toContain('x')
})

it('handles parse error in importer file', () => {
  fs.readFileSync = vi.fn((filePath) => {
    if (filePath === mockFile) return `export const x = 1;`
    if (filePath === mockImportFile) return `const ! = error` 
    return ''
  })

  const result = detectUnusedExports([mockFile, mockImportFile])
  const unused = result[mockFile] || []
  expect(unused).toContain('x')
})
