import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import 'dotenv/config';

export const initDB = () => {
  const firebaseConfig = JSON.parse(process.env.VITE_FIREBASE_CONFIG || '{}');

  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = getFirestore(app);
  const auth = getAuth(app);

  return { db, auth };
};
