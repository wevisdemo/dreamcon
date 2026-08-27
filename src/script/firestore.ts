import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import 'dotenv/config';
import {
  EMULATOR_FIREBASE_CONFIG,
  connectEmulators,
  isEmulatorEnabled,
} from '../utils/firebaseEmulator';

export const initDB = () => {
  const useEmulator = isEmulatorEnabled(process.env.VITE_USE_FIREBASE_EMULATOR);

  const firebaseConfig = useEmulator
    ? EMULATOR_FIREBASE_CONFIG
    : JSON.parse(process.env.VITE_FIREBASE_CONFIG || '{}');

  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = getFirestore(app);
  const auth = getAuth(app);

  if (useEmulator) {
    connectEmulators(db, auth);
  }

  return { db, auth };
};
