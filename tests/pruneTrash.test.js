import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeAll } from 'vitest'
import { pruneSweepyTrash } from '../src/utils/pruneTrash.js'

const trashPath = path.resolve('.sweepy-trash/sample.js')

describe('pruneSweepyTrash()', () => {
  beforeAll(() => {
    fs.mkdirSync('.sweepy-trash', { recursive: true })
    fs.writeFileSync(trashPath, 'trash')
  })

  it('deletes all contents of .sweepy-trash', () => {
    pruneSweepyTrash()
    expect(fs.existsSync(trashPath)).toBe(false)
  })
})
