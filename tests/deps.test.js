import { describe, it, expect } from 'vitest'
import path from 'path'
import fs from 'fs'
import { runDepcheckSweepy } from '../src/utils/dependencyChecker.js'

describe('runDepcheckSweepy()', () => {
  const validDir = path.resolve('tests/fixtures')
  const invalidDir = path.resolve('tests/no-package-json')

  it('detects unused and undeclared dependencies', async () => {
    const result = await runDepcheckSweepy(validDir)

    expect(result.unusedDependencies).toContain('axios')
    expect(result.missingDependencies).toContain('react')
    expect(result.missingDependencies).not.toContain('chalk')
  })

  it('returns empty arrays if package.json does not exist', async () => {

    if (fs.existsSync(path.join(invalidDir, 'package.json'))) {
      fs.unlinkSync(path.join(invalidDir, 'package.json'))
    }

    const result = await runDepcheckSweepy(invalidDir)
    expect(result).toEqual({
      unusedDependencies: [],
      missingDependencies: []
    })
  })
})
