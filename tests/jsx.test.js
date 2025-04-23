import { describe, it, expect } from 'vitest'
import path from 'path'
import { findUnusedFiles } from '../src/core/detector.js'

describe('findUnusedFiles()', () => {
  const cwd = path.resolve('tests/fixtures')

  it('excludes test.jsx when used in App.tsx', async () => {
    const result = await findUnusedFiles(cwd, [], false, null, ['js'])

    const unusedJS = result.unusedJS.map(f => f.toLowerCase())
    const testFile = path.resolve(cwd, 'test.jsx').toLowerCase()
    expect(unusedJS).not.toContain(testFile)
  })
})
