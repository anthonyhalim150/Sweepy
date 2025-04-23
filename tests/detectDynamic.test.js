import { describe, it, expect, vi, beforeEach } from 'vitest'
import path from 'path'
import fs from 'fs'
import { detectDynamicUsedFiles } from '../src/utils/detectDynamicUsage.js'

// Mock
vi.mock('fs')

const baseFile = path.resolve('test/fixtures/index.js')
const dynamicFolder = path.resolve('test/fixtures/modules')
const fileA = path.join(dynamicFolder, 'a.js')
const fileB = path.join(dynamicFolder, 'b.js')

beforeEach(() => {
  vi.restoreAllMocks()
})

it('skips unreadable files', () => {
  fs.readFileSync.mockImplementation(() => { throw new Error('fail') })
  const result = detectDynamicUsedFiles([baseFile])
  expect([...result]).toEqual([])
})

it('skips unparsable files', () => {
  fs.readFileSync.mockReturnValue('invalid %code')
  const result = detectDynamicUsedFiles([baseFile])
  expect([...result]).toEqual([])
})

it('detects dynamic fs.readdirSync usage and returns file paths', () => {
  const code = `
    const fs = require('fs')
    const entries = fs.readdirSync('./modules')
  `
  fs.readFileSync.mockReturnValue(code)
  fs.existsSync.mockImplementation((p) => p === dynamicFolder || p === fileA || p === fileB)
  fs.readdirSync.mockReturnValue(['a.js', 'b.js'])
  fs.statSync.mockReturnValue({ isFile: () => true })

  const result = detectDynamicUsedFiles([baseFile])
  expect([...result]).toContain(fileA.replace(/\\/g, '/'))
  expect([...result]).toContain(fileB.replace(/\\/g, '/'))
})

it('skips folder if not found', () => {
  const code = `
    const fs = require('fs')
    fs.readdirSync('./modules')
  `
  fs.readFileSync.mockReturnValue(code)
  fs.existsSync.mockReturnValue(false)

  const result = detectDynamicUsedFiles([baseFile])
  expect([...result]).toEqual([])
})

it('skips entry if not file', () => {
  const code = `
    const fs = require('fs')
    fs.readdirSync('./modules')
  `
  fs.readFileSync.mockReturnValue(code)
  fs.existsSync.mockImplementation((p) => p === dynamicFolder || p === fileA)
  fs.readdirSync.mockReturnValue(['a.js'])
  fs.statSync.mockReturnValue({ isFile: () => false }) // simulate directory

  const result = detectDynamicUsedFiles([baseFile])
  expect([...result]).toEqual([])
})
