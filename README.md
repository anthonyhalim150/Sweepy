# 🧹 Sweepy

> Find and eliminate unused files and exports in your codebase — JS/TS modules, CSS/SCSS stylesheets, export functions and orphaned assets.

Sweepy is a blazing-fast, AST-powered CLI tool that helps developers maintain a **clean, optimized, and dead-code-free codebase**. It scans JavaScript/TypeScript projects and flags unused files, unused exports, and unreferenced static assets. Designed for teams, CI/CD pipelines, and OSS maintainers.

[![npm version](https://img.shields.io/npm/v/sweepy)](https://www.npmjs.com/package/sweepy)
[![npm downloads](https://img.shields.io/npm/dm/sweepy)](https://www.npmjs.com/package/sweepy)
[![MIT License](https://img.shields.io/npm/l/sweepy)](./LICENSE)
[![Build Status](https://github.com/anthonyhalim150/sweepy/actions/workflows/test.yml/badge.svg)](https://github.com/anthonyhalim150/sweepy/actions)
[![GitHub issues](https://img.shields.io/github/issues/anthonyhalim150/sweepy)](https://github.com/anthonyhalim150/sweepy/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/anthonyhalim150/sweepy/pulls)

---

## ✨ Features

- 🔍 Detect unused `.js`, `.ts`, `.jsx`, `.tsx`, `.css`, `.scss`, and image assets
- 🧼 **Auto-clean support** – Easily clean all unused files with --delete --confirm
- 🧠 AST-based import and export graph analysis (static + dynamic)
- 📦 Export symbol usage tracking (`export const`, `export default`)
- 🎯 JSX component reference detection (`<MyComponent />`)
- 🧱 Alias resolution (Webpack, Vite, Babel, custom)
- 🗂 Config support via CLI or `package.json`
- ♻️ Safe deletion to `.sweepy-trash/` with full recovery
- 📤 Export results as JSON, TXT, or styled HTML reports
- 🔁 Git integration with `--since` for incremental scans
- ⚙️ CI-friendly output (dry-run, headless, JSON)

---


---

## ⚡ Zero-Config Defaults

Sweepy is ready to use immediately — no setup required.

```bash
npx sweepy
```

IMPORANT: However, for custom behavior, you can generate a config block automatically:

```bash
sweepy --init
```

This adds a `"sweepy"` block to your `package.json` with sensible defaults:
- Ignores node modules, build, test, and lock files
- Supports alias resolution
- Enables safe deletion and reporting

Alternatively, if you install Sweepy via `npm install`, it will auto-create a default `"sweepy"` config block in your `package.json`.

---

## 🔍 Why Sweepy?

| Feature                        | 🧹 Sweepy | depcheck | unimported |
|-------------------------------|-----------|----------|------------|
| AST-based analysis            | ✅         | ❌        | ❌          |
| JSX `<Component />` detection | ✅         | ❌        | ❌          |
| Export symbol analysis        | ✅         | ⚠️ Partial | ❌         |
| Git-aware scanning            | ✅         | ❌        | ❌          |
| HTML reports                  | ✅         | ❌        | ❌          |
| Safe deletion & recovery      | ✅         | ❌        | ❌          |
| Custom alias resolution       | ✅         | ⚠️ Partial | ⚠️ Partial |
| CI-friendly dry-run mode      | ✅         | ⚠️        | ❌          |

Sweepy goes beyond surface-level linting to offer deep AST scanning, JSX awareness, and Git diff integration — all while giving you full control and safety.

## 📦 Installation

### Global (recommended)
```bash
npm install -g sweepy
```

### Local (dev dependency)
```bash
npm install --save-dev sweepy
```

If installed locally:
```bash
npx sweepy [options]
```

---

## 🚀 Usage Examples

```bash
sweepy                            # Full scan
sweepy --only js css              # Scan JS and CSS only
sweepy --delete --interactive     # Interactive file deletion
sweepy --export report.txt        # Export results to text file
sweepy --html-report              # Generate HTML report
```

---

## 🛠 CLI Options

| Option                | Description |
|-----------------------|-------------|
| `--only`              | Filter scan to `js`, `css`, `assets` |
| `--delete`            | Delete unused files |
| `--confirm`           | Delete without confirmation |
| `--interactive`       | Select files to delete or recover |
| `--dry-run`           | Simulate deletion (safe preview) |
| `--export <file>`     | Export unused list to `.txt` or `.json` |
| `--html-report`       | Generate styled HTML report |
| `--recover [file]`    | Recover a specific file |
| `--recover-all`       | Recover everything from trash |
| `--since <commit>`    | Limit scan to files changed since commit |
| `--init`              | Add default config to `package.json` |
| `--print-config`      | Display merged configuration |
| `--prune-trash`       | Permanently delete `.sweepy-trash/` contents |
| `--ignore <patterns>` | Glob patterns to ignore (override config) |

---

## 🧠 Export Symbol Detection

Sweepy detects unused named and default exports:

```js
export const unused = () => {}      // flagged if unused
export default UnusedComponent      // flagged if unused
```

Also tracks JSX usage like:

```js
<MyComponent />                     // resolved to `MyComponent.jsx`
```

---

## 🧩 Config Support

Sweepy merges configuration from:

1. CLI flags (highest priority)
2. `package.json > "sweepy"` block

### `package.json` example:

```json
"sweepy": {
  "ignore": ["dist/**", "*.test.*"],
  "types": ["js", "css", "assets"],
  "customAliases": {
    "@components": "src/components",
    "@utils": "src/utils"
  }
}
```

Initialize it with:
```bash
sweepy --init
```

---

## ♻️ Safe Deletion & Recovery

All deleted files are moved to `.sweepy-trash/`.

```bash
sweepy --recover file.js         # Recover one file
sweepy --recover-all             # Recover everything
sweepy --prune-trash             # Delete trash permanently
```

---

## 📊 HTML Report

```bash
sweepy --html-report
```

Generates a rich visual report at `sweepy-report.html`.

---

## 🧪 Suggested CI Usage

```bash
sweepy --since HEAD~5 --only js css --dry-run --json
```

✅ Detect regressions  
✅ Fail builds with unclean diffs  
✅ Machine-readable output

---

## ⚙️ GitHub Actions

```yml
name: Sweepy CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sweepy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npx sweepy --since HEAD~10 --json --dry-run
```

---

## 🌍 Links

- 🔗 [GitHub Repo](https://github.com/anthonyhalim150/sweepy)
- 📦 [NPM Package](https://www.npmjs.com/package/sweepy)
- 📄 [License (MIT)](./LICENSE)

---

## 🌟 Like Sweepy?

- ⭐ Star on GitHub
- 🧠 Share with your team
- 🐛 Open issues or PRs

Clean code starts with clean files. Keep it Sweepy. 🧹
