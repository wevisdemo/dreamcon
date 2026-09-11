import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const isDemo = process.env.VITE_DEV_DEMO === 'true';

// Paths the Firebase web SDKs call, so remote browsers only need the Vite origin
const emulatorProxy = {
  '/google.firestore.v1.Firestore': 'http://127.0.0.1:8080',
  '/v1/projects': 'http://127.0.0.1:8080',
  '/identitytoolkit.googleapis.com': 'http://127.0.0.1:9099',
  '/securetoken.googleapis.com': 'http://127.0.0.1:9099',
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: isDemo
    ? { host: true, allowedHosts: true, proxy: emulatorProxy }
    : undefined,
});
