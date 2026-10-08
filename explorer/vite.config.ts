import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { DATASET_ZIP_PATH } from './src/constants/dataset';
import { loadConversations } from './src/data/conversations';
import { createDatasetZip } from './src/data/dataset-zip';

// Prerender writes responses as text, which would corrupt a binary ZIP
const datasetZip: Plugin = {
  name: 'dataset-zip',
  applyToEnvironment: ({ name }) => name === 'client',
  configureServer(server) {
    server.middlewares.use(DATASET_ZIP_PATH, async (_, response) => {
      response.setHeader('Content-Type', 'application/zip');
      response.end(await createDatasetZip());
    });
  },
  async generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: DATASET_ZIP_PATH.slice(1),
      source: await createDatasetZip(),
    });
  },
};

export default defineConfig(async ({ command }) => {
  const conversations = command === 'build' ? await loadConversations() : [];

  return {
    server: { port: 3000 },
    plugins: [
      tanstackStart({
        prerender: { enabled: true },
        pages: conversations.map(({ id }) => ({ path: `/dashboard/${id}` })),
        router: { generatedRouteTree: 'route-tree.gen.ts' },
      }),
      // React's plugin must come after Start's
      react(),
      tailwindcss(),
      datasetZip,
    ],
  };
});
