import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { moveToTrash } from '../src/utils/moveToTrash.js'
import { recoverFile } from '../src/utils/recoverFromTrash.js'

const testFile = path.resolve('.recover-test-file.js')
const trashDir = path.resolve('.sweepy-trash')
const manifestPath = path.join(trashDir, 'manifest.json')

beforeEach(() => {
  fs.writeFileSync(testFile, '// recover mock')
})

afterEach(() => {
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
  if (fs.existsSync(trashDir)) fs.rmSync(trashDir, { recursive: true, force: true })
})

describe('recoverFile()', () => {
  it('restores a file from .sweepy-trash back to its original location', () => {
    moveToTrash(testFile)
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    const trashedName = Object.keys(manifest).find(name => name.startsWith('.recover-test-file'))

    recoverFile(trashedName)

    const fileExists = fs.existsSync(testFile)
    const updatedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

    expect(fileExists).toBe(true)
    expect(updatedManifest[trashedName]).toBeUndefined()
  })
})