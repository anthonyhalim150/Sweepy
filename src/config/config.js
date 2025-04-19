import fs from 'fs';
import path from 'path';
import { traceBinImports } from '../utils/traceBinImports.js';

export function loadConfig(cwd, cliIgnore = []) {
  const normalize = (p) => p.replace(/\\/g, '/');
  const ignore = new Set(['node_modules/**', ...cliIgnore.map(normalize)]);

  const ignorePath = path.join(cwd, '.sweepyignore');
  if (fs.existsSync(ignorePath)) {
    const lines = fs.readFileSync(ignorePath, 'utf-8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
    lines.forEach(p => ignore.add(normalize(p)));
  }

  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

      if (pkg.sweepy?.ignore) {
        pkg.sweepy.ignore.forEach(p => ignore.add(normalize(p)));
      }

      if (pkg.bin?.sweepy) {
        const entry = path.resolve(cwd, pkg.bin.sweepy);
        const traced = traceBinImports(entry);
        traced.forEach(f => ignore.add(normalize(f)));
      }

    } catch (e) {
      console.warn('Could not parse package.json:', e.message);
    }
  }

  return { ignore: Array.from(ignore) };
}
