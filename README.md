# Dream Constitution

## About

Dream Constitution is a project that gathers the opinions of Thai people to serve as a hub of ideas for drafting a people's constitution.  
Because the constitution may sometimes feel distant, we invite everyone to share their diverse dreams and ideas, weaving them into a single story. These ideas will then be passed on to those responsible for drafting the new constitution, so it can truly reflect the will of the people.

## Deployment

| Name           | URL                             |
| -------------- | ------------------------------- |
| Web production | https://dreamcon.wevis.info/    |
| Published data | published-data branch on GitHub |

Both run manually though Github Actions

## Workspace

A pnpm monorepo. Lint, format and git hooks are configured once at the root; everything else is documented in each package's README.

| Package                                    | Served under | Description                                                                                                     |
| ------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------- |
| [`@dreamcon/explorer`](explorer/README.md) | `/`          | Public-facing site                                                                                              |
| [`@dreamcon/editor`](editor/README.md)     | `/editor/`   | Deprecated, kept during the transition until migrated. Content management: topics, comments, events and writers |

The packages share nothing beyond the root lint, format and git hook setup.

## Prerequisites

You need Node 24, [pnpm](https://pnpm.io/), Java 11+ (for the Firestore emulator) and, to run the tests, a Chromium build for Playwright. Get them either way:

**With Nix** (optional, but nothing then depends on host tooling)

`flake.nix` provides all of the above. With [direnv](https://direnv.net/), run `direnv allow` once and every command works as written; otherwise prefix them with `nix develop --command`, e.g. `nix develop --command pnpm dev`.

**Without Nix**

Install Node, pnpm and a JDK yourself, then fetch the browser once:

```
pnpm install
pnpm --filter @dreamcon/editor exec playwright install chromium
```

The Nix shell sets `PLAYWRIGHT_BROWSERS_PATH` to a browser from nixpkgs, so `playwright install` is neither needed nor wanted there.

## Command

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm install` | Install dependencies of all packages |
| `pnpm dev`     | Run the explorer dev server          |
| `pnpm build`   | Build all packages into `dist/`      |
| `pnpm test`    | Run the e2e suites of all packages   |
| `pnpm lint`    | Oxlint with autofix                  |
| `pnpm format`  | Oxfmt                                |

Lint and format on save are preconfigured for [Zed](https://zed.dev/) in `.zed/settings.json`; install the Oxc extension (`zed: extensions` → "Oxc") to enable them.

Each package documents its own `.env` variables in its README: the explorer reads them from `explorer/`, the editor from the repository root.
