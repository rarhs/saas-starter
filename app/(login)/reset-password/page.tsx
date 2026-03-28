'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../actions';
import { ActionState } from '@/lib/auth/middleware';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resetPassword,
    { error: '' }
  );

  if (!token) {
    return (
      <div>
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          Invalid reset link. Please request a new one.
        </div>
        <div className="mt-6">
          <Link
            href="/forgot-password"
            className="inline-flex items-center text-sm font-medium text-gray-900 hover:underline"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  if (state.success) {
    return (
      <div>
        <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg">
          {state.success}
        </div>
        <div className="mt-6">
          <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 rounded-lg">
            <Link href="/sign-in">Go to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-5" action={formAction}>
      <input type="hidden" name="token" value={token} />

      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          New Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          className="mt-1.5 h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Min. 8 characters"
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          className="mt-1.5 h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Confirm your password"
        />
      </div>

      {state.error && (
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
            Resetting...
          </>
        ) : (
          'Reset password'
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-center px-6 sm:px-12 py-12 bg-white">
      <div className="w-full max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 tracking-tight">
            ProjectHub
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-gray-500 mb-8">
          Enter your new password below.
        </p>

        <Suspense fallback={<div className="h-48" />}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
