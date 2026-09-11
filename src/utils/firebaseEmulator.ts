import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  initializeFirestore,
} from 'firebase/firestore';

export const EMULATOR_HOST = '127.0.0.1';
export const FIRESTORE_EMULATOR_PORT = 8080;
export const AUTH_EMULATOR_PORT = 9099;

export const EMULATOR_FIREBASE_CONFIG = {
  projectId: 'demo-dreamcon',
  apiKey: 'demo-api-key',
};

/** The only account `seedEmulator.ts` creates; signs in to /admin locally. */
export const ADMIN_EMAIL = 'admin@dreamcon.local';
export const ADMIN_PASSWORD = 'dreamcon';

export const isEmulatorEnabled = (value: string | undefined): boolean =>
  value === 'true' || value === '1';

const logEmulatorUsage = () =>
  console.info(
    `[firebase] Using local emulators (project "${EMULATOR_FIREBASE_CONFIG.projectId}")`
  );

export const connectEmulators = (db: Firestore, auth: Auth) => {
  connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`, {
    disableWarnings: true,
  });
  logEmulatorUsage();
};

/**
 * `pnpm dev:demo` proxies the emulators through Vite (see `vite.config.ts`), so the
 * SDKs call the page's own origin, whether it is another device or an HTTPS tunnel.
 * `connectFirestoreEmulator` always forces plain HTTP, hence the explicit settings.
 */
export const initEmulatorsViaPageOrigin = (app: FirebaseApp) => {
  const db = initializeFirestore(app, {
    host: window.location.host,
    ssl: window.location.protocol === 'https:',
  });
  const auth = getAuth(app);
  connectAuthEmulator(auth, window.location.origin, { disableWarnings: true });
  logEmulatorUsage();

  return { db, auth };
};
