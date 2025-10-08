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
      // Note: It's important to check process.env here as this code
      // will be bundled for the client.
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
        console.log("Connected to Firebase Emulators.");
      }
    } catch (e) {
      console.error("Error connecting to emulators. Make sure they are running.", e);
    }
  }
}

export function initializeFirebase(): FirebaseContextValue {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  
  startEmulators(firestore, auth);
  
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

export const useFirestore = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        // This can happen during the initial client render before the provider is ready.
        return undefined;
    }
    return context.firestore;
};

export const useAuth = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        // This can happen during the initial client render before the provider is ready.
        return undefined;
    }
    return context.auth;
};
