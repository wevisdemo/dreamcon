# Dreamcon

## Workspace

pnpm monorepo. Lint, format and git hooks are configured once at the root; `pnpm dev`, `build`, `test`, `lint` and `format` run from the root, every other script from its package directory.

- `explorer` (`@dreamcon/explorer`): the public-facing TanStack Start site that owns `/`
- `editor` (`@dreamcon/editor`): deprecated, kept only during the transition until it is migrated. Content management for topics, comments, events and writers, served under `/editor/`

Each package has its own `AGENTS.md` with its structure, design system and testing rules. Read it before working in that package; nothing there applies to the other packages.

Packages share only the root lint, format and git hook setup. The explorer must never import from, reuse config of, or align dependency versions with the editor; each package keeps its own `.env`, dependencies and tsconfig.

## Guideline

- Do not use CSS style block if not necessary, using Tailwind classes is preferable
- Avoid mutating variables, prefer functional approach when possible
- After finishing any task, lint and format code with coresponded script in package.json before declaring task as done
- DO NOT write arbitrary low value comments, especially when the code is self-explainable
- Human will get in the loop and edit some file along the way. If you spot it, please respect those changes
- This repo ships a Nix dev shell providing Node, pnpm, Java and a Playwright browser. If `flake.nix` is present, run commands through it (direnv loads it, otherwise `nix develop --command <cmd>`) rather than relying on host tooling
- After any task that touches user-facing behaviour, run `pnpm test` and make it pass before declaring the task done

## Git Commit Message Style

- Do not commit unless explicitly asked
- Use conventional commit format with the package name as scope (`explorer`, `editor`), or no scope for changes spanning the repo, e.g. `feat(explorer): add navbar`, `build: add commitlint`. Validated by commitlint in the `commit-msg` hook (`commitlint.config.js`)
- Don't add body to the commit message. Concisely explain changes to the message title
