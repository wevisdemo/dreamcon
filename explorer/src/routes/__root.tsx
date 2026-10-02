import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import styles from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Dream Constitution' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;700&family=IBM+Plex+Sans+Thai+Looped:wght@400;700&display=swap',
      },
      { rel: 'stylesheet', href: styles },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="th" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="text-b5">
        {children}
        <Scripts />
      </body>
    </html>
  ),
});
