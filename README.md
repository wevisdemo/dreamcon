# Dream Constitution

## About

Dream Constitution is a project that gathers the opinions of Thai people to serve as a hub of ideas for drafting a people's constitution.  
Because the constitution may sometimes feel distant, we invite everyone to share their diverse dreams and ideas, weaving them into a single story. These ideas will then be passed on to those responsible for drafting the new constitution, so it can truly reflect the will of the people.

## URL

| Environment | URL                          |
| ----------- | ---------------------------- |
| Production  | https://dreamcon.wevis.info/ |

## Stack

- [React.js](https://react.dev/) version 19.0.0
- [TailwindCSS](https://tailwindcss.com/docs)
- [Firebase](https://console.firebase.google.com/) Firestore Database as a backend

# Installation

## ENV

| Variable                   | Description                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VITE_FIREBASE_CONFIG       | Firebase config. We use this for connecting with database                                                                                                           |
| VITE_BASE_URL              | Base url. For development, we usually set with http://localhost:5173                                                                                                |
| BASE_URL                   | Base url. For development, we usually set with http://localhost:5173                                                                                                |
| VITE_USE_FIREBASE_EMULATOR | `true` to connect to the local Firebase emulators instead of the real project. Already set to `true` in `.env.development`, so `pnpm dev` never touches production. |

## Prerequisites

You need Node 24, [pnpm](https://pnpm.io/), Java 11+ (for the Firestore emulator) and, to run the tests, a Chromium build for Playwright. Get them either way:

**With Nix** (optional, but nothing then depends on host tooling)

`flake.nix` provides all of the above. With [direnv](https://direnv.net/), run `direnv allow` once and every command works as written; otherwise prefix them with `nix develop --command`, e.g. `nix develop --command pnpm dev`.

**Without Nix**

Install Node, pnpm and a JDK yourself, then fetch the browser once:

```
pnpm install
pnpm exec playwright install chromium
```

The Nix shell sets `PLAYWRIGHT_BROWSERS_PATH` to a browser from nixpkgs, so `playwright install` is neither needed nor wanted there.

## Command

- install package dependencies with

```
pnpm install
```

- for development (starts the Firebase emulators, seeds them, then runs Vite)

```
pnpm dev
```

## Firebase emulator

Local development runs against the [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) so that the production Firestore is never read from or written to.

| Service        | Port                  |
| -------------- | --------------------- |
| Vite           | http://localhost:5173 |
| Emulator UI    | http://127.0.0.1:4000 |
| Firestore      | 127.0.0.1:8080        |
| Authentication | 127.0.0.1:9099        |

`pnpm dev` runs everything under `firebase emulators:exec`, so stopping it (Ctrl-C) also stops the emulators.

How the safety net works:

- `.env.development` sets `VITE_USE_FIREBASE_EMULATOR=true`, and Vite only loads that file in dev mode (`vite build` is unaffected).
- When the flag is on, `src/utils/firestore.ts` ignores `VITE_FIREBASE_CONFIG` entirely and initializes Firebase with the project id `demo-dreamcon`. The `demo-` prefix makes the Firebase SDKs refuse to contact any real Google backend, so a broken emulator connection fails loudly instead of silently falling through to production.

Other commands:

| Command              | Description                                                                         |
| -------------------- | ----------------------------------------------------------------------------------- |
| `pnpm emulators`     | Emulators + seed only, without Vite. Useful when running the dev server separately. |
| `pnpm seed:emulator` | Wipe and re-seed running emulators, back to the exact initial state.                |
| `pnpm dev:prod`      | Dev server against the **real** project. Use deliberately.                          |

### Seed data

Emulator data is in-memory and nothing is exported on exit, so every startup begins from the same fixed state defined in [`src/script/seedEmulator.ts`](src/script/seedEmulator.ts). Worth highlight that one admin account is created, from the `ADMIN_EMAIL` / `ADMIN_PASSWORD` constants in [`src/utils/firebaseEmulator.ts`](src/utils/firebaseEmulator.ts).

## E2E tests

[Playwright](https://playwright.dev/) drives a real browser against the seeded emulators.

| Command        | Description                 |
| -------------- | --------------------------- |
| `pnpm test`    | Run the suite headless      |
| `pnpm test:ui` | Run it in the Playwright UI |

Both start their own `pnpm dev` and re-seed the emulator first, so the fixtures in `src/script/seedEmulator.ts` are the contract the specs assert against. Extend those fixtures when a test needs new fixed data, rather than creating it ad hoc in the test.

An existing server is never reused — one already on port 5173 could be `pnpm dev:prod`, and the write specs would then create documents in the real Firestore — so stop your dev server before running the suite.

Where the specs live:

- One spec per page, next to it and sharing its name: `src/pages/AllTopic.tsx` is tested by `src/pages/AllTopic.spec.ts` (`About.tsx` has no spec yet).
- Shared setup and helpers are in `src/utils/e2e/`.
- Inside a spec, `describe` blocks separate anonymous, writer and admin access.
- A flow crossing pages belongs to the page it starts from: the admin share link is in `Admin.spec.ts` even though it ends on `/topics`.
- Being inside `src` means `tsc -b` typechecks the specs; Vite never bundles them, since nothing in the app imports them.
- Tests run serially on one worker because they share a single emulator.

> For Nix users: `@playwright/test` is pinned exactly to the `playwright-driver` version in `flake.nix`, because Playwright refuses to launch a browser build from a different version. Bumping one means bumping the other (`nix flake update`, then `pnpm add -D -E @playwright/test@<version printed by the dev shell>`). Without Nix, `pnpm exec playwright install` fetches whatever matches the installed package.

Notes:

- The emulator uses `firestore.rules`, a hand-maintained mirror of the production rules. Production rules are managed in the Firebase console; this file is not deployed by any script here, so keep the two in sync manually.
- Scripts in `src/script/` (e.g. the Firestore dump) still target production by default. Prefix with `VITE_USE_FIREBASE_EMULATOR=true` to point them at the emulator.
