import fs from 'fs'
import path from 'path'
import { loadTSPaths } from './resolveAlias.js'
import { loadWebpackAliases, loadBabelAliases, loadViteAliases } from './resolveMoreAliases.js'

export function detectDeadAliases(cwd) {
  const result = {}

  const aliasSources = {
    tsconfig: loadTSPaths(cwd),
    webpack: loadWebpackAliases(cwd),
    babel: loadBabelAliases(cwd),
    vite: loadViteAliases(cwd)
  }

  for (const [source, aliases] of Object.entries(aliasSources)) {
    for (const [alias, targetPath] of Object.entries(aliases)) {
      if (!fs.existsSync(targetPath)) {
        if (!result[source]) result[source] = {}
        result[source][alias] = targetPath
      }
    }
  }

  return result
}
