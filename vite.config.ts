import type { IncomingMessage } from 'node:http';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import svgr from 'vite-plugin-svgr';

// The emulators skip security rules and admin checks for this token, whether sent
// as a header or in the `$httpHeaders` query param Firestore's WebChannel uses
const hasOwnerToken = (req: IncomingMessage) => {
  const params = new URL(req.url ?? '', 'http://localhost').searchParams;
  return /bearer\s+owner/i.test(
    [req.headers.authorization, ...params.values()].join('\n')
  );
};

// Paths the Firebase web SDKs call, so the browser only needs the page origin
const emulatorProxy = Object.fromEntries(
  Object.entries({
    '/google.firestore.v1.Firestore': 'http://127.0.0.1:8080',
    '/v1/projects': 'http://127.0.0.1:8080',
    '/identitytoolkit.googleapis.com': 'http://127.0.0.1:9099',
    '/securetoken.googleapis.com': 'http://127.0.0.1:9099',
  }).map(([path, target]): [string, ProxyOptions] => [
    path,
    { target, bypass: req => (hasOwnerToken(req) ? false : undefined) },
  ])
);

const analytics = {
  name: 'analytics',
  transformIndexHtml: () => [
    {
      tag: 'script',
      attrs: {
        defer: true,
        'data-domain': 'dreamcon.wevis.info',
        src: 'https://analytics.punchup.world/js/script.js',
      },
      injectTo: 'head' as const,
    },
  ],
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_USE_FIREBASE_EMULATOR } = loadEnv(mode, process.cwd());
  const useEmulator = ['true', '1'].includes(VITE_USE_FIREBASE_EMULATOR);

  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        svgrOptions: { dimensions: false, svgProps: { fill: 'currentColor' } },
      }),
      !useEmulator && analytics,
    ],
    server: { proxy: emulatorProxy },
    // Only the demo image runs `vite preview`, behind a reverse proxy or tunnel
    preview: { host: true, allowedHosts: true },
  };
});
