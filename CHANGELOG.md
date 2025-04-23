# 📦 Changelog

## v1.1.5

- 🧩 **Dependency Detection Integration**: Sweepy now detects unused and undeclared dependencies from `package.json`. Use `--detect deps` to include or isolate this check.
- 📤 **Smarter Inline Help**: Invalid or missing `--detect` values now redirect to `--detect --help` instead of showing generic usage output.
- 🌀 **Loading Spinners**: The CLI now displays loading indicators during scan and depcheck stages for improved user experience.
- 🔧 **Stronger CLI Guardrails**: Misused flags like `--export`, `--ignore`, or `--detect` now show helpful usage instructions instead of crashing.
- 🧠 **Improved String Extraction Logic**: Enhanced detection accuracy for dynamic expressions, templates, and conditional values across the entire codebase.
- 🚀 **Better Dynamic Detection**: Increased reliability when analyzing complex code patterns and expressions.
- 🎨 **CSS Selector Safelist Support**: Define safelist patterns using `customCssSafelist` in `.sweepyrc.json` or `package.json` to prevent false positives.
- 🎛️ **Enhanced `--verbose` Output**: Shows detailed insights about scanned directories, file counts, JSX matches, and import paths.
- 🛠 **Fixed `@babel/traverse` interop bug**: Sweepy now correctly resolves `traverse` in both ESM and CJS environments using a safe fallback.
- 🧪 Improved test coverage with Vitest and CI integration.  
- 📈 Codecov support: Code coverage is now automatically uploaded and visualized for every push and pull request.

## v1.1.0

- 🎯 **Unused CSS Selector Detection**: Now detects unused `.class`, `#id`, and element tags across JSX, HTML, and templates
- 🛠️ **.env Key Analysis**: Flags unused environment variables defined in `.env` files via `process.env.X`
- 🎛️ **Custom Detection via `--detect`**: Choose what to scan: `js`, `css`, `assets`, `exports`, or `env`
- 🧪 **Dynamic Import Tracking**: Handles `require()`, `import()`, and `fs.readdirSync()`-based usage patterns
- 🧠 **Improved Heuristics for JSX + className**: Extracts values from conditional and template expressions
- 💬 **Inline CLI Help**: Run `--detect --help` or `--ignore --help` to see examples and usage tips

## v1.0.5

- 🧠 **Export Symbol Detection**: Flags unused named & default exports
- 🧩 **Alias Resolution**: Supports Webpack, Vite, Babel & custom aliases via `package.json`
- ⚡ **Zero-config Setup**: Auto-detects config or injects into `package.json` via `--init`
- 🧼 **Auto-Cleanup Mode**: Use `--delete --confirm` to remove unused files instantly
- 🧪 **Improved JSX Matching**: Detects component usage via `<Component />` syntax

## v1.0.1

- 🚀 **First public release**: Detects unused JavaScript/TypeScript modules, CSS/SCSS files, and static assets (PNG, JPG, SVG)
- 🧼 **Safe delete support**: Use `--delete` or `--interactive` to move unused files to a recovery folder
- 📤 **Export support**: Output scan results as `.txt` or `.json`
- 📊 **CLI-friendly output**: Designed for clean, readable terminal usage and CI pipelines
- 🧪 **Initial test suite added**: Basic unit tests and CLI validation using [Vitest](https://vitest.dev)
- 🤖 **CI integration setup**: GitHub Actions configured for linting and test verification