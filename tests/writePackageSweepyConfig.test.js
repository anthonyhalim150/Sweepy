import fs from 'fs'
import path from 'path'
import { describe, it, expect, afterAll } from 'vitest'
import { writeSweepyConfigToPackage } from '../src/utils/writePackageSweepyConfig.js'

const pkgPath = path.join(process.cwd(), 'package.json')
const backup = fs.readFileSync(pkgPath, 'utf-8')

describe('writeSweepyConfigToPackage', () => {
  afterAll(() => {

    fs.writeFileSync(pkgPath, backup)
  })

  it('adds sweepy config to package.json', () => {
    writeSweepyConfigToPackage()
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

    expect(pkg.sweepy.ignore).toContain('**/build/**')
  })
})
