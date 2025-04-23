import { describe, it, expect, vi } from 'vitest'
import { getChangedFilesSinceCommit } from '../src/utils/getChangedFilesSinceCommit.js'

vi.mock('child_process', async () => {
  const actual = await vi.importActual('child_process')
  return {
    ...actual,
    execSync: vi.fn(() => 'src/foo.js\nsrc/bar.js\n')
  }
})

describe('getChangedFilesSinceCommit()', () => {
  it('returns a list of changed files or null if git fails', () => {
    const changed = getChangedFilesSinceCommit('HEAD~1')
    if (changed === null) {
      expect(changed).toBeNull()
    } else {
      expect(Array.isArray(changed)).toBe(true)
      expect(changed.includes('src/foo.js')).toBe(true)
    }
  })
})