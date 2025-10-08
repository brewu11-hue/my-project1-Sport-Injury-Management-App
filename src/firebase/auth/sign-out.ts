'use server';

import { getAuth } from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { redirect } from 'next/navigation';

function getClientApp() {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export async function signOut() {
  const auth = getAuth(getClientApp());
  await auth.signOut();
  redirect('/login');
}
