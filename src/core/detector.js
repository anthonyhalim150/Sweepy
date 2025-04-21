import { globby } from 'globby'
import fs from 'fs'
import path from 'path'
import { extractImportsFromFiles } from './astAnalyzer.js'
import { detectDynamicUsedFiles } from '../utils/detectDynamicUsage.js'
import { detectJSXComponentsUsed } from '../utils/detectJSXComponents.js'
import { detectUnusedExports } from '../utils/detectUnusedExports.js'
import { detectUnusedCssSelectors } from '../utils/detectUnusedCssSelectors.js'
import { loadSweepyRcConfig } from '../config/rcConfig.js'
import { detectUnusedEnvKeys } from '../utils/detectUnusedEnvKeys.js'

const validDetectTypes = ['js', 'css', 'assets', 'exports', 'env']

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function findUnusedFiles(projectDir, ignorePatterns = [], verbose = false, changedFiles = null, detectTypes = []) {
  const rcConfig = loadSweepyRcConfig(projectDir)
  const customMatchers = rcConfig.customClassMatchers || []


  const normalizedDetect = Array.isArray(detectTypes)
    ? detectTypes.map(t => t.toLowerCase()).filter(t => validDetectTypes.includes(t))
    : []

  const detect = (type) =>
    normalizedDetect.length === 0 || normalizedDetect.includes(type)

  const globbyOpts = { cwd: projectDir, absolute: true, ignore: ignorePatterns }

  const allJS = await globby(['**/*.{js,ts,jsx,tsx}'], globbyOpts)
  const allCSS = await globby(['**/*.{css,scss}'], globbyOpts)
  const allAssets = await globby(['**/*.{png,jpg,jpeg,gif,svg,webp}'], globbyOpts)
  const allHTML = await globby(['**/*.{html,htm}'], globbyOpts)
  const contentFiles = await globby(['**/*.{js,ts,tsx,jsx,html,htm,css,scss}'], globbyOpts)

  const normalize = (p) => path.resolve(p).replace(/\\/g, '/')
  const changedSet = changedFiles ? new Set(changedFiles.map(normalize)) : null

  const jsFiles = changedSet ? allJS.filter(f => changedSet.has(normalize(f))) : allJS
  const cssFiles = changedSet ? allCSS.filter(f => changedSet.has(normalize(f))) : allCSS
  const assetFiles = changedSet ? allAssets.filter(f => changedSet.has(normalize(f))) : allAssets
  const contentScanFiles = changedSet ? contentFiles.filter(f => changedSet.has(normalize(f))) : contentFiles

  const staticUsed = detect('js') ? await extractImportsFromFiles(contentScanFiles) : new Set()
  const dynamicUsed = detect('js') ? detectDynamicUsedFiles(contentScanFiles, projectDir) : new Set()
  const matchedJSXFiles = detect('js') ? await detectJSXComponentsUsed(contentScanFiles, projectDir) : new Set()

  const usedPaths = new Set([
    ...staticUsed,
    ...dynamicUsed,
    ...matchedJSXFiles
  ])

  const contentMap = new Map()
  for (const file of contentScanFiles) {
    try {
      contentMap.set(file, fs.readFileSync(file, 'utf-8'))
    } catch {}
  }

  const unusedExports = detect('exports') ? detectUnusedExports(jsFiles) : {}
  const unusedEnv = detect('env') ? await detectUnusedEnvKeys(projectDir, ignorePatterns) : null
  const unusedCssSelectors = detect('css') ? await detectUnusedCssSelectors(cssFiles, contentMap, customMatchers) : {}

  const isUsed = (file) => {
    const base = normalize(file)
    return [...usedPaths].some(used => normalize(used).startsWith(base))
  }

  const unusedJS = detect('js') ? jsFiles.filter(file => !isUsed(file)) : []
  const unusedCSS = detect('css') ? cssFiles.filter(file => {
    const basename = path.basename(file)
    return ![...contentMap.values()].some(code => code.includes(basename))
  }) : []

  const unusedAssets = detect('assets') ? assetFiles.filter(assetPath => {
    const rel = path.relative(projectDir, assetPath).replace(/\\/g, '/')
    const webPath = '/' + rel.split('public/').pop()
    const base = path.basename(assetPath)

    return ![...contentMap.values()].some(code =>
      code.includes(rel) ||
      code.includes(webPath) ||
      code.includes(base) ||
      code.match(new RegExp(`srcSet=["'][^"']*${escapeRegExp(base)}`, 'i')) ||
      code.match(new RegExp(`require\\([^)]*${escapeRegExp(base)}`, 'i'))
    )
  }) : []

  if (verbose) {
    console.log(`🔍 Scanning project in: ${projectDir}`)

    const allDirs = new Set(
      [...jsFiles, ...cssFiles, ...assetFiles, ...contentScanFiles]
        .map(f => path.relative(projectDir, path.dirname(f)).split(path.sep)[0])
        .filter(Boolean)
    )

    for (const dir of allDirs) {
      console.log(`📂 Scanning: ${dir}/`)
    }

    console.log('📊 File Summary:')
    console.log(`  • JS/TS files: ${jsFiles.length}`)
    console.log(`  • CSS/SCSS files: ${cssFiles.length}`)
    console.log(`  • Asset files: ${assetFiles.length}`)
    console.log(`  • Content files scanned: ${contentScanFiles.length}`)
    console.log(`  • Imports detected: ${usedPaths.size}`)
    console.log(`  • JSX component matches: ${matchedJSXFiles.size}`)
  }

  return {
    unusedJS,
    unusedCSS,
    unusedAssets,
    unusedExports,
    unusedCssSelectors,
    unusedEnv
  }
}
