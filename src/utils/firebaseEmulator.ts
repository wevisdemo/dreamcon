import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

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

export const connectEmulators = (db: Firestore, auth: Auth) => {
  connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`, {
    disableWarnings: true,
  });
  console.info(
    `[firebase] Using local emulators (project "${EMULATOR_FIREBASE_CONFIG.projectId}")`
  );
};
