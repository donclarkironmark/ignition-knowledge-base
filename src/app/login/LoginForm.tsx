'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Login form — single shared password (S-03, S-05, S-06)
 *
 * POSTs to /api/auth/login, which sets an httpOnly session cookie.
 * Redirects to the originally requested page after success.
 */
export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      const redirectTo = searchParams.get('redirect') ?? '/';
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f2f2]">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1
            className="text-4xl tracking-wide text-[#1a1a1a]"
            style={{ fontFamily: 'var(--font-bebas-neue), system-ui' }}
          >
            Ignition
          </h1>
          <p className="mt-1 text-sm text-[#707070]">Insider</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[#1a1a1a]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              autoFocus
              className="w-full rounded-lg border border-[#e5e5e5] px-4 py-2.5 text-[#1a1a1a] outline-none transition focus:border-[#38C6F4] focus:ring-2 focus:ring-[#38C6F4]/20"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E9472F] px-4 py-2.5 font-medium text-white transition hover:bg-[#d33e29] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#707070]">
          Internal use only — contact Don for access
        </p>
      </div>
    </div>
  );
}
