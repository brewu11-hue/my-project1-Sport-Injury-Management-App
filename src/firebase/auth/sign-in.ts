'use client';

import {
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth,
} from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

function getClientApp() {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export async function signInWithGoogle(redirectTo?: string) {
  const app = getClientApp();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Store the redirect URL in session storage to be retrieved after sign-in
  if (redirectTo) {
    sessionStorage.setItem('firebase-redirect-url', redirectTo);
  }

  await signInWithRedirect(auth, provider);
}
