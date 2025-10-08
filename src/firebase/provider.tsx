'use client';

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';

import { firebaseConfig } from '@/firebase/config';

type FirebaseContextValue = {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

const EMULATORS_STARTED = 'EMULATORS_STARTED';
function startEmulators(firestore: Firestore, auth: Auth) {
  // @ts-ignore
  if (typeof window !== 'undefined' && !window[EMULATORS_STARTED]) {
    // @ts-ignore
    window[EMULATORS_STARTED] = true;
    try {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
    } catch (e) {
      console.error("Error connecting to emulators. Make sure they are running.", e);
    }
  }
}

export function initializeFirebase(): FirebaseContextValue {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  return { app, firestore, auth };
}

export function FirebaseProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FirebaseContextValue;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS) {
      startEmulators(value.firestore, value.auth);
    }
  }, [value]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => useContext(FirebaseContext)?.app;

export const useFirestore = () => useContext(FirebaseContext)?.firestore;

export const useAuth = () => useContext(FirebaseContext)?.auth;