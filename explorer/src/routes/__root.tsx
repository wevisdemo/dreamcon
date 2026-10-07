import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { Footer } from '../components/footer';
import { Navbar } from '../components/navbar';
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
    <html
      lang="th"
      suppressHydrationWarning
      className="motion-safe:scroll-smooth"
    >
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col text-b5">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  ),
});
