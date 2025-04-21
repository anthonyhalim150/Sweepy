# 📦 Changelog

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

- 🚀 Initial release: Detects unused JavaScript/TypeScript modules, CSS/SCSS files, and static assets (PNG, JPG, SVG)
- 🧼 Includes safe delete mode (`--delete`, `--interactive`)
- 📤 Supports export to text or JSON
- 📊 CLI-friendly output for easy integration into CI workflows