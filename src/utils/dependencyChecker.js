import fs from 'fs'
import path from 'path'
import depcheck from 'depcheck'

export async function runDepcheckSweepy(projectDir = process.cwd()) {
  const pkgPath = path.join(projectDir, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    return {
      unusedDependencies: [],
      missingDependencies: []
    }
  }

  return await new Promise((resolve) => {
    depcheck(projectDir, {}, (result) => {
      resolve({
        unusedDependencies: result.dependencies || [],
        missingDependencies: result.missing ? Object.keys(result.missing) : []
      })
    })
  })
}
