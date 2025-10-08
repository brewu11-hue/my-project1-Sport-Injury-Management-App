'use client';

import {
  createContext,
  useContext,
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

// This flag ensures that emulators are only connected once.
let emulatorsConnected = false;

function connectToEmulators(firestore: Firestore, auth: Auth) {
  if (!emulatorsConnected) {
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS) {
      try {
        console.log("Connecting to Firebase Emulators...");
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
        emulatorsConnected = true;
      } catch (e) {
        console.error("Error connecting to emulators. Make sure they are running.", e);
      }
    }
  }
}

export function initializeFirebase(): FirebaseContextValue {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  
  // This function is now called only on the client in `FirebaseClientProvider`,
  // so we can safely connect to emulators here.
  connectToEmulators(firestore, auth);
  
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
    return useContext(FirebaseContext)?.firestore;
};

export const useAuth = () => {
    return useContext(FirebaseContext)?.auth;
};
