import { describe, it, expect, vi } from 'vitest'
import { createSweepyCLI } from '../src/cli/createSweepyCLI.js'

describe('createSweepyCLI()', () => {
  it('sets CLI name, description, usage and help text', () => {
    const cli = createSweepyCLI()
    expect(cli.name()).toBe('sweepy')
    expect(cli.description()).toMatch(/unused/)
    expect(cli.usage()).toBe('[options]')
  })

  it('exits with code 0 on helpDisplayed', () => {
    const cli = createSweepyCLI()
    const exit = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })
    expect(() => cli._exitCallback({ code: 'commander.helpDisplayed' })).toThrow('exit')
    expect(exit).toHaveBeenCalledWith(0)
    exit.mockRestore()
  })

  it('exits with code 1 on unknownOption', () => {
    const cli = createSweepyCLI()
    const exit = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })
    const error = new Error('Unknown option')
    error.code = 'commander.unknownOption'
    expect(() => cli._exitCallback(error)).toThrow('exit')
    expect(exit).toHaveBeenCalledWith(1)
    exit.mockRestore()
  })

  it('throws unknown error types', () => {
    const cli = createSweepyCLI()
    const error = new Error('Other error')
    error.code = 'somethingElse'
    expect(() => cli._exitCallback(error)).toThrow('Other error')
  })
})
