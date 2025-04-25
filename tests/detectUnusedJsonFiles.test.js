import fs from 'fs'
import os from 'os'
import path from 'path'
import { describe, it, expect } from 'vitest'
import { detectUnusedJsonFiles } from '../src/utils/detectUnusedJsonFiles.js'

describe('detectUnusedJsonFiles', () => {
  it('should return only unused JSON files', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sweepy-json-'))
    const used = path.join(tmp, 'used.json')
    const unused = path.join(tmp, 'unused.json')
    fs.writeFileSync(used, JSON.stringify({ a: 1 }), 'utf-8')
    fs.writeFileSync(unused, JSON.stringify({ b: 2 }), 'utf-8')
    const contentMap = new Map()
    contentMap.set(path.join(tmp, 'dummy.js'), `import data from './used.json';`)
    const result = await detectUnusedJsonFiles(tmp, contentMap, [])
    const normalized = result.map(f => path.normalize(f))
    expect(normalized).toEqual([unused])
  })
})
