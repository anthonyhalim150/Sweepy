import { describe, it, expect, vi } from 'vitest'


vi.mock('../src/cli/index.js', () => ({}))

describe('project root index.js', () => {
  it('loads without throwing', async () => {
    await expect(import('../index.js')).resolves.not.toThrow()
  })
})
