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
      missingDependencies: [],
      deadAliases: {},
      unusedVars: {}
    })
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/sweepy clean/i))
  })

  it('prints all main report sections when unused data exists', () => {
    printReport({
      unusedJS: ['file1.js'],
      unusedCSS: ['file2.css'],
      unusedAssets: ['img.png'],
      unusedExports: { 'file3.js': ['unusedFunc'] },
      unusedCssSelectors: { 'file4.css': ['.unused-class'] },
      unusedEnv: { unused: ['API_KEY'] },
      unusedDependencies: ['lodash'],
      missingDependencies: ['chalk'],
      deadAliases: {},
      unusedVars: {}
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

  it('prints dead aliases and unused vars (lines 82–98)', () => {
    printReport({
      unusedJS: [],
      unusedCSS: [],
      unusedAssets: [],
      unusedExports: {},
      unusedCssSelectors: {},
      unusedEnv: { unused: [] },
      unusedDependencies: [],
      missingDependencies: [],
      deadAliases: {
        tsconfig: { '@alias': './not-found.js' }
      },
      unusedVars: {
        'src/file.js': [
          { name: 'temp', line: 10 },
          { name: '', line: null }
        ]
      }
    })

    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Dead Alias Paths/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/@alias → .\/not-found.js/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Unused Variables/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('temp (line 10)'))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('-'))
  })

  it('prints JSON output with printJsonReport()', () => {
    const jsonSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const result = { unusedJS: ['a.js'] }
    printJsonReport(result)
    expect(jsonSpy).toHaveBeenCalledWith(JSON.stringify(result, null, 2))
    jsonSpy.mockRestore()
  })
})
