import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { runSweepy } from '../src/cli/runSweepy.js'

vi.mock('../src/utils/writePackageSweepyConfig.js', () => ({
  writeSweepyConfigToPackage: vi.fn()
}))

vi.mock('../src/utils/pruneTrash.js', () => ({
  pruneSweepyTrash: vi.fn()
}))

vi.mock('../src/utils/recoverFromTrash.js', () => ({
  recoverInteractive: vi.fn()
}))

// Dynamically import the mocked exports AFTER vi.mock
import { writeSweepyConfigToPackage } from '../src/utils/writePackageSweepyConfig.js'
import { pruneSweepyTrash } from '../src/utils/pruneTrash.js'
import { recoverInteractive } from '../src/utils/recoverFromTrash.js'

describe('runSweepy() early exit', () => {
  let logSpy

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    writeSweepyConfigToPackage.mockClear()
    pruneSweepyTrash.mockClear()
    recoverInteractive.mockClear()
  })

  afterEach(() => {
    logSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('exits when --export has no extension', async () => {
    await runSweepy({ export: 'report' }, '/cwd')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('--export requires a valid file name'))
  })

  it('exits when --export is combined with deletion flags', async () => {
    await runSweepy({ export: 'out.json', delete: true }, '/cwd')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('--export cannot be combined'))
  })

  it('exits when recover=true without filename or interactive', async () => {
    await runSweepy({ recover: true }, '/cwd')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('--recover requires a filename'))
  })

  it('exits when --only is true without any types', async () => {
    await runSweepy({ only: true }, '/cwd')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('--only requires at least one type'))
  })

  it('exits when --interactive is true but no --delete or --recover', async () => {
    await runSweepy({ interactive: true }, '/cwd')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('--interactive must be combined'))
  })

  it('exits when delete is true but no confirm/interactive/dry-run', async () => {
    await runSweepy({ delete: true }, '/cwd')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Deletion requested, but --confirm or --interactive flag is missing'))
  })

  it('exits when --since is true without value', async () => {
    await runSweepy({ since: true }, '/cwd')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('--since requires a Git commit'))
  })

  it('calls writeSweepyConfigToPackage on --init', async () => {
    await runSweepy({ init: true }, '/cwd')
    expect(writeSweepyConfigToPackage).toHaveBeenCalledWith('/cwd')
  })

  it('calls pruneSweepyTrash on --prune-trash', async () => {
    await runSweepy({ pruneTrash: true }, '/cwd')
    expect(pruneSweepyTrash).toHaveBeenCalled()
  })

  it('calls recoverInteractive when --recover and --interactive are set', async () => {
    await runSweepy({ recover: true, interactive: true }, '/cwd')
    expect(recoverInteractive).toHaveBeenCalled()
  })
})
