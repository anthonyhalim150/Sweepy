# 🧹 Sweepy

> Detect and eliminate dead code and leftover files in your JavaScript, TypeScript, and all your projects — including modules, stylesheets, CSS selectors, package dependencies, exports, media assets, and `.env` keys.

**Sweepy** is an all-in-one, AST-powered CLI tool for eliminating dead code. It helps you find:

- Unused JavaScript, TypeScript, CSS, and SCSS files
- Unused class, keyframes, and ID selectors in stylesheets
- Unused `.env` variables
- Orphaned image/media assets (PNG, JPG, SVG, WebP)
- Unreferenced exports and JSX components
- Dynamically loaded files and runtime imports
- Unused and undeclared npm dependencies (--detect deps)

Sweepy is built for developers, teams, CI pipelines, and open-source maintainers who want to keep projects clean and efficient.

[![npm version](https://img.shields.io/npm/v/sweepy)](https://www.npmjs.com/package/sweepy)
[![npm downloads](https://img.shields.io/npm/dm/sweepy)](https://www.npmjs.com/package/sweepy)
[![MIT License](https://img.shields.io/npm/l/sweepy)](./LICENSE)
[![Build Status](https://github.com/anthonyhalim150/sweepy/actions/workflows/test.yml/badge.svg)](https://github.com/anthonyhalim150/sweepy/actions)
[![Codecov Coverage](https://codecov.io/gh/anthonyhalim150/sweepy/branch/main/graph/badge.svg)](https://codecov.io/gh/anthonyhalim150/sweepy)
[![GitHub issues](https://img.shields.io/github/issues/anthonyhalim150/sweepy)](https://github.com/anthonyhalim150/sweepy/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/anthonyhalim150/sweepy/pulls)

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

Sweepy runs instantly with zero config — just install and run. To customize behavior:

```bash
sweepy --init
```

Adds a `"sweepy"` block to `package.json` with defaults like:

- Ignore patterns for node_modules, build/test output
- Alias resolution
- Custom CSS safelist


---

## 🌟 Like Sweepy?

- ⭐ Star on GitHub
- 🧠 Share with your team
- 🐛 Open issues or PRs

Clean code starts with clean files. Keep it Sweepy! 🧹

---

## ✨ Features

- 🔍 Detect unused `.js`, `.ts`, `.jsx`, `.tsx`, `.css`, `.scss`, and image assets
- 🔒 Detect unused `.env` keys
- 🧼 **Auto-clean support** – Easily clean all unused files with --delete --confirm
- 🧠 AST-based import and export graph analysis (static + dynamic)
- 📦 Export symbol usage tracking (`export const`, `export default`)
- 🎯 JSX component reference detection (`<MyComponent />`)
- 🎨 Unused CSS selector detection (class, keyframes, ID, HTML tags)
- 📦 Detect unused and undeclared npm dependencies via `--detect deps`
- 🎨 Support for safelisting CSS selectors with `customCssSafelist` in `package.json` or `.sweepyrc.json`
- 🧱 Alias resolution (Webpack, Vite, Babel, custom)
- 🗂 Config support via CLI or `package.json`
- ♻️ Safe deletion to `.sweepy-trash/` with full recovery
- 📤 Export results as JSON, TXT, or styled HTML reports
- 🔁 Git integration with `--since` for incremental scans
- ⚙️ CI-friendly output (dry-run, headless, JSON)


---

## 🧭 What Makes Sweepy Different?

Sweepy doesn’t just check imports—it analyzes ASTs, handles dynamic patterns, integrates with git, and gives you export-level insight with recovery safety. Unlike other tools, it covers your entire project: code, styles, envs, and assets.

---

## 🔍 Why Sweepy?

| Feature                                          | 🧹 Sweepy   | depcheck   | unimported   | PurgeCSS   | ts-prune   | eslint-plugin-unused-imports   |
|:-------------------------------------------------|:------------|:-----------|:-------------|:-----------|:-----------|:-------------------------------|
| AST-based import/export analysis                 | ✅          | ❌         | ❌           | ❌         | ✅         | ⚠️ Partial                     |
| JSX `<Component />` detection                    | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| Export symbol usage analysis                     | ✅          | ⚠️ Partial | ❌           | ❌         | ✅         | ✅ (imports only)              |
| Git-aware scanning (`--since`)                   | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| Unused CSS/SCSS selectors                        | ✅          | ❌         | ❌           | ⚠️ Regex   | ❌         | ❌                             |
| .env key usage detection                         | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| HTML reports                                     | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| Safe deletion with recovery                      | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| Custom alias resolution (TS/Webpack)             | ✅          | ⚠️ Partial | ⚠️ Partial   | ❌         | ⚠️ Manual  | ⚠️ Partial                     |
| CI-friendly dry-run mode                         | ✅          | ⚠️         | ❌           | ❌         | ❌         | ✅                             |
| Dynamic import / `require()` tracking            | ✅          | ❌         | ⚠️ Partial   | ❌         | ❌         | ❌                             |
| Glob export support (`export *`)                 | ✅          | ❌         | ❌           | ❌         | ✅         | ❌                             |
| JSX-aware heuristics (`<MyComponent />`)         | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| .scss and CSS Modules support                    | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| Handles `classnames`, `clsx`                     | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| Styled HTML + JSON output                        | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |
| CLI + `package.json` config support              | ✅          | ❌         | ⚠️ Partial   | ❌         | ❌         | ❌                             |
| Unused/undeclared dependencies (`--detect deps`) | ✅          | ✅         | ✅           | ❌         | ❌         | ❌                             |
| CSS selector safelist support                    | ✅          | ❌         | ❌           | ❌         | ❌         | ❌                             |


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
| `--detect`            | Choose detection types: js, css, assets, exports, deps, env |
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
3. `.sweepyrc.json` (optional)

```json
"sweepy": {
  "ignore": ["dist/**", "*.test.*"],
  "types": ["js", "css", "assets", "deps"],
  "customAliases": {
    "@components": "src/components",
    "@utils": "src/utils"
  },
  "customCssSafelist": [
    "^\\.active$",
    "^\\.dark-mode$",
    "^\\.btn-.*"
  ]
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

## 📈 Changelog

Check out the [CHANGELOG.md](https://github.com/anthonyhalim150/sweepy/releases) for version history and release notes.

---


## ✅ Tests

Sweepy is tested using [Vitest](https://vitest.dev) to ensure accurate detection and safe cleanup of unused files, selectors, and dependencies.

```bash
npm test           # Run all tests once
npm run test:watch # (optional) Watch mode for local development
```

Test coverage is automatically reported through GitHub Actions and [Codecov](https://codecov.io/gh/anthonyhalim150/sweepy).

---

## 🤝 Contributing

We’d love your help! Whether it’s a tiny typo, a brand‑new feature, or a nasty bug you’ve spotted, every bit counts :D

1. **Fork** this repo and create a branch off **`main`**  
2. Run `npm install` then `npm test` to make sure everything passes  
3. Open a pull request with a clear, friendly description of your change  

Sweepy follows **conventional commits** and a clean‑code style.  
Let's make the code world a little cleaner, together! 🧹✨

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/anthonyhalim150"><img src="https://avatars.githubusercontent.com/u/147601814?v=4?s=32" width="32px;" alt="anthonyhalim150"/><br /><sub><b>anthonyhalim150</b></sub></a><br /><a href="https://github.com/anthonyhalim150/sweepy/commits?author=anthonyhalim150" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!