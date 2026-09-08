# Dreamcon

## Guideline

- Do not use CSS style block if not necessary, using Tailwind classes is preferable
- Avoid mutating variables, prefer functional approach when possible
- After finishing any task, lint and format code with coresponded script in package.json before declaring task as done
- Human will get in the loop and edit some file along the way. If you spot it, please respect those changes

## Typography

Size and line-height come from the tokens in `src/App.css`; weight and typeface are separate utilities.

- Size: `heading-1`…`heading-5` (responsive on `md:`), `text-b1`…`text-b3`, `text-label`, `text-label-sm`, `text-button` (also links), `text-num`
- Weight: `font-bold` / `font-semibold` / `font-normal`, chosen per element, never baked into a size token
- Default body text is `text-b3` on `body`; add a size token only when an element differs
- Typeface: `wv-ibmplex` (headings, buttons, numbers), `wv-ibmplexlooped` (body, labels, links; default on `<main>`)
- Do not use arbitrary `text-[Npx]` / `leading-[Npx]`, nor `wv-h*` / `wv-b*` from `@wevisdemo/ui` (different scale)

## Git Commit Message Style

- Do not commit unless explicitly asked
- Use conventional commit format
- Don't add body to the commit message. Concisely explain changes to the message title
