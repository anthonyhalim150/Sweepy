import { describe, it, expect, vi } from 'vitest'
import { handleInlineHelp } from '../src/cli/helpHandlers.js'

describe('handleInlineHelp()', () => {
  it('does not throw when --only --help is passed', () => {
    const spy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('mock-exit') })
    expect(() => handleInlineHelp(['--only', '--help'])).toThrow('mock-exit')
    spy.mockRestore()
  })
})
