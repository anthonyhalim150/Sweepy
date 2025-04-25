import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { generateHtmlReport } from '../src/reporters/htmlReporter.js'

describe('generateHtmlReport()', () => {
  const testPath = 'temp-report.html'

  beforeEach(() => {
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('writes HTML with all sections populated', () => {
    const data = {
      unusedJS: ['a.js'],
      unusedCSS: ['style.css'],
      unusedAssets: ['img.png'],
      unusedExports: { 'util.js': ['foo', 'bar'] },
      unusedCssSelectors: { 'main.css': ['.hidden'] },
      unusedEnv: { unused: ['API_KEY'] },
      unusedDependencies: ['lodash'],
      missingDependencies: ['react'],
      unresolvedDependencies: ['custom-module'],
      deadAliases: {
        webpack: { '@shared': 'src/shared' }
      },
      unusedVars: {
        'foo.js': [{ name: 'temp', line: 1 }]
      }
    }

    generateHtmlReport(data, testPath)

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve(testPath),
      expect.stringContaining('<title>Sweepy Report</title>'),
      'utf-8'
    )
  })

  it('writes minimal HTML when all values are empty', () => {
    const data = {
      unusedJS: [],
      unusedCSS: [],
      unusedAssets: [],
      unusedExports: {},
      unusedCssSelectors: {},
      unusedEnv: { unused: [] },
      unusedDependencies: [],
      missingDependencies: [],
      unresolvedDependencies: [],
      deadAliases: {},           
      unusedVars: {}
    }

    generateHtmlReport(data, testPath)

    const html = fs.writeFileSync.mock.calls[0][1]
    expect(html).toContain('<h1>🧹 Sweepy Report</h1>')
    expect(html).not.toContain('<section><h2>')
  })
})
