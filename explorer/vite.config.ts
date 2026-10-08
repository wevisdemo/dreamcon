import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { asString, Column, fetchCsv, Object } from 'sheethuahua';
import { defineConfig } from 'vite';
import { csvUrl } from './src/data/shared';

const idSchema = Object({ id: Column('id', asString()) });

export default defineConfig(async ({ command }) => {
  const [topics, topicGroups] =
    command === 'build'
      ? await Promise.all([
          fetchCsv(csvUrl('dreamcon', 'topics'), idSchema),
          fetchCsv(csvUrl('dreamcon-data', 'topic_groups'), idSchema),
        ])
      : [[], []];
  const labeledTopicIds = new Set(topicGroups.map(({ id }) => id));

  return {
    server: { port: 3000 },
    plugins: [
      tanstackStart({
        prerender: { enabled: true },
        pages: topics
          .filter(({ id }) => labeledTopicIds.has(id))
          .map(({ id }) => ({ path: `/dashboard/${id}` })),
        router: { generatedRouteTree: 'route-tree.gen.ts' },
      }),
      // React's plugin must come after Start's
      react(),
      tailwindcss(),
    ],
  };
});
