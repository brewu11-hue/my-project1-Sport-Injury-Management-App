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
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

type FirebaseContextValue = {
  app: FirebaseApp;
  firestore: Firestore;
} | null;

const FirebaseContext = createContext<FirebaseContextValue>(null);

export default function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [services, setServices] = useState<FirebaseContextValue>(null);

  useEffect(() => {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    
    setServices({ app, firestore });
  }, []);

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

export function initializeFirebase(): { app: FirebaseApp } {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return { app };
}
