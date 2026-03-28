'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
} from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  const benefits = [
    { icon: FolderKanban, title: 'Project Tracking', desc: 'Organize and monitor all your projects in one place' },
    { icon: CheckSquare, title: 'Task Management', desc: 'Create, assign, and track tasks with your team' },
    { icon: Users, title: 'Contact Management', desc: 'Keep all your clients and leads organized' },
    { icon: BarChart3, title: 'Reports & Export', desc: 'Get insights and export data when you need it' },
  ];

  const inputClasses =
    'h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0';

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left panel — benefits */}
      <div className="hidden lg:flex lg:w-[45%] bg-gray-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-gray-900" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-gray-900 text-sm font-bold">P</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              ProjectHub
            </span>
          </Link>
        </div>
        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight">
              {mode === 'signin'
                ? 'Welcome back.'
                : 'Start managing projects with clarity.'}
            </h2>
            <p className="mt-3 text-gray-400 text-base">
              {mode === 'signin'
                ? 'Sign in to continue where you left off.'
                : 'Join hundreds of teams shipping faster with ProjectHub.'}
            </p>
          </div>
          <div className="space-y-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <b.icon className="h-4 w-4 text-white/70" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} ProjectHub
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 tracking-tight">
                ProjectHub
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {mode === 'signin' ? 'Sign in' : 'Create an account'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === 'signin'
              ? 'Enter your credentials to access your workspace.'
              : 'Get started with your 14-day free trial.'}
          </p>

          <form className="mt-8 space-y-5" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />

            {mode === 'signup' && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  className={`mt-1.5 ${inputClasses}`}
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                className={`mt-1.5 ${inputClasses}`}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                {mode === 'signin' && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className={`mt-1.5 ${inputClasses}`}
                placeholder={mode === 'signin' ? 'Enter your password' : 'Min. 8 characters'}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={100}
                  className={`mt-1.5 ${inputClasses}`}
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {state?.error && (
              <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 rounded-lg text-sm font-medium"
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : mode === 'signin' ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === 'signin' ? (
              <>
                Don&#39;t have an account?{' '}
                <Link
                  href={`/sign-up${redirect ? `?redirect=${redirect}` : ''}${priceId ? `&priceId=${priceId}` : ''}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link
                  href={`/sign-in${redirect ? `?redirect=${redirect}` : ''}${priceId ? `&priceId=${priceId}` : ''}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
