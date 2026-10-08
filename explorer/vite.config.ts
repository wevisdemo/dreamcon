import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { asString, Column, fetchCsv, Object } from 'sheethuahua';
import { defineConfig } from 'vite';
import { csvUrl } from './src/data/shared';

export default defineConfig(async ({ command }) => {
  const topics =
    command === 'build'
      ? await fetchCsv(
          csvUrl('dreamcon', 'topics'),
          Object({ id: Column('id', asString()) })
        )
      : [];

  return {
    server: { port: 3000 },
    plugins: [
      tanstackStart({
        prerender: { enabled: true },
        pages: topics.map(({ id }) => ({ path: `/dashboard/${id}` })),
        router: { generatedRouteTree: 'route-tree.gen.ts' },
      }),
      // React's plugin must come after Start's
      react(),
      tailwindcss(),
    ],
  };
});
