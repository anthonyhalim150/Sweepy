import fs from 'fs';
import path from 'path';

export function loadTSPaths(cwd) {
  const configPath = path.join(cwd, 'tsconfig.json');
  if (!fs.existsSync(configPath)) return {};

  try {
    const tsconfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return tsconfig.compilerOptions?.paths || {};
  } catch (e) {
    console.warn('Could not parse tsconfig.json:', e.message);
    return {};
  }
}

export function resolveAliasImport(importPath, importerPath, tsPaths) {
  const matches = Object.entries(tsPaths);
  for (const [aliasPattern, targets] of matches) {
    const alias = aliasPattern.replace('/*', '');
    if (importPath.startsWith(alias)) {
      const remainder = importPath.slice(alias.length);
      const relativeTarget = targets[0].replace('/*', '') + remainder;
      return path.resolve(importerPath, '../../', relativeTarget);
    }
  }

  return null;
}
