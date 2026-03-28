'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mainNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/dashboard/contacts', icon: Users, label: 'Contacts' },
    { href: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
  ];

  const bottomNavItems = [
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      <div className="flex-1">
        {mainNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive(item.href) ? 'secondary' : 'ghost'}
              className={`shadow-none my-1 w-full justify-start ${
                isActive(item.href) ? 'bg-gray-100' : ''
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
      <div>
        <Separator className="my-2" />
        {bottomNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive(item.href) ? 'secondary' : 'ghost'}
              className={`shadow-none my-1 w-full justify-start ${
                isActive(item.href) ? 'bg-gray-100' : ''
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <span className="font-medium">Dashboard</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full relative">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold">ProjectHub</span>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="h-full overflow-y-auto p-4 flex flex-col">
            {navContent}
          </nav>
        </aside>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 shrink-0">
          <nav className="h-full overflow-y-auto p-4 flex flex-col">
            {navContent}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4 min-w-0">{children}</main>
      </div>
    </div>
  );
}
