# Dreamcon

## Guideline

- Do not use CSS style block if not necessary, using Tailwind classes is preferable
- Avoid mutating variables, prefer functional approach when possible
- After finishing any task, lint and format code with coresponded script in package.json before declaring task as done
- DO NOT write arbitrary low value comments, especially when the code is self-explainable
- Human will get in the loop and edit some file along the way. If you spot it, please respect those changes
- This repo ships a Nix dev shell providing Node, pnpm, Java and a Playwright browser. If `flake.nix` is present, run commands through it (direnv loads it, otherwise `nix develop --command <cmd>`) rather than relying on host tooling
- After any task that touches user-facing behaviour, run `pnpm test` and make it pass before declaring the task done
- E2E specs sit next to their page and share its name (`src/pages/AllTopic.tsx` → `src/pages/AllTopic.spec.ts`); shared setup and helpers live in `src/utils/e2e/`. When changing a page, modal, permission or auth flow, update that page's spec in the same change; a flow spanning pages belongs to the page it starts from
- Tests run against the seeded emulator; if a test needs new fixed data, extend `src/script/seedEmulator.ts` rather than creating it ad hoc in the test
- Colours only from the `@theme` palette tokens in `src/App.css` (`gray-1..8`, `blue/green/red/yellow-1..10`, `green-light`, `white`, `black`); the default Tailwind palette, font-size scale and container scale are disabled. Spacing and sizes come from the numeric scale (any multiple of 0.25, e.g. `gap-1.5`, `max-w-240`); arbitrary `[…]` only for values with no scale or palette equivalent. Build class names in full, never by string interpolation (`bg-${color}`)

## Typography

Size and line-height come from the tokens in `src/App.css`; weight and typeface are separate utilities.

- Size: `heading-1`…`heading-5` (responsive on `md:`), `text-b1`…`text-b3`, `text-label`, `text-label-sm`, `text-button` (also links), `text-num`
- Weight: `font-bold` / `font-semibold` / `font-normal`, chosen per element, never baked into a size token
- Default body text is `text-b3` on `body`; add a size token only when an element differs
- Typeface: `wv-ibmplex` (headings, buttons, numbers), `wv-ibmplexlooped` (body, labels, links; default on `<main>`)
- Do not use arbitrary `text-[Npx]` / `leading-[Npx]`, nor `wv-h*` / `wv-b*` from `@wevisdemo/ui` (different scale)

## Git Commit Message Style

- Do not commit unless explicitly asked
- Use conventional commit format without scope.
- Don't add body to the commit message. Concisely explain changes to the message title
