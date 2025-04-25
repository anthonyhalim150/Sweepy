import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as aliasLoader from '../src/utils/resolveMoreAliases.js'
import * as tsAliasLoader from '../src/utils/resolveAlias.js'
import { detectDeadAliases } from '../src/utils/detectDeadAliases.js'

describe('detectDeadAliases()', () => {
  beforeEach(() => {
    vi.spyOn(tsAliasLoader, 'loadTSPaths').mockReturnValue({ '@tsalias': 'nonexistent/ts' })
    vi.spyOn(aliasLoader, 'loadWebpackAliases').mockReturnValue({ '@webpack': 'nonexistent/webpack' })
    vi.spyOn(aliasLoader, 'loadBabelAliases').mockReturnValue({ '@babel': 'nonexistent/babel' })
    vi.spyOn(aliasLoader, 'loadViteAliases').mockReturnValue({ '@vite': 'nonexistent/vite' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns all dead aliases if paths do not exist', () => {
    const result = detectDeadAliases(process.cwd())

    expect(result).toHaveProperty('tsconfig.@tsalias', 'nonexistent/ts')
    expect(result).toHaveProperty('webpack.@webpack', 'nonexistent/webpack')
    expect(result).toHaveProperty('babel.@babel', 'nonexistent/babel')
    expect(result).toHaveProperty('vite.@vite', 'nonexistent/vite')
  })
})
