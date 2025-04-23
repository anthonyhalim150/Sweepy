import { promptFileDeletion } from '../src/cli/prompts.js'
import { describe, it, expect, vi } from 'vitest'

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn().mockResolvedValue({ toDelete: ['file1.js'] })
  }
}))

describe('promptFileDeletion()', () => {
  it('returns selected files from inquirer prompt', async () => {
    const files = ['file1.js', 'file2.js']
    const result = await promptFileDeletion(files)
    expect(result).toEqual(['file1.js'])
  })
})
