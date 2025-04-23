import { describe, it, expect } from 'vitest'
import { filterByTypes } from '../src/utils/filterByTypes.js'

describe('filterByTypes()', () => {
  const mockResult = {
    unusedJS: ['file1.js'],
    unusedCSS: ['style.scss'],
    unusedAssets: ['image.png']
  }

  it('filters js only', () => {
    const result = filterByTypes(mockResult, ['js'])
    expect(result).toEqual({ unusedJS: ['file1.js'], unusedCSS: [], unusedAssets: [] })
  })

  it('filters css only', () => {
    const result = filterByTypes(mockResult, ['css'])
    expect(result).toEqual({ unusedJS: [], unusedCSS: ['style.scss'], unusedAssets: [] })
  })

  it('filters all types', () => {
    const result = filterByTypes(mockResult, ['js', 'css', 'assets'])
    expect(result).toEqual(mockResult)
  })
})
