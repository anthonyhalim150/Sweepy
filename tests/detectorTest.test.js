import { describe, it, expect } from 'vitest'
import { findUnusedFiles } from '../src/core/detector.js'
import fs from 'fs'
import path from 'path'

describe('findUnusedFiles()', () => {
  it('covers exports, env, css, and assets detection paths', async () => {
    const cwd = path.resolve('tests/fixtures/full-detect')
    const result = await findUnusedFiles(
      cwd,
      ['node_modules/**'],
      true, 
      null,
      ['js', 'css', 'assets', 'exports', 'env']
    )

    expect(result).toHaveProperty('unusedJS')
    expect(result).toHaveProperty('unusedCSS')
    expect(result).toHaveProperty('unusedAssets')
    expect(result).toHaveProperty('unusedExports')
    expect(result).toHaveProperty('unusedCssSelectors')
    expect(result).toHaveProperty('unusedEnv')
  })
})
