import { NextResponse, type NextRequest } from 'next/server';
import { checkPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth/session';

/**
 * POST /api/auth/login
 *
 * Validates the password (viewer or admin) and sets a signed session cookie
 * whose payload carries the resolved role.
 */
export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { password } = body;
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  const role = checkPassword(password);
  if (!role) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await createSessionToken(role);

  const response = NextResponse.json({ ok: true, role });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
