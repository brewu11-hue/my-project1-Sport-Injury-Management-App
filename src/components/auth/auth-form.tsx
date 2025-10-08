'use client';

import { useSearchParams } from 'next/navigation';
import { signInWithGoogle } from '@/firebase/auth/sign-in';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';

function GoogleIcon() {
    return (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
      >
        <path
          fill="#4285F4"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#34A853"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C39.302,36.55,44,30.725,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#FBBC05"
          d="M10.21,28.64c-0.63-1.89-1-3.88-1-5.94s0.37-4.05,1-5.94l-5.657-5.657C2.353,15.56,1,19.61,1,24 s1.353,8.44,3.553,11.95L10.21,28.64z"
        ></path>
        <path
          fill="#EA4335"
          d="M24,48c5.268,0,9.97-1.87,13.29-5.01l-6.19-5.238C29.23,39.33,26.73,40,24,40 c-4.52,0-8.3-2.61-9.94-6.36l-6.07,5.55C10.24,44.13,16.5,48,24,48z"
        ></path>
        <path fill="none" d="M1,1h46v46H1z"></path>
      </svg>
    );
  }

export default function AuthForm() {
    const searchParams = useSearchParams();
    const next = searchParams.get('next') ?? '/';
  
    const handleGoogleSignIn = async () => {
      await signInWithGoogle(next);
    };
  
    return (
      <>
        <CardContent>
            <Button onClick={handleGoogleSignIn} className="w-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:text-blue-700">
                <GoogleIcon />
                Sign in with Google
            </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center justify-center">
            <p>By signing in, you agree to our Terms of Service.</p>
        </CardFooter>
      </>
    );
  }
  
