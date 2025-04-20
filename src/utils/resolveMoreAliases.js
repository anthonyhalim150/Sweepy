import fs from 'fs';
import path from 'path';

export function loadWebpackAliases(cwd) {
  const configPath = path.join(cwd, 'webpack.config.js');
  if (!fs.existsSync(configPath)) return {};
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const aliasMatch = raw.match(/alias:\s*{([^}]+)}/);
    if (!aliasMatch) return {};
    const aliases = {};
    const lines = aliasMatch[1].split(',').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const [key, value] = line.split(':').map(s => s.trim().replace(/['"`]/g, ''));
      aliases[key] = path.resolve(cwd, value);
    }
    return aliases;
  } catch {
    return {};
  }
}

export function loadBabelAliases(cwd) {
  const babelPath = path.join(cwd, 'babel.config.js');
  if (!fs.existsSync(babelPath)) return {};
  try {
    const raw = fs.readFileSync(babelPath, 'utf-8');
    const aliasMatch = raw.match(/alias:\s*{([^}]+)}/);
    if (!aliasMatch) return {};
    const aliases = {};
    const lines = aliasMatch[1].split(',').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const [key, value] = line.split(':').map(s => s.trim().replace(/['"`]/g, ''));
      aliases[key] = path.resolve(cwd, value);
    }
    return aliases;
  } catch {
    return {};
  }
}

export function loadViteAliases(cwd) {
  const vitePath = path.join(cwd, 'vite.config.ts');
  if (!fs.existsSync(vitePath)) return {};
  try {
    const raw = fs.readFileSync(vitePath, 'utf-8');
    const aliasMatch = raw.match(/alias:\s*\[([\s\S]*?)\]/);
    if (!aliasMatch) return {};
    const aliases = {};
    const entries = aliasMatch[1].split('},').map(e => e.trim() + '}');
    for (const entry of entries) {
      const find = entry.match(/find:\s*['"`](.*?)['"`]/)?.[1];
      const replacement = entry.match(/replacement:\s*['"`](.*?)['"`]/)?.[1];
      if (find && replacement) {
        aliases[find] = path.resolve(cwd, replacement);
      }
    }
    return aliases;
  } catch {
    return {};
  }
}
