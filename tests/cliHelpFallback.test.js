import { describe, it, expect, vi } from 'vitest'
import { handleInlineHelp } from '../src/cli/helpHandlers.js'

describe('handleInlineHelp()', () => {
  it('triggers detect help for missing --detect value', () => {
    const spy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    try {
      handleInlineHelp(['--detect']) 
    } catch {}

    expect(log).toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
    log.mockRestore()
  })
})
