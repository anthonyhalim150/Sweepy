# 🧹 Sweepy

> Detect and eliminate dead code across your codebase — including unused modules, stylesheets, selectors, exports, media assets, and environment variables.

**Sweepy** is an all-in-one, AST-powered CLI tool for eliminating dead code. It helps you find:

- Unused JavaScript, TypeScript, CSS, and SCSS files
- Unused class and ID selectors in stylesheets
- Unused `.env` variables
- Orphaned image/media assets (PNG, JPG, SVG, WebP)
- Unreferenced exports and JSX components
- Dynamically loaded files and runtime imports

Sweepy is built for developers, teams, CI pipelines, and open-source maintainers who want to keep projects clean and efficient.

[![npm version](https://img.shields.io/npm/v/sweepy)](https://www.npmjs.com/package/sweepy)
[![npm downloads](https://img.shields.io/npm/dm/sweepy)](https://www.npmjs.com/package/sweepy)
[![MIT License](https://img.shields.io/npm/l/sweepy)](./LICENSE)
[![Build Status](https://github.com/anthonyhalim150/sweepy/actions/workflows/test.yml/badge.svg)](https://github.com/anthonyhalim150/sweepy/actions)
[![GitHub issues](https://img.shields.io/github/issues/anthonyhalim150/sweepy)](https://github.com/anthonyhalim150/sweepy/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/anthonyhalim150/sweepy/pulls)

---

## ✨ Features

- 🔍 Detect unused `.js`, `.ts`, `.jsx`, `.tsx`, `.css`, `.scss`, and image assets
- 🔒 Detect unused `.env` keys
- 🧼 **Auto-clean support** – Easily clean all unused files with --delete --confirm
- 🧠 AST-based import and export graph analysis (static + dynamic)
- 📦 Export symbol usage tracking (`export const`, `export default`)
- 🎯 JSX component reference detection (`<MyComponent />`)
- 🎨 Unused CSS selector detection (class, ID, HTML tags)
- 🧱 Alias resolution (Webpack, Vite, Babel, custom)
- 🗂 Config support via CLI or `package.json`
- ♻️ Safe deletion to `.sweepy-trash/` with full recovery
- 📤 Export results as JSON, TXT, or styled HTML reports
- 🔁 Git integration with `--since` for incremental scans
- ⚙️ CI-friendly output (dry-run, headless, JSON)

---

## ⚡ Zero-Config Defaults

Sweepy is ready to use immediately — no setup required.

```bash
npx sweepy
```

To customize behavior:

```bash
sweepy --init
```

Adds a `"sweepy"` block to `package.json` with defaults like:

- Ignore patterns for node_modules, build/test output
- Alias resolution
- Deletion safety features

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
| Unused .env key detection     | ✅         | ❌        | ❌          |
| Unused CSS selectors          | ✅         | ❌        | ❌          |

---

## 📦 Installation

### Global
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
sweepy --detect env exports       # Detect only env and exports
```

---

## 🛠 CLI Options

| Option                | Description |
|-----------------------|-------------|
| `--only`              | Filter scan to `js`, `css`, `assets` |
| `--detect`            | Choose detection types: js, css, assets, exports, env |
| `--delete`            | Delete unused files |
| `--confirm`           | Delete without confirmation |
| `--interactive`       | Select files to delete or recover |
| `--dry-run`           | Simulate deletion (safe preview) |
| `--export <file>`     | Export results to `.txt` or `.json` |
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

```js
export const unused = () => {}
export default UnusedComponent
```

Sweepy will flag both if unused.

JSX detection:

```jsx
<MyComponent />  // matched to MyComponent.jsx or similar
```

---

## 🧩 Config Support

Sweepy config merges from:

1. CLI flags
2. `package.json > sweepy`

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

---

## ♻️ Safe Deletion & Recovery

```bash
sweepy --recover file.js  #Recover one file
sweepy --recover-all      #Recover everything
sweepy --prune-trash      #Delete trash permanently
```

---

## 📊 HTML Report

```bash
sweepy --html-report
```

Generates a rich, visual report at `sweepy-report.html`.

---

## 🧪 Suggested CI Usage

```bash
sweepy --since HEAD~5 --only js css --dry-run --json
```

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