import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 3000 },
  // React's plugin must come after Start's
  plugins: [
    tanstackStart({ prerender: { enabled: true } }),
    react(),
    tailwindcss(),
  ],
});
