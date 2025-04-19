import { globby } from 'globby'
import fs from 'fs'
import path from 'path'
import { extractImportsFromFiles } from './astAnalyzer.js'

export async function findUnusedFiles(projectDir, ignorePatterns = [], verbose = false, changedFiles = null) {
  const globbyOpts = { cwd: projectDir, absolute: true, ignore: ignorePatterns }

  const allJS = await globby(['**/*.{js,ts,jsx,tsx}'], globbyOpts)
  const allCSS = await globby(['**/*.{css,scss}'], globbyOpts)
  const allAssets = await globby(['**/*.{png,jpg,jpeg,gif,svg,webp}'], globbyOpts)
  const contentFiles = await globby(['**/*.{js,ts,tsx,jsx}'], globbyOpts)

  const normalize = (p) => path.resolve(p).replace(/\\/g, '/')
  const changedSet = changedFiles ? new Set(changedFiles.map(normalize)) : null

  const jsFiles = changedSet ? allJS.filter(f => changedSet.has(normalize(f))) : allJS
  const cssFiles = changedSet ? allCSS.filter(f => changedSet.has(normalize(f))) : allCSS
  const assetFiles = changedSet ? allAssets.filter(f => changedSet.has(normalize(f))) : allAssets
  const contentScanFiles = changedSet ? contentFiles.filter(f => changedSet.has(normalize(f))) : contentFiles

  const usedPaths = await extractImportsFromFiles(contentScanFiles)

  const isUsed = (file) => {
    const base = normalize(file)
    return [...usedPaths].some(used => normalize(used).startsWith(base))
  }

  const unusedJS = jsFiles.filter(file => !isUsed(file))

  const unusedCSS = cssFiles.filter(file => {
    const basename = path.basename(file)
    return !contentScanFiles.some(f => fs.readFileSync(f, 'utf-8').includes(basename))
  })

  const unusedAssets = assetFiles.filter(file => {
    const basename = path.basename(file)
    return !contentScanFiles.some(f => fs.readFileSync(f, 'utf-8').includes(basename))
  })

  if (verbose) {
    console.log('Scanned:', {
      jsFiles: jsFiles.length,
      cssFiles: cssFiles.length,
      assetFiles: assetFiles.length,
      contentFiles: contentScanFiles.length,
      importsDetected: usedPaths.size
    })
  }

  return { unusedJS, unusedCSS, unusedAssets }
}
