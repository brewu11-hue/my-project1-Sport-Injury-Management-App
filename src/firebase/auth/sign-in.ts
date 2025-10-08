'use server';

import { createSignInUrl } from '@/firebase/auth/integrations/google';
import { redirect } from 'next/navigation';

export async function signInWithGoogle(redirectTo?: string) {
  const { url, providerId, flow } = await createSignInUrl(redirectTo);

  if (url) {
    redirect(url);
  }
}
