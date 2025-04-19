import fs from 'fs'
import path from 'path'

const DEFAULT_IGNORE = [
  'node_modules/',
  'dist/',
  'build/',
  'coverage/',
  'test/',
  '*.spec.*',
  '*.test.*'
]

export function generateSweepyIgnore(cwd = process.cwd()) {
  const target = path.join(cwd, '.sweepyignore')
  if (fs.existsSync(target)) {
    console.log('⚠️  .sweepyignore already exists. Not overwriting.')
    return
  }

  fs.writeFileSync(target, DEFAULT_IGNORE.join('\n'))
  console.log('✅ .sweepyignore created with default rules.')
}
