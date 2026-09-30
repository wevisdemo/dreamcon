import { execSync } from 'node:child_process';

/**
 * `pnpm dev` seeds once when it boots. This re-seeds before every run so that
 * repeated runs against one server (`pnpm test:ui`) still start from fixtures.
 */
export default function globalSetup() {
  execSync('pnpm seed:emulator', { stdio: 'inherit' });
}
