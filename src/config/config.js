import fs from 'fs';
import path from 'path';
import { traceBinImports } from '../utils/traceBinImports.js';

export function loadConfig(cwd, cliIgnore = []) {
  const normalize = (p) => p.replace(/\\/g, '/');
  const ignore = new Set(['**/node_modules/**', ...cliIgnore.map(normalize)]);
  const pkgPath = path.join(cwd, 'package.json');
  let customCssSafelist = [];

  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

      if (pkg.sweepy?.ignore) {
        pkg.sweepy.ignore.forEach(p => ignore.add(normalize(p)));
      }

      if (pkg.sweepy?.customCssSafelist) {
        customCssSafelist = pkg.sweepy.customCssSafelist;
      }

      if (pkg.bin) {
        const binPaths = typeof pkg.bin === 'string'
          ? [pkg.bin]
          : Object.values(pkg.bin);
        binPaths.forEach(binRelPath => {
          const entry = path.resolve(cwd, binRelPath);
          const traced = traceBinImports(entry);
          traced.forEach(f => ignore.add(normalize(f)));
        });
      }

    } catch (e) {
      console.warn('Could not parse package.json:', e.message);
    }
  }

  return {
    ignore: Array.from(ignore),
    customCssSafelist
  };
}
