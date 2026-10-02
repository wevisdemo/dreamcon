# Dreamcon Explorer

The public-facing site, served under `/`. Prerequisites and installation are in the [root README](../README.md).

`pnpm dev` and `pnpm build` also work from the repository root. Every other command below runs from this directory.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19 on Vite), statically prerendered
- [TailwindCSS](https://tailwindcss.com/docs)

## Command

| Command        | Description                                      |
| -------------- | ------------------------------------------------ |
| `pnpm dev`     | Dev server on http://localhost:3000              |
| `pnpm build`   | Static site into `dist/client/`, then type-check |
| `pnpm preview` | Serve the production build                       |
