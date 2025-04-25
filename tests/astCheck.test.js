import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { extractImportsFromFiles } from '../src/core/astAnalyzer.js'
import * as aliasUtil from '../src/utils/resolveAlias.js'



const mockFile = path.resolve('test/fixtures/component.js')
const aliasPath = path.resolve('src/components/Button.jsx')


vi.mock('fs')
vi.mock('../src/utils/resolveAlias.js', async (mod) => ({
  ...await vi.importActual('../src/utils/resolveAlias.js'),
  resolveAliasImport: vi.fn()
}))
vi.mock('../src/utils/resolveMoreAliases.js', () => ({
  loadWebpackAliases: () => ({ '@components': 'src/components' }),
  loadViteAliases: () => ({}),
  loadBabelAliases: () => ({})
}))

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(console, 'warn').mockImplementation(() => {}) 
})

describe('extractImportsFromFiles()', () => {
  it('skips non-js files', async () => {
    const used = await extractImportsFromFiles(['file.txt'])
    expect([...used]).toEqual([])
  })

  it('handles missing file read gracefully', async () => {
    fs.readFileSync.mockImplementation(() => { throw new Error('fail') })
    const used = await extractImportsFromFiles([mockFile])
    expect([...used]).toEqual([])
  })

  it('handles parse error gracefully', async () => {
    fs.readFileSync.mockReturnValue('const %invalid =')
    const used = await extractImportsFromFiles([mockFile])
    expect([...used]).toEqual([])
  })

  it('detects static import', async () => {
    fs.readFileSync.mockReturnValue("import Btn from '@components/Button'")
    aliasUtil.resolveAliasImport.mockReturnValue(aliasPath)
    fs.existsSync.mockReturnValue(true)

    const used = await extractImportsFromFiles([mockFile])
    expect([...used]).toContain(aliasPath)
  })

  it('detects require call', async () => {
    fs.readFileSync.mockReturnValue("const btn = require('@components/Button')")
    aliasUtil.resolveAliasImport.mockReturnValue(null)
    fs.existsSync.mockImplementation(p => p.endsWith('.jsx'))

    const used = await extractImportsFromFiles([mockFile])
    expect([...used].some(p => p.endsWith('Button.jsx'))).toBe(true)
  })

  it('handles ExportAllDeclaration for folder', async () => {
    const folder = path.resolve('test/fixtures/utils')
    const file1 = path.join(folder, 'a.js')
    const file2 = path.join(folder, 'b.ts')

    fs.readFileSync.mockReturnValue("export * from './utils'")
    fs.existsSync.mockImplementation(p => p === folder || p === file1 || p === file2)
    fs.statSync.mockReturnValue({ isDirectory: () => true })
    fs.readdirSync.mockReturnValue(['a.js', 'b.ts'])

    const used = await extractImportsFromFiles([mockFile])
    expect([...used]).toContain(file1)
    expect([...used]).toContain(file2)
  })
})
