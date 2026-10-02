import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import styles from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Dream Constitution' },
    ],
    links: [{ rel: 'stylesheet', href: styles }],
  }),
  shellComponent: ({ children }) => (
    <html lang="th" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  ),
});
