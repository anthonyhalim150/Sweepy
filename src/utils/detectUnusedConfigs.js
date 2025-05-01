import fs from 'fs'
import path from 'path'
import { globby } from 'globby'

export async function detectUnusedConfigs(projectDir, contentMap, ignore = []) {
  const configFiles = await globby([
    '**/.babelrc',
    '**/.prettierrc',
    '**/.editorconfig',
    '**/tsconfig*.json'
  ], { cwd: projectDir, absolute: true, ignore })

  const referenced = new Set()

  for (const content of contentMap.values()) {
    configFiles.forEach(cfg => {
      const base = path.basename(cfg)
      const rel = path.relative(projectDir, cfg).replace(/\\/g, '/')
      if (content.includes(base) || content.includes(rel)) {
        referenced.add(cfg)
      }
    })
  }

  for (const cfg of configFiles) {
    try {
      const json = JSON.parse(fs.readFileSync(cfg, 'utf-8'))
      if (json.extends) {
        const extended = path.resolve(path.dirname(cfg), json.extends)
        referenced.add(extended)
      }
    } catch {}
  }

  return configFiles.filter(f => !referenced.has(f))
}
