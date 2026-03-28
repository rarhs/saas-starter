import { Suspense } from 'react';
import { Login } from '../login';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign Up' };

export default function SignUpPage() {
  return (
    <Suspense>
      <Login mode="signup" />
    </Suspense>
  );
}
