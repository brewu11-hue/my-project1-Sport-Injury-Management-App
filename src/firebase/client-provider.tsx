'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

type FirebaseServices = {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
};

export default function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the component mounts.
    const { app, firestore, auth } = initializeFirebase();
    setServices({ app, firestore, auth });
  }, []);

  // While services are being initialized on the client, you can render a loading state
  // or null, but for this app, the AppShell will handle the main loading indicator.
  if (!services) {
    return null;
  }

  return <FirebaseProvider value={services}>{children}</FirebaseProvider>;
}
