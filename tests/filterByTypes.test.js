import { describe, it, expect } from 'vitest'
import { filterByTypes } from '../src/utils/filterByTypes.js'

describe('filterByTypes()', () => {
  const baseResult = {
    unusedJS: ['file1.js'],
    unusedCSS: ['style.scss'],
    unusedAssets: ['image.png'],
    unusedExports: { 'file1.js': ['unused'] },
    unusedCssSelectors: { 'style.scss': ['.unused'] },
    unusedEnv: { unused: ['MY_KEY'] },
    deadAliases: {
      tsconfig: {
        '@alias': 'src/file1.js',
        '@not-matched': 'src/ignored.txt'
      }
    },
    unusedDependencies: [],
    missingDependencies: [],
    unusedVars: { 'file1.js': [{ name: 'x', line: 1 }] }
  }

  it('filters js only', () => {
    const result = filterByTypes(baseResult, ['js'])

    expect(result.unusedJS).toEqual(['file1.js'])
    expect(result.unusedExports).toEqual({ 'file1.js': ['unused'] })
    expect(result.unusedVars).toEqual({ 'file1.js': [{ name: 'x', line: 1 }] })
    expect(result.deadAliases).toEqual({
      tsconfig: { '@alias': 'src/file1.js' }
    })
    expect(result.unusedEnv).toBe(null)
  })

  it('filters css only', () => {
    const result = filterByTypes(baseResult, ['css'])

    expect(result.unusedCSS).toEqual(['style.scss'])
    expect(result.unusedCssSelectors).toEqual({ 'style.scss': ['.unused'] })
    expect(result.unusedVars).toEqual({ 'file1.js': [{ name: 'x', line: 1 }] })
    expect(result.unusedEnv).toBe(null)
  })

  it('filters all types', () => {
    const result = filterByTypes(baseResult, ['js', 'css', 'png', 'env'])

    expect(result.unusedJS).toEqual(['file1.js'])
    expect(result.unusedCSS).toEqual(['style.scss'])
    expect(result.unusedAssets).toEqual(['image.png'])
    expect(result.unusedExports).toEqual({ 'file1.js': ['unused'] })
    expect(result.unusedCssSelectors).toEqual({ 'style.scss': ['.unused'] })
    expect(result.unusedVars).toEqual({ 'file1.js': [{ name: 'x', line: 1 }] })
    expect(result.deadAliases).toEqual({
      tsconfig: { '@alias': 'src/file1.js' }
    })
    expect(result.unusedEnv).toEqual({ unused: ['MY_KEY'] })
  })
})
