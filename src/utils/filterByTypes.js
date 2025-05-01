export function filterByTypes(result, extensions) {
  const normalizeExt = (ext) => {
    const base = ext.replace(/^\./, '').toLowerCase()
    switch (base) {
      case 'scss':
      case 'sass':
        return 'css'
      case 'jpg':
      case 'jpeg':
      case 'webp':
      case 'gif':
        return 'png'
      default:
        return base
    }
  }

  const exts = new Set(extensions.map(normalizeExt))

  const matchExt = (file) => {
    if (typeof file !== 'string') return false
    const ext = file.split('.').pop().toLowerCase()
    return exts.has(normalizeExt(ext))
  }

  const filterByFile = (files) =>
    Array.isArray(files) ? files.filter(matchExt) : []

  const filterByFileKeys = (obj) =>
    Object.fromEntries(
      Object.entries(obj || {}).filter(([file]) => matchExt(file))
    )

  const filterAliasTargets = (deadAliases) => {
    const filtered = {}
    for (const [source, aliasMap] of Object.entries(deadAliases || {})) {
      const entries = Object.entries(aliasMap || {}).filter(
        ([_, targetPath]) => matchExt(targetPath)
      )
      if (entries.length) {
        filtered[source] = Object.fromEntries(entries)
      }
    }
    return filtered
  }

  return {
    unusedHTML: filterByFile(result.unusedHTML),
    unusedJS: filterByFile(result.unusedJS),
    unusedCSS: filterByFile(result.unusedCSS),
    unusedJSON: filterByFile(result.unusedJSON),
    unusedAssets: filterByFile(result.unusedAssets),
    unusedExports: filterByFileKeys(result.unusedExports),
    unusedCssSelectors: filterByFileKeys(result.unusedCssSelectors),
    unusedEnv: exts.has('env') ? result.unusedEnv : null,
    deadAliases: filterAliasTargets(result.deadAliases),
    unusedConfigs: exts.has('config') ? result.unusedConfigs : [],
    unusedDependencies: result.unusedDependencies || [],
    missingDependencies: result.missingDependencies || [],
    unusedVars: filterByFileKeys(result.unusedVars)
  }
}
