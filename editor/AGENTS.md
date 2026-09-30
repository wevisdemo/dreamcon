# Dreamcon Editor

Applies on top of the root `AGENTS.md`. Paths are relative to this package.

## Guideline

- The editor is served under Vite's `base`: wrap every app-absolute `href`, `src` or `window.location` target in `withBase()` from `src/const/app.ts`, including asset paths read from Firestore. Router paths (`<Route>`, `navigate`) and CSS `url()` are handled already. Specs navigate with relative paths (`page.goto('topics')`)
- E2E specs sit next to their page and share its name (`src/pages/AllTopic.tsx` → `src/pages/AllTopic.spec.ts`); shared setup and helpers live in `src/utils/e2e/`. When changing a page, modal, permission or auth flow, update that page's spec in the same change; a flow spanning pages belongs to the page it starts from
- `src/components` groups by domain, not by page: `topic/` holds topic and comment cards, modals, menus and drag-and-drop (shared by the Topic and AllTopic pages); `allTopic/` the topic list and filters; `admin/` event management; `about/` the about page; `ui/` domain-agnostic primitives; `layout/` page chrome; `icon/` custom SVG components
- Tests run against the seeded emulator; if a test needs new fixed data, extend `src/script/seedEmulator.ts` rather than creating it ad hoc in the test
- Colours only from the `@theme` palette tokens in `src/App.css` (`gray-1..8`, `blue/green/red/yellow-1..10`, `green-light`, `white`, `black`); the default Tailwind palette, font-size scale and container scale are disabled. Spacing and sizes come from the numeric scale (any multiple of 0.25, e.g. `gap-1.5`, `max-w-240`); arbitrary `[…]` only for values with no scale or palette equivalent. Build class names in full, never by string interpolation (`bg-${color}`)

## Typography

Size and line-height come from the tokens in `src/App.css`; weight and typeface are separate utilities.

- Size: `heading-1`…`heading-5` (responsive on `md:`), `text-b1`…`text-b3`, `text-label`, `text-label-sm`, `text-button` (also links), `text-num`
- Weight: `font-bold` / `font-semibold` / `font-normal`, chosen per element, never baked into a size token
- Default body text is `text-b3` on `body`; add a size token only when an element differs
- Typeface: `wv-ibmplex` (headings, buttons, numbers), `wv-ibmplexlooped` (body, labels, links; default on `<main>`)
- Do not use arbitrary `text-[Npx]` / `leading-[Npx]`, nor `wv-h*` / `wv-b*` from `@wevisdemo/ui` (different scale)
