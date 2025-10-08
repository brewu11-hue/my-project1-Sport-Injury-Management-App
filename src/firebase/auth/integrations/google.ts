'use server';

// This file is intentionally left with minimal code.
// The actual sign-in logic is now handled on the client-side
// to prevent server crashes related to incorrect context usage.
// See src/firebase/auth/sign-in.ts for the implementation.

export async function createSignInUrl(redirectTo?: string) {
  // This server-side function is part of a legacy pattern.
  // The sign-in flow has been moved to the client.
  return Promise.resolve({
    url: redirectTo || '/',
    providerId: 'google.com',
    flow: 'redirect',
  });
}
