import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/layout/app-shell';
import FirebaseClientProvider from '@/firebase/client-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Injury Insights',
  description: 'Track and manage sport injuries with AI-powered insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head />
      <body className="font-body antialiased h-full bg-background">
        <FirebaseClientProvider>
          <AppShell>{children}</AppShell>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
