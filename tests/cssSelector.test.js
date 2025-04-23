import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { detectUnusedCssSelectors } from '../src/utils/detectUnusedCssSelectors.js'

const cssPath = 'tests/fixtures/style.css'

beforeAll(() => {
  fs.mkdirSync(path.resolve('temp'), { recursive: true })
})


describe('detectUnusedCssSelectors', () => {
  it('detects unused class selectors in CSS', async () => {
    const contentMap = new Map([
      ['used.html', '<div class="used"></div>']
    ])

    const result = await detectUnusedCssSelectors([cssPath], contentMap)
    expect(result[cssPath]).toContain('.unused-class')
  })

  it('respects safelist and omits matching selectors', async () => {
    const contentMap = new Map([
      ['used.html', '<div class="used"></div>']
    ])

    const result = await detectUnusedCssSelectors(
      [cssPath],
      contentMap,
      [],
      ['^\\.unused-class$']
    )

    expect(result[cssPath] ?? []).not.toContain('.unused-class')
  })

  it('detects keyframes and animations', async () => {
    const cssContent = `
      @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
      .foo { animation: fadeOut 2s } 
    `
    const cssFile = 'temp/test-keyframes.css'
    fs.writeFileSync(cssFile, cssContent, 'utf8')

    const contentMap = new Map([
      ['used.html', '<div class="foo"></div>']
    ])

    const result = await detectUnusedCssSelectors([cssFile], contentMap)
    expect(result[cssFile] || []).not.toContain('@keyframes fadeOut')

    fs.unlinkSync(cssFile)
  })

  it('detects classnames/clsx usage in code', async () => {
    const jsCode = `
      import clsx from 'clsx'
      const cls = clsx('hidden', 'shown')
    `
    const contentMap = new Map([['file.jsx', jsCode]])
    const css = '.hidden {} .shown {} .gone {}'
    const cssFile = 'temp/code-based.css'
    fs.writeFileSync(cssFile, css, 'utf8')

    const result = await detectUnusedCssSelectors([cssFile], contentMap)
    expect(result[cssFile]).toContain('.gone')

    fs.unlinkSync(cssFile)
  })

  it('detects CSS modules and usage in member expression', async () => {
    const code = `
      import styles from './file.module.css'
      const cls = styles.active
    `
    const contentMap = new Map([['file.jsx', code]])
    const cssFile = 'temp/modules.module.css'
    fs.writeFileSync(cssFile, `.active {}`, 'utf8')

    const result = await detectUnusedCssSelectors([cssFile], contentMap)
    expect(result[cssFile]).toBeUndefined()

    fs.unlinkSync(cssFile)
  })

  it('ignores non-parsable JS file', async () => {
    const contentMap = new Map([['bad.jsx', 'const < = invalid']])
    const cssFile = 'temp/bad.css'
    fs.writeFileSync(cssFile, `.error {}`, 'utf8')

    const result = await detectUnusedCssSelectors([cssFile], contentMap)
    expect(result[cssFile]).toContain('.error')

    fs.unlinkSync(cssFile)
  })
})
