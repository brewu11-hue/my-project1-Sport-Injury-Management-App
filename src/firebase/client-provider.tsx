'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import {
  getFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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
  if (emulatorsConnected) return;

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
    try {
      console.log('Connecting to Firebase Emulators...');
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
      emulatorsConnected = true;
      console.log('Successfully connected to emulators.');
    } catch (e) {
      console.error(
        'Error connecting to emulators. Make sure they are running.',
        e
      );
    }
  }
}

export default function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [services, setServices] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the component mounts.
    // This is the correct place to initialize client-side Firebase services.
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);

    // Safely connect to emulators only on the client
    connectToEmulators(firestore, auth);

    setServices({ app, firestore, auth });
  }, []);

  // While services are being initialized on the client, the rest of the app might
  // show a loading state or nothing at all. `AppShell` handles the top-level loading UI.
  if (!services) {
    return null;
  }

  return (
    <FirebaseContext.Provider value={services}>
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

// This function is kept for any server-side initialization needs, but it's now lean.
export function initializeFirebase(): { app: FirebaseApp } {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return { app };
}
