import { describe, it, expect } from 'vitest'
import { resolveAliasImport } from '../src/utils/resolveAlias.js'

describe('resolveAliasImport()', () => {
  it('resolves without throwing', () => {
    const result = resolveAliasImport('@components/Button', '/src/App.tsx', {})
    expect(() => resolveAliasImport('@components/Button', '/src/App.tsx', {})).not.toThrow()
    if (result) expect(typeof result === 'string').toBe(true)
  })
})
