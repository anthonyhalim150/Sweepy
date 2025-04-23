import { describe, it, expect } from 'vitest'
import { traceBinImports } from '../src/utils/traceBinImports.js'

describe('traceBinImports()', () => {
  it('resolves imports from a valid entry file', () => {
    const result = traceBinImports('index.js', ['.js', '.ts'])
    expect(Array.isArray(result)).toBe(true)
  })
})
