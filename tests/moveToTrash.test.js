import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { moveToTrash, ensureTrashDir } from '../src/utils/moveToTrash.js'

vi.mock('fs')

const mockFilePath = '/project/src/file.js'
const trashDir = path.resolve(process.cwd(), '.sweepy-trash')
const manifestPath = path.join(trashDir, 'manifest.json')

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('moveToTrash', () => {
  it('creates .sweepy-trash and manifest if missing', () => {
    fs.existsSync = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(false)
    fs.mkdirSync = vi.fn()
    fs.writeFileSync = vi.fn()

    ensureTrashDir()

    expect(fs.mkdirSync).toHaveBeenCalledWith(trashDir)
    expect(fs.writeFileSync).toHaveBeenCalledWith(manifestPath, '{}')
  })

  it('moves file to trash and updates manifest', () => {
    fs.existsSync = vi.fn()
      .mockReturnValueOnce(true) // trashDir exists
      .mockReturnValueOnce(true) // manifest exists
      .mockReturnValueOnce(false) // targetPath doesn't exist
    fs.readFileSync = vi.fn().mockReturnValue('{}')
    fs.renameSync = vi.fn()
    fs.writeFileSync = vi.fn()

    moveToTrash(mockFilePath)

    const fileName = path.basename(mockFilePath)
    const finalPath = path.join(trashDir, fileName)

    expect(fs.renameSync).toHaveBeenCalledWith(mockFilePath, finalPath)

    const writeCall = fs.writeFileSync.mock.calls.find(call => call[0] === manifestPath)
    expect(writeCall).toBeDefined()
    const manifestJSON = JSON.parse(writeCall[1])
    expect(manifestJSON).toHaveProperty(fileName, mockFilePath)
  })

  it('moves file with incremented name if conflict exists', () => {
    const fileName = 'file.js'
    const finalPath1 = path.join(trashDir, fileName)
    const finalPath2 = path.join(trashDir, 'file-1.js')

    fs.existsSync = vi.fn()
      .mockReturnValueOnce(true) // trashDir exists
      .mockReturnValueOnce(true) // manifest exists
      .mockReturnValueOnce(true) // file.js exists
      .mockReturnValueOnce(false) // file-1.js doesn't exist
    fs.readFileSync = vi.fn().mockReturnValue('{}')
    fs.renameSync = vi.fn()
    fs.writeFileSync = vi.fn()

    moveToTrash(mockFilePath)

    expect(fs.renameSync).toHaveBeenCalledWith(mockFilePath, finalPath2)

    const writeCall = fs.writeFileSync.mock.calls.find(call => call[0] === manifestPath)
    expect(writeCall).toBeDefined()
    const manifestJSON = JSON.parse(writeCall[1])
    expect(manifestJSON).toHaveProperty('file-1.js', mockFilePath)
  })
})
