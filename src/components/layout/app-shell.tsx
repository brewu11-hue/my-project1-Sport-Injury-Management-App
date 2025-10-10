'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

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

function NavMenu({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const Comp = isMobile ? 'div' : 'nav';
  return (
    <Comp
      className={cn(
        'flex items-center gap-4 text-sm font-medium text-muted-foreground',
        isMobile && 'flex-col items-start gap-2'
      )}
    >
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'transition-colors hover:text-foreground',
            pathname.startsWith(item.href) && 'text-foreground',
            isMobile && 'text-lg font-semibold'
          )}
        >
          {item.label}
        </Link>
      ))}
    </Comp>
  );
}


export default function AppShell({ children }: AppShellProps) {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="sr-only">Injury Insights</span>
          </Link>
          <NavMenu />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Dumbbell className="h-6 w-6 text-primary" />
                <span className="sr-only">Injury Insights</span>
              </Link>
              <NavMenu isMobile={true}/>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
             <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Injury Insights
            </h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}