import fs from 'fs'
import path from 'path'
import { describe, it, expect, afterEach } from 'vitest'
import { detectUnusedEnvKeys } from '../src/utils/detectUnusedEnvKeys.js'

const envPath = path.resolve('.env')

afterEach(() => {
  if (fs.existsSync(envPath)) fs.unlinkSync(envPath)
})

describe('detectUnusedEnvKeys', () => {
  it('flags unused env keys from .env', async () => {
    fs.writeFileSync(envPath, 'UNUSED_VAR=hello\\n')

    const result = await detectUnusedEnvKeys(
      '.', ['node_modules/**']
    )

    expect(result.unused).toContain('UNUSED_VAR')
  })
})
