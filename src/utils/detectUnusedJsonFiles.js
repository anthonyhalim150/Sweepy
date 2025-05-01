import fs from 'fs'
import { globby } from 'globby'

export async function detectUnusedJsonFiles(projectDir, contentFiles, ignore = []) {
  const allJsonFiles = await globby(['**/*.json'], {
    cwd: projectDir,
    absolute: true,
    ignore
  })

  const isUsed = (file) => {
    const base = file.split('/').pop()
    return [...contentFiles.values()].some(code => code.includes(base))
  }

  return allJsonFiles.filter(f => !isUsed(f))
}
