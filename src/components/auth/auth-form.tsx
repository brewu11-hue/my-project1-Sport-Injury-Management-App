'use client';

import { useSearchParams } from 'next/navigation';
import { signInWithGoogle } from '@/firebase/auth/sign-in';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ChromeIcon } from 'lucide-react';

export default function AuthForm() {
    const searchParams = useSearchParams();
    const next = searchParams.get('next') ?? '/';
  
    const handleGoogleSignIn = async () => {
      await signInWithGoogle(next);
    };
  
    return (
      <>
        <CardContent>
            <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
                <ChromeIcon className="mr-2 h-4 w-4" />
                Sign in with Google
            </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center justify-center">
            <p>By signing in, you agree to our Terms of Service.</p>
        </CardFooter>
      </>
    );
  }
  