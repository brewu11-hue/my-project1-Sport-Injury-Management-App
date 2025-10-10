'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ClientOnly } from '../utility/client-only';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
  {
    href: '/settings',
    label: 'Settings'
  }
];

function NavMenu({
  isMobile = false,
  onLinkClick,
}: {
  isMobile?: boolean;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const Comp = isMobile ? 'div' : 'nav';
  return (
    <Comp
      className={cn(
        'flex items-center gap-4 text-sm font-medium text-muted-foreground',
        isMobile && 'flex-col items-start gap-2',
        !isMobile && 'gap-6'
      )}
    >
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onLinkClick}
          className={cn(
            'transition-colors hover:text-foreground',
            pathname.startsWith(item.href) && 'text-foreground',
            isMobile && 'text-lg font-semibold w-full'
          )}
        >
          {item.label}
        </Link>
      ))}
    </Comp>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src="https://picsum.photos/seed/1/100/100"
              alt="User avatar"
            />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <div className="flex items-center gap-2">
           <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-bold">Injury Insights</span>
          </Link>
        </div>
        
        <ClientOnly>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
            <SheetContent side="left" className="flex flex-col">
               <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <Dumbbell className="h-6 w-6 text-primary" />
                    <span>Injury Insights</span>
                  </Link>
                  <NavMenu isMobile={true} onLinkClick={() => setIsSheetOpen(false)}/>
                </nav>
            </SheetContent>
          </Sheet>
        </ClientOnly>

        <nav className="hidden flex-col text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-6">
          <NavMenu />
        </nav>

        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
           <ClientOnly>
            <UserMenu />
          </ClientOnly>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
