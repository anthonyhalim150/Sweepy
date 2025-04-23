import { loadConfig } from '../src/config/config.js'
import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const pkgPath = path.join(process.cwd(), 'package.json')
const backup = fs.readFileSync(pkgPath, 'utf-8')

describe('loadConfig()', () => {
  beforeAll(() => {
    const pkg = JSON.parse(backup)
    pkg.sweepy = { ignore: ['dist/**'], customCssSafelist: ['.safe'] }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  })

  afterAll(() => {
    fs.writeFileSync(pkgPath, backup)
  })

  it('loads ignore patterns and safelist from package.json', () => {
    const config = loadConfig(process.cwd(), ['custom/**'])
    expect(config.ignore).toContain('custom/**')
    expect(config.ignore).toContain('dist/**')
    expect(config.customCssSafelist).toContain('.safe')
  })
})
