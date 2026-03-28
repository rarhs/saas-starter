'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../actions';
import { ActionState } from '@/lib/auth/middleware';

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    forgotPassword,
    { error: '' }
  );

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
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we&#39;ll send you a link to reset your password.
        </p>

        {state.success ? (
          <div className="mt-8">
            <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg">
              {state.success}
            </div>
            <div className="mt-6">
              <Link
                href="/sign-in"
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:underline"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-5" action={formAction}>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="you@company.com"
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
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/sign-in"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
