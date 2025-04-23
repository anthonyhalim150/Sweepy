import { describe, it, expect, vi, beforeEach } from 'vitest'
import path from 'path'
import fs from 'fs'
import {
  loadWebpackAliases,
  loadBabelAliases,
  loadViteAliases
} from '../src/utils/resolveMoreAliases.js'

vi.mock('fs')

const cwd = '/mock/project'

beforeEach(() => {
  vi.restoreAllMocks()
})

it('loads webpack aliases correctly', () => {
  fs.existsSync = vi.fn(p => p.includes('webpack.config.js'))
  fs.readFileSync = vi.fn(() => `
    resolve: {
      alias: {
        '@components': './src/components',
        '@utils': './src/utils'
      }
    }
  `)
  const result = loadWebpackAliases(cwd)
  expect(result['@components']).toBe(path.resolve(cwd, 'src/components'))
  expect(result['@utils']).toBe(path.resolve(cwd, 'src/utils'))
})

it('loads babel aliases correctly', () => {
  fs.existsSync = vi.fn(p => p.includes('babel.config.js'))
  fs.readFileSync = vi.fn(() => `
    plugins: [
      ['module-resolver', {
        alias: {
          '@lib': './src/lib',
          '@store': './src/store'
        }
      }]
    ]
  `)
  const result = loadBabelAliases(cwd)
  expect(result['@lib']).toBe(path.resolve(cwd, 'src/lib'))
  expect(result['@store']).toBe(path.resolve(cwd, 'src/store'))
})

it('loads vite aliases correctly', () => {
  fs.existsSync = vi.fn(p => p.includes('vite.config.ts'))
  fs.readFileSync = vi.fn(() => `
    alias: [
      { find: '@views', replacement: './src/views' },
      { find: '@assets', replacement: './src/assets' }
    ]
  `)
  const result = loadViteAliases(cwd)
  expect(result['@views']).toBe(path.resolve(cwd, 'src/views'))
  expect(result['@assets']).toBe(path.resolve(cwd, 'src/assets'))
})

it('returns empty object if config file missing', () => {
  fs.existsSync = vi.fn(() => false)
  expect(loadWebpackAliases(cwd)).toEqual({})
  expect(loadBabelAliases(cwd)).toEqual({})
  expect(loadViteAliases(cwd)).toEqual({})
})

it('returns empty object on parsing error', () => {
  fs.existsSync = vi.fn(() => true)
  fs.readFileSync = vi.fn(() => '{ invalid json')
  expect(loadWebpackAliases(cwd)).toEqual({})
  expect(loadBabelAliases(cwd)).toEqual({})
  expect(loadViteAliases(cwd)).toEqual({})
})
