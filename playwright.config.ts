import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/pages',
  // The suite shares one Firestore emulator and reseeds it, so it must run serially.
  workers: 1,
  fullyParallel: false,
  timeout: 30_000,
  globalSetup: './src/utils/e2e/global-setup.ts',
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    // Never reuse: a server already on 5173 could be `pnpm dev:prod`, and the
    // write specs would then create documents in the real Firestore.
    reuseExistingServer: false,
    // Java emulators plus seeding take 30-60s from cold.
    timeout: 180_000,
    // A hard kill orphans the Firestore emulator's Java child, which then holds
    // port 8080 and breaks the next run. SIGTERM lets `emulators:exec` clean up.
    gracefulShutdown: { signal: 'SIGTERM', timeout: 15_000 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
