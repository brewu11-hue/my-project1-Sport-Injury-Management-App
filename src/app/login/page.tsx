'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import AuthForm from '@/components/auth/auth-form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

function LoginContent() {
  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-4">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your personalized injury insights.
              </CardDescription>
            </CardHeader>
            <AuthForm />
          </Card>
        </div>
      </div>
      <footer className="p-4">
        <Link href="/dashboard">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
            <Dumbbell className="h-6 w-6" />
          </div>
        </Link>
      </footer>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense>
        <LoginContent />
    </Suspense>
  )
}
