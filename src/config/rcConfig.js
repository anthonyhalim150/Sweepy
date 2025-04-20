import fs from 'fs';
import path from 'path';

export function loadSweepyRcConfig(cwd) {
  const rcPath = path.join(cwd, '.sweepyrc.json');
  if (!fs.existsSync(rcPath)) return { ignore: [], customAliases: {} };

  try {
    const config = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
    return {
      ignore: config.ignore || [],
      customAliases: config.customAliases || {}
    };
  } catch {
    return { ignore: [], customAliases: {} };
  }
}
