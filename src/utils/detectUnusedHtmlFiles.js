import path from 'path'
import { globby } from 'globby'

export async function detectUnusedHtmlFiles(projectDir, contentMap, ignore = []) {
  const htmlFiles = await globby(['**/*.html', '**/*.htm'], {
    cwd: projectDir,
    absolute: true,
    ignore
  })

  const isReferenced = (file) => {
    const base = path.basename(file)
    return [...contentMap.values()].some(code => code.includes(base))
  }

  return htmlFiles.filter(f => !isReferenced(f))
}
