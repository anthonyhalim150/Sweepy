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

  pkg.sweepy = {
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
      '**/.vercel/**',
      '**/.turbo/**',
      '**/.parcel-cache/**',
      '**/.cache/**',
      '**/.vite/**',
      '**/*.d.ts',
      '.sweepy-trash/**',
      '**/test/**',
      '**/tests/**',
      '**/__tests__/**',
      '**/__mocks__/**',
      '**/*.spec.*',
      '**/*.test.*',
      '**/*.snap',
      '**/*.log',
      '**/*.tmp',
      '**/.sweepy-report.*',
      '**/package-lock.json',
      '**/pnpm-lock.yaml',
      '**/yarn.lock',
      '**/cypress/**',
      '**/playwright/**',
      '**/.eslintcache',
      '**/.stylelintcache',
      '**/.DS_Store',
      '**/Thumbs.db'
    ],
    output: 'json',
    types: ['js', 'css', 'assets'],
    customAliases: {
      '@components': 'src/components',
      '@utils': 'src/utils'
    },
    customCssSafelist: [
      "^\\.status$",
      "^\\.active$",
      "^\\.suspended$"
    ]
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  console.log('✅ sweepy config block with full ignore and custom configs added to package.json')
}
