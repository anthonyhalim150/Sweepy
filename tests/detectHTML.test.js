import fs from 'fs'
import os from 'os'
import path from 'path'
import { describe, it, expect } from 'vitest'
import { detectUnusedHtmlFiles } from '../src/utils/detectUnusedHtmlFiles.js'

describe('detectUnusedHtmlFiles', () => {
  it('should return only unused HTML files', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sweepy-html-'))
    const used = path.join(tmp, 'used.html')
    const unused = path.join(tmp, 'unused.html')
    fs.writeFileSync(used, '<html><body><a href="used.html"></a></body></html>', 'utf-8')
    fs.writeFileSync(unused, '<html></html>', 'utf-8')
    const contentMap = new Map()
    contentMap.set(used, fs.readFileSync(used, 'utf-8'))
    const result = await detectUnusedHtmlFiles(tmp, contentMap, [])
    const normalized = result.map(f => path.normalize(f))
    expect(normalized).toEqual([unused])
  })
})
