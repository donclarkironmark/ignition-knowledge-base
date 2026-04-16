import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/session';

/**
 * POST /api/auth/logout
 *
 * Clears the session cookie and returns success.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Expire immediately
  });

  return response;
}
