'use client';

import Link from 'next/link';
import { use, useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Settings, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter, usePathname } from 'next/navigation';

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href="#features"
          className="hidden sm:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/sign-in"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign In
        </Link>
        <Button
          asChild
          size="sm"
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-5 py-2 rounded-full"
        >
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Link
        href="#features"
        className="hidden sm:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        Features
      </Link>
      <Link
        href="/pricing"
        className="hidden sm:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        Pricing
      </Link>
      <Link
        href="/dashboard"
        className="hidden sm:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        Dashboard
      </Link>
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback className="bg-gray-900 text-white text-xs font-medium">
            {(user.name || user.email)
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard/settings" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm'
          : isDashboard
            ? 'bg-white border-b border-gray-200'
            : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 tracking-tight">
            ProjectHub
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Suspense fallback={null}>
            <div className="flex flex-col gap-3">
              <UserMenu />
            </div>
          </Suspense>
        </div>
      )}
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
