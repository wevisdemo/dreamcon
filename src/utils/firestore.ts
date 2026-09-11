import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  EMULATOR_FIREBASE_CONFIG,
  connectEmulators,
  initEmulatorsViaPageOrigin,
  isEmulatorEnabled,
} from './firebaseEmulator';

const useEmulator = isEmulatorEnabled(
  import.meta.env.VITE_USE_FIREBASE_EMULATOR
);
const useEmulatorProxy =
  useEmulator && isEmulatorEnabled(import.meta.env.VITE_DEV_DEMO);

// Your web app's Firebase configuration
const firebaseConfig = useEmulator
  ? EMULATOR_FIREBASE_CONFIG
  : JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || '{}');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const initServices = () => {
  if (useEmulatorProxy) {
    return initEmulatorsViaPageOrigin(app);
  }

  const db = getFirestore(app);
  const auth = getAuth(app);

  if (useEmulator) {
    connectEmulators(db, auth);
  }

  return { db, auth };
};

const { db, auth } = initServices();

export { db, auth };
