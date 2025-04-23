import { describe, it, expect } from 'vitest'
import { findUnusedFiles } from '../src/core/detector.js'
import path from 'path'

describe('Asset detection logic', () => {
  const projectDir = path.resolve('tests/fixtures')

  it('detects unused image assets', async () => {
    const result = await findUnusedFiles(projectDir, [], false)


    const unusedAssets = result.unusedAssets || []
    const hasIconPng = unusedAssets.some(file => file.endsWith('icon.png'))
    expect(hasIconPng).toBe(false)
  })
})
