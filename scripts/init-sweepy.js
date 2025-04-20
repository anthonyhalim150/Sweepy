import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const pkgPath = path.join(cwd, 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.log('🛑 No package.json found, skipping Sweepy config init.');
  process.exit(0);
}

const raw = fs.readFileSync(pkgPath, 'utf-8');
const pkg = JSON.parse(raw);

pkg.sweepy = {
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.next/**',
    '**/.vercel/**',
    '**/.turbo/**',
    '**/.parcel-cache/**',
    '**/.cache/**',
    '**/.vite/**',
    '.sweepy-trash/**',
    '**/test/**',
    '**/tests/**',
    '**/__tests__/**',
    '**/__mocks__/**',
    '**/*.spec.*',
    '**/*.test.*',
    '**/*.snap',
    '**/*.log',
    '**/*.tmp',
    '**/.sweepy-report.*',
    '**/package-lock.json',
    '**/pnpm-lock.yaml',
    '**/yarn.lock',
    '**/cypress/**',
    '**/playwright/**',
    '**/.eslintcache',
    '**/.stylelintcache',
    '**/.DS_Store',
    '**/Thumbs.db',
    'scripts/init-sweepy.js'
  ],  
  output: 'json',
  types: ['js', 'css', 'assets']
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('✅ sweepy config block added to package.json');
