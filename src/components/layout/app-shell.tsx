'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, ShieldAlert, Dumbbell, Scan } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

type AppShellProps = {
  children: ReactNode;
};

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: HeartPulse,
  },
  {
    href: '/risk-assessment',
    label: 'Risk Assessment',
    icon: ShieldAlert,
  },
  {
    href: '/injury-scan',
    label: 'Injury Scan',
    icon: Scan,
  }
];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

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
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
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
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
