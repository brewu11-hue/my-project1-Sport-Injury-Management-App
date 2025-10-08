'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
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
  if (!window[EMULATORS_STARTED]) {
    // @ts-ignore
    window[EMULATORS_STARTED] = true;
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true,
    });
  }
}

export function initializeFirebase(): FirebaseContextValue {
  const isConfigured = getApps().length > 0;
  const app = isConfigured ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS) {
    startEmulators(firestore, auth);
  }

  return { app, firestore, auth };
}

export function FirebaseProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FirebaseContextValue;
}) {
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