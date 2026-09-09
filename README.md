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

- [pnpm](https://pnpm.io/)
- Java 11+ (required by the Firestore emulator)

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

Emulator data is in-memory and nothing is exported on exit, so every startup begins from the same fixed state defined in [`src/script/seedEmulator.ts`](src/script/seedEmulator.ts). Worth highlight that one admin account is created: `admin@dreamcon.local` with `dreamcon` password.

Notes:

- The emulator uses `firestore.rules`, a hand-maintained mirror of the production rules. Production rules are managed in the Firebase console; this file is not deployed by any script here, so keep the two in sync manually.
- Scripts in `src/script/` (e.g. the Firestore dump) still target production by default. Prefix with `VITE_USE_FIREBASE_EMULATOR=true` to point them at the emulator.
