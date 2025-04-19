import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { moveToTrash } from '../src/utils/moveToTrash.js'

const testFile = path.resolve('.test-file.js')
const trashDir = path.resolve('.sweepy-trash')

beforeEach(() => {
  fs.writeFileSync(testFile, '// mock file')
})

afterEach(() => {
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
  if (fs.existsSync(trashDir)) fs.rmSync(trashDir, { recursive: true, force: true })
})

describe('moveToTrash()', () => {
  it('moves a file into .sweepy-trash and updates manifest.json', () => {
    moveToTrash(testFile)

    const trashedFiles = fs.readdirSync(trashDir)
    const trashedName = trashedFiles.find(f => f.startsWith('.test-file'))
    const manifestPath = path.join(trashDir, 'manifest.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

    expect(trashedName).toBeDefined()
    expect(manifest[trashedName]).toBe(testFile)
  })
})
