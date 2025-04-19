import fs from 'fs';
import path from 'path';

export function loadSweepyRcConfig(cwd) {
  const rcPath = path.join(cwd, '.sweepyrc.json');
  if (!fs.existsSync(rcPath)) return {};

  try {
    const json = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
    return json;
  } catch (e) {
    console.warn('Could not parse .sweepyrc.json:', e.message);
    return {};
  }
}
