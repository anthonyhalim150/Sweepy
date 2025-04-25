import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeTextReport } from '../src/reporters/writeTextReport.js'

const REPORT_PATH = path.resolve('test-report.txt')
const REPORT_UNNAMED = path.resolve('test-report-unnamed.txt')

const mockResult = {
  unusedJS: ['file1.js'],
  unusedCSS: ['style.scss'],
  unusedAssets: ['image.png'],
  unusedExports: {
    'file2.js': ['unusedFunc', 'unusedVar']
  },
  unusedCssSelectors: {
    'style.scss': ['.btn', '.header']
  },
  unusedEnv: {
    unused: ['API_KEY', 'SECRET_TOKEN']
  },
  unusedDependencies: ['lodash', 'axios'],
  missingDependencies: ['react-dom'],
  deadAliases: {
    webpack: { '@shared': 'src/shared-does-not-exist' }
  },
  unusedVars: {
    'src/utils.js': [{ name: 'temp', line: 12 }, { name: 'debug', line: 34 }]
  }
}

describe('writeTextReport()', () => {
  beforeEach(() => {
    for (const path of [REPORT_PATH, REPORT_UNNAMED]) {
      if (fs.existsSync(path)) fs.unlinkSync(path)
    }
  })

  afterEach(() => {
    for (const path of [REPORT_PATH, REPORT_UNNAMED]) {
      if (fs.existsSync(path)) fs.unlinkSync(path)
    }
  })

  it('writes a full sweepy report to file correctly', () => {
    writeTextReport(mockResult, REPORT_PATH)

    const content = fs.readFileSync(REPORT_PATH, 'utf-8')

    expect(content).toContain('📘 Unused JS/TS files:')
    expect(content).toContain('🎨 Unused CSS/SCSS files:')
    expect(content).toContain('🖼️ Orphaned assets:')
    expect(content).toContain('📤 Unused exports by file:')
    expect(content).toContain('🧷 Unused CSS Selectors by file:')
    expect(content).toContain('🔐 Unused .env Keys:')
    expect(content).toContain('📦 Unused npm dependencies:')
    expect(content).toContain('❗ Missing (used but undeclared) dependencies:')
    expect(content).toContain('🧭 Dead Alias Paths:')
    expect(content).toContain('🕳️ Unused Variables:')

    expect(content).toContain('• file1.js')
    expect(content).toContain('• API_KEY')
    expect(content).toContain('• @shared → src/shared-does-not-exist')
    expect(content).toContain('- temp (line 12)')
  })

  it('writes unnamed and line-less unused vars correctly', () => {
    const minimalResult = {
      unusedJS: [],
      unusedCSS: [],
      unusedAssets: [],
      unusedExports: {},
      unusedCssSelectors: {},
      unusedEnv: null,
      unusedDependencies: [],
      missingDependencies: [],
      deadAliases: {},
      unusedVars: {
        'src/foo.js': [{}]
      }
    }

    writeTextReport(minimalResult, REPORT_UNNAMED)
    const content = fs.readFileSync(REPORT_UNNAMED, 'utf-8')

    expect(content).toContain('[unnamed]')
    expect(content).not.toMatch(/\(line/)
  })
  it('writes unused HTML, JSON, and config files to the report', () => {
    const extendedResult = {
      ...mockResult,
      unusedHTML: ['index.html', 'about.html'],
      unusedJSON: ['data.json'],
      unusedConfigs: ['.babelrc', 'tsconfig.extra.json']
    }
  
    writeTextReport(extendedResult, REPORT_PATH)
    const content = fs.readFileSync(REPORT_PATH, 'utf-8')
  
    expect(content).toContain('📄 Unused HTML files:')
    expect(content).toContain('• index.html')
    expect(content).toContain('🗂️ Unused JSON files:')
    expect(content).toContain('• data.json')
    expect(content).toContain('⚙️ Unused or duplicate config files:')
    expect(content).toContain('• .babelrc')
  })
  
})
