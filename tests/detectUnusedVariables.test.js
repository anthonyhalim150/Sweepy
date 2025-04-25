import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { detectUnusedVariables } from '../src/utils/detectUnusedVariables.js'

const testRoot = path.join(process.cwd(), '__tmp_vars_test__')
const srcPath = path.join(testRoot, 'code.js')

beforeEach(() => {
  fs.mkdirSync(testRoot, { recursive: true })
})

afterEach(() => {
  fs.rmSync(testRoot, { recursive: true, force: true })
})

it('returns undefined or empty when all variables are used', async () => {
  fs.writeFileSync(srcPath, `
    let x = 1;
    console.log(x);
  `)

  const result = await detectUnusedVariables(testRoot, [])

  expect(result).toEqual({})
})
