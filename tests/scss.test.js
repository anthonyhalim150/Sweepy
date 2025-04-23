import { describe, it, expect } from 'vitest'
import { detectUnusedCssSelectors } from '../src/utils/detectUnusedCssSelectors.js'
import path from 'path'

describe('detectUnusedCssSelectors()', () => {
  const scssPath = path.resolve('tests/fixtures/theme.scss')
  const htmlMap = new Map([
    [path.resolve('virtual.jsx'), '<div className="used-style" />']
  ])

  it('detects unused class selectors', async () => {
    const result = await detectUnusedCssSelectors(
      [scssPath],
      htmlMap,
      []
    )

    const unused = result[scssPath] || []

    expect(unused).toContain('.unused-style')
    expect(unused).not.toContain('.used-style')
  })
})
