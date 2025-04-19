# 🧹 Sweepy

> Find and eliminate unused files in your codebase — unused JS/TS modules, CSS/SCSS stylesheets, and orphaned assets.

Sweepy is a fast, intuitive, and professional CLI tool designed to detect **dead code** and **orphaned files**. It identifies unused JavaScript modules, CSS/SCSS files, and unimported media assets, helping you maintain a clean, optimized, and manageable codebase.

---

## ✨ Features

- 🔍 **Detect Unused Files**: JS, TS, JSX, TSX, CSS, SCSS, and static assets (PNG, JPG, SVG, etc.)
- 🧠 **AST Analysis**: Deep import-graph analysis (`import()`, `require()`)
- 🗃 **Configurable**: Supports `.sweepyignore`, `package.json`, and CLI flags
- 🔐 **Safe Deletion**: Moves unused files safely to `.sweepy-trash` folder
- ✅ **Interactive Recovery**: Easily restore files from the trash
- 📤 **Flexible Exports**: Export reports as TXT, JSON, or visual HTML
- 🎯 **Git Integration**: Only analyze files changed since a specific Git commit
- 🧪 **CI-Friendly**: Perfect for continuous integration workflows (`--dry-run`, `--json`)
- 🚀 **Easy Setup**: No extra config required, sensible defaults out-of-the-box

---

## 📦 Installation

### Global installation (recommended):
```bash
npm install -g sweepy
```

### Local installation (as dev dependency):
```bash
npm install --save-dev sweepy
```

> If installed locally, run with `npx`:
> ```bash
> npx sweepy [options]
> ```

---

## 🚀 Quick Usage Examples

```bash
sweepy                     # Basic scan
sweepy --only js css       # Scan only JS and CSS
sweepy --delete --interactive   # Safely delete unused files
sweepy --export unused.txt      # Export file list
sweepy --html-report            # Generate HTML report
```

---

## 🛠 Full CLI Options

| Option                  | Description |
|-------------------------|-------------|
| `--only [types...]`     | Filter scan (`js`, `css`, `assets`) |
| `--delete`              | Delete unused files |
| `--confirm`             | Delete all unused files without prompting |
| `--interactive`         | Select files interactively for deletion/recovery |
| `--dry-run`             | Simulate deletion without actual removal |
| `--export <file>`       | Export unused files list to `.txt` or `.json` |
| `--html-report`         | Generate HTML report (`sweepy-report.html`) |
| `--recover [file]`      | Recover specific file from `.sweepy-trash` |
| `--recover-all`         | Restore everything from `.sweepy-trash` |
| `--since <commit>`      | Scan files changed since specific Git commit |
| `--generate-ignore`     | Generate default `.sweepyignore` file |
| `--init`                | Add default Sweepy config to `package.json` |
| `--print-config`        | Display resolved configuration |
| `--prune-trash`         | Permanently clear `.sweepy-trash` |
| `--ignore <patterns>`   | Glob patterns to ignore (overrides config) |

---

## 🧩 Configuration Options

Sweepy supports multiple configuration methods (merged by priority):

1. CLI flags (highest priority)
2. `.sweepyignore` file
3. `package.json` → `"sweepy"` block

### Example (`package.json`)
```json
{
  "sweepy": {
    "ignore": ["dist/**", "*.test.*"],
    "output": "json",
    "types": ["js", "css", "assets"]
  }
}
```

### Generate `.sweepyignore`
```bash
sweepy --generate-ignore
```

### Add config to `package.json`
```bash
sweepy --init
```

---

## 🧪 Recommended Workflow

```bash
sweepy --since HEAD~5 --only js css --delete --dry-run
```

✅ Scans JS/CSS files changed in last 5 commits  
✅ Lists unused files but doesn’t delete anything yet

---

## ♻️ Safe Deletion & Recovery

Sweepy safely moves deleted files to `.sweepy-trash/`.

- Recover a file:
```bash
sweepy --recover file.js
```

- Recover interactively:
```bash
sweepy --recover --interactive
```

- Recover all:
```bash
sweepy --recover-all
```

- Clean trash permanently:
```bash
sweepy --prune-trash
```

---

## 📊 Visual HTML Reports

```bash
sweepy --html-report
```

Creates a `sweepy-report.html` with grouped results.

---

## 👥 Contributing

1. Fork the repository
2. Clone your fork
3. `npm install`
4. Create a feature branch
5. Commit and push
6. Open a Pull Request

---

## 📜 License

MIT License © 2024 Anthony Halim  
See [LICENSE](LICENSE)

---

## ⚙️ GitHub Actions CI Setup

```yml
name: Sweepy CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test
```

---

## 🔗 Useful Links & Badges

[![npm version](https://img.shields.io/npm/v/sweepy)](https://npmjs.com/package/sweepy)  
[![license](https://img.shields.io/npm/l/sweepy)](LICENSE)  
[![issues](https://img.shields.io/github/issues/anthonyhalim150/sweepy)](https://github.com/anthonyhalim150/sweepy/issues)

- 🌍 [GitHub Repository](https://github.com/anthonyhalim150/sweepy)
- 📦 [NPM Package](https://www.npmjs.com/package/sweepy)

---

## 🌟 Did Sweepy help you?

If you find Sweepy helpful:
- ⭐ Star the GitHub repo
- 🧠 Share with your team
- 🐛 Open issues or feature requests