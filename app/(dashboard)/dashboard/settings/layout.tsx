'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard/settings', icon: Users, label: 'Team' },
    { href: '/dashboard/settings/general', icon: Settings, label: 'General' },
    { href: '/dashboard/settings/activity', icon: Activity, label: 'Activity' },
    { href: '/dashboard/settings/security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <nav className="flex lg:flex-col gap-1 lg:w-48 shrink-0 overflow-x-auto lg:overflow-x-visible p-2 lg:p-0">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={`shadow-none w-full justify-start ${
                pathname === item.href ? 'bg-gray-100' : ''
              }`}
              size="sm"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}
