import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

/**
 * Login page wrapper with Suspense boundary for useSearchParams.
 * Next.js 16 requires Suspense around client components that use useSearchParams.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f4f2f2]">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
            <div className="animate-pulse space-y-4">
              <div className="mx-auto h-10 w-32 rounded bg-[#f4f2f2]" />
              <div className="h-10 rounded bg-[#f4f2f2]" />
              <div className="h-10 rounded bg-[#f4f2f2]" />
              <div className="h-10 rounded bg-[#f4f2f2]" />
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
