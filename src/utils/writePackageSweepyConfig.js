import fs from 'fs'
import path from 'path'

export function writeSweepyConfigToPackage(cwd = process.cwd()) {
  const pkgPath = path.join(cwd, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.log('❌ No package.json found in this directory.')
    return
  }

  const raw = fs.readFileSync(pkgPath, 'utf-8')
  const pkg = JSON.parse(raw)

  if (pkg.sweepy) {
    console.log('⚠️  sweepy config already exists in package.json')
    return
  }

  pkg.sweepy = {
    ignore: ['dist/**', 'build/**', '*.test.*'],
    output: 'json',
    types: ['js', 'css', 'assets']
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  console.log('✅ sweepy config block added to package.json')
}
