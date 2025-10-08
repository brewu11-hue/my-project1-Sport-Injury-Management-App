'use client';

import { useMemo, type ReactNode } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase/provider';

export default function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useMemo(initializeFirebase, []);

  return <FirebaseProvider value={value}>{children}</FirebaseProvider>;
}