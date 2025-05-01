import { build } from 'esbuild'

build({
  entryPoints: ['./index.js'],
  outfile: 'dist/sweepy.cjs',
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  banner: {
    js: '#!/usr/bin/env node'
  },
  external: ['fs', 'path', 'os', 'fsevents','depcheck']
}).catch(() => process.exit(1))
