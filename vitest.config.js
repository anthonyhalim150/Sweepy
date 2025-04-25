import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'src/cli/index.js',
        'src/cli/runSweepy.js',
        'src/cli/helpHandlers.js',
        'src/config/rcConfig.js',
        'src/utils/pruneTrash.js',
        'src/utils/recoverFromTrash.js',
        'src/utils/resolveAlias.js',
        'src/utils/getChangedFilesSinceCommit.js',
        'src/utils/traceBinImports.js',
        'src/utils/detectUnusedCssSelectors.js',
        'src/utils/detectUnusedEnvKeys.js',
        'tests/fixtures/**',
        'vitest.config.js' 
      ]
    }
  }
})
