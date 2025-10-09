'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, redirect, useRouter } from 'next/navigation';
import { Dumbbell } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { Skeleton } from '../ui/skeleton';
import { useEffect } from 'react';

type AppShellProps = {
  children: ReactNode;
};

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/risk-assessment',
    label: 'Risk Assessment',
  },
  {
    href: '/injury-scan',
    label: 'Injury Scan',
  },
  {
    href: '/injury-intel',
    label: 'Injury Intel',
  },
];

function UserMenu() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
        const intendedUrl = sessionStorage.getItem('firebase-redirect-url');
        if (intendedUrl) {
            sessionStorage.removeItem('firebase-redirect-url');
            router.replace(intendedUrl);
        }
    }
  }, [user, loading, router])

  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Dumbbell className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10"
              asChild
            >
              <Link href="/dashboard">
                <Dumbbell className="h-6 w-6" />
                <span className="sr-only">Injury Insights</span>
              </Link>
            </Button>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Injury Insights
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className='p-2'>
            <UserMenu />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 px-6 sticky top-0 z-30 md:hidden backdrop-blur-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight">
              Injury Insights
            </h1>
          </div>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
