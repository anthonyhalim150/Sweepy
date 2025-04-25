# 🧹 Contributing to Sweepy

First off, thank you for taking the time to contribute to Sweepy! This is actually my first open-source project, and I'm incredibly excited (and a little nervous :D).

Whether you're fixing a tiny typo, sharing a cool idea, or suggesting a brand new feature - your input helps Sweepy grow, and I truly appreciate it. Thank you ❤️

We welcome all contributors and contributions. Let’s keep it clean, clear, and fun!

---

## 🚀 How to Contribute

There are many ways to help:

- 🐞 Report bugs
- 💡 Suggest a feature or improvement
- 🧪 Add tests or improve test coverage
- 🧰 Improve CLI help, UX, or messages
- 📚 Expand or clarify documentation
- 🔌 Suggest integrations or third-party tooling (CI, IDE plugins, etc.)

---

## 🧰 Project Setup

To get started locally:

```bash
git clone https://github.com/your-username/sweepy.git
cd sweepy
npm install
```

To run Sweepy locally:
```bash
node src/cli/index.js --help
```

To test:
```bash
npm run test
```

To check coverage:
```bash
npm run coverage
```

---

## 🧪 Test Coverage

We aim for **100% test coverage**. Sweepy is a CLI tool, so edge cases matter. Please:

- Cover any added code
- Use `vitest` and keep tests fast and isolated
- Use mocks for filesystem or Git if needed

If you're unsure how to write tests for your change, open a Draft PR and ask for guidance!

---

## 🧼 Code Style

- Use **ES Modules** (`import`/`export`) and `type: "module"` in `package.json`
- Avoid comments in production code
- Keep error messages **short**, **clear**, and **user-friendly**
- All CLI flags must work with `--help` and fail gracefully with invalid usage
- Do not introduce `node:` built-ins unless absolutely necessary

---

## 🔁 Branching & PRs

- Base all work on the latest `main` branch
- Keep PRs focused (1 feature/fix per PR)
- Run tests before submitting
- Use descriptive titles and clear commit messages

Example:
> feat: add support for `.random` asset detection

---

## 💬 Communication

- For general questions, ideas, or brainstorming, please use [GitHub Discussions](https://github.com/anthonyhalim150/discussions).
- For bugs or missing features, use GitHub Issues.
- Feel free to open a Draft PR if you want early feedback.

---

## 💖 Thank You

Sweepy exists because of contributors like you. Every PR, comment, and suggestion helps clean up countless codebases. Let’s make it easier for developers to ship clean, dead-code-free projects - together!