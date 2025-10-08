'use client';

import { Suspense } from 'react';
import AuthForm from '@/components/auth/auth-form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function LoginContent() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="w-full max-w-md">
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
  );
}


export default function LoginPage() {
  return (
    <Suspense>
        <LoginContent />
    </Suspense>
  )
}
