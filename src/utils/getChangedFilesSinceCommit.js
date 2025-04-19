import { execSync } from 'child_process'

export function getChangedFilesSinceCommit(commit) {
  try {
    const output = execSync(`git diff --name-only ${commit} HEAD`, { encoding: 'utf-8' })
    return output
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean)
  } catch (e) {
    console.error('❌ Git error:', e.message)
    return null
  }
}
