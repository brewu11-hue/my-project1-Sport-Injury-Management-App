'use server';

import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
} from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { headers } from 'next/headers';

const credential = new GoogleAuthProvider();

export async function createSignInUrl(redirectTo?: string) {
  // This is a dummy function that simulates the sign-in flow
  // In a real app, you would redirect to a Firebase sign-in page
  // and handle the callback. For now, we'll just redirect to the
  // page provided in the `next` query param or the root.
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const redirectUrl = new URL(redirectTo || '/', `${protocol}://${host}`);

  return Promise.resolve({
    url: redirectUrl.toString(),
    providerId: 'google.com',
    flow: 'redirect',
  });
}
