import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { printReport, printJsonReport } from '../src/reporters/consoleReporter.js'

describe('consoleReporter', () => {
  let logSpy

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('prints a clean message when no unused files exist', () => {
    printReport({
      unusedJS: [],
      unusedCSS: [],
      unusedAssets: [],
      unusedExports: {},
      unusedCssSelectors: {},
      unusedEnv: { unused: [] },
      unusedDependencies: [],
      missingDependencies: []
    })
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/sweepy clean/i))
  })

  it('prints all sections if unused data exists', () => {
    printReport({
      unusedJS: ['file1.js'],
      unusedCSS: ['file2.css'],
      unusedAssets: ['img.png'],
      unusedExports: { 'file3.js': ['unusedFunc'] },
      unusedCssSelectors: { 'file4.css': ['.unused-class'] },
      unusedEnv: { unused: ['API_KEY'] },
      unusedDependencies: ['lodash'],
      missingDependencies: ['chalk']
    })

    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Unused JS\/TS files/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Unused CSS\/SCSS files/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Orphaned assets/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Unused exports/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Unused CSS Selectors/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Unused \.env Keys/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Unused npm dependencies/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Missing.*dependencies/))
  })

  it('prints JSON output with printJsonReport', () => {
    const jsonSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const result = { unusedJS: ['a.js'] }
    printJsonReport(result)
    expect(jsonSpy).toHaveBeenCalledWith(JSON.stringify(result, null, 2))
  })
})
