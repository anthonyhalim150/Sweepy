import { describe, it, expect } from 'vitest'
import { detectUnusedExports } from '../src/utils/detectUnusedExports.js'

describe('detectUnusedExports', () => {
  it('flags unused named exports', () => {
    const result = detectUnusedExports(['tests/fixtures/exportTest.js'])
    expect(result['tests/fixtures/exportTest.js']).toContain('unusedFunction')
  })
})