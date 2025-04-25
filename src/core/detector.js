import { globby } from 'globby'
import fs from 'fs'
import path from 'path'
import { extractImportsFromFiles } from './astAnalyzer.js'
import { detectDynamicUsedFiles } from '../utils/detectDynamicUsage.js'
import { detectJSXComponentsUsed } from '../utils/detectJSXComponents.js'
import { detectUnusedExports } from '../utils/detectUnusedExports.js'
import { detectUnusedCssSelectors } from '../utils/detectUnusedCssSelectors.js'
import { loadSweepyRcConfig } from '../config/rcConfig.js'
import { loadConfig } from '../config/config.js'
import { detectUnusedEnvKeys } from '../utils/detectUnusedEnvKeys.js'
import { detectDeadAliases } from '../utils/detectDeadAliases.js'
import { detectUnusedVariables } from '../utils/detectUnusedVariables.js'

const validDetectTypes = ['js', 'css', 'assets', 'exports', 'env', 'deps', 'alias', 'vars']

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function findUnusedFiles(projectDir, ignorePatterns = [], verbose = false, changedFiles = null, detectTypes = []) {
  const rcConfig = loadSweepyRcConfig(projectDir)
  const fullConfig = loadConfig(projectDir, rcConfig.ignore || [])
  const customMatchers = rcConfig.customClassMatchers || []
  const customCssSafelist = fullConfig.customCssSafelist || []

  const normalizedDetect = Array.isArray(detectTypes)
    ? detectTypes.map(t => t.toLowerCase()).filter(t => validDetectTypes.includes(t))
    : []

  const detect = (type) =>
    normalizedDetect.length === 0 || normalizedDetect.includes(type)

  const globbyOpts = { cwd: projectDir, absolute: true, ignore: ignorePatterns }

  const allJS = await globby(['**/*.{js,ts,jsx,tsx}'], globbyOpts)
  const allCSS = await globby(['**/*.{css,scss}'], globbyOpts)
  const allAssets = await globby(['**/*.{png,jpg,jpeg,gif,svg,webp}'], globbyOpts)
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
  const unusedCssSelectors = detect('css') ? await detectUnusedCssSelectors(cssFiles, contentMap, customMatchers, customCssSafelist) : {}
  const deadAliases = detect('alias') ? detectDeadAliases(projectDir) : {}
  const unusedVars = detect('vars') ? detectUnusedVariables(jsFiles) : {}

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
    const base = path.basename(assetPath)
    const webPath = rel.startsWith('public/')
      ? '/' + rel.slice('public/'.length)
      : '/' + rel
    

    return ![...contentMap.values()].some(code =>
      code.includes(rel) ||
      code.includes(webPath) ||
      code.includes(base) ||
      code.match(new RegExp(`srcSet=["'][^"']*${escapeRegExp(base)}`, 'i')) ||
      code.match(new RegExp(`require\\([^)]*${escapeRegExp(base)}`, 'i'))
    )
  }) : []

  if (verbose) {
    console.log(`\n🔍 Sweepy Verbose Mode:`)
    console.log(`📁 Project root: ${projectDir}`)

    const allDirs = new Set(
      [...jsFiles, ...cssFiles, ...assetFiles, ...contentScanFiles]
        .map(f => path.relative(projectDir, path.dirname(f)).split(path.sep)[0])
        .filter(Boolean)
    )
    for (const dir of allDirs) {
      console.log(`📂 Scanning directory: ${dir}/`)
    }

    console.log('\n📊 File Summary:')
    console.log(`  • JS/TS files: ${jsFiles.length}`)
    console.log(`  • CSS/SCSS files: ${cssFiles.length}`)
    console.log(`  • Asset files: ${assetFiles.length}`)
    console.log(`  • Content files scanned: ${contentScanFiles.length}`)
    console.log(`  • Static imports: ${staticUsed.size}`)
    console.log(`  • Dynamic usage matches: ${dynamicUsed.size}`)
    console.log(`  • JSX component matches: ${matchedJSXFiles.size}`)

    console.log('\n⚙️ Sweepy Config:')
    console.log(`  • Safelisted CSS patterns: ${customCssSafelist.map(r => String(r)).join(', ') || 'none'}`)
    console.log(`  • Ignore patterns: ${ignorePatterns.join(', ') || 'none'}\n`)
  }

  return {
    unusedJS,
    unusedCSS,
    unusedAssets,
    unusedExports,
    unusedCssSelectors,
    unusedEnv,
    deadAliases,
    unusedVars
  }
}
