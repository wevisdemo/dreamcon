export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://dreamcon.pages.dev';

/** Routes and `public/` assets are served under Vite's `base`, which plain `href`/`src` strings do not pick up. */
export const withBase = (path: string) =>
  import.meta.env.BASE_URL + path.replace(/^\//, '');
