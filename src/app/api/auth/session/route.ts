import { NextResponse, type NextRequest } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';

/**
 * GET /api/auth/session
 *
 * Returns the current session role derived from the kb-session cookie.
 * Used by client components (e.g. AdminGuard) that can't read the httpOnly
 * cookie directly.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false, role: null }, { status: 200 });
  }

  const result = await verifySessionToken(token);
  if (!result) {
    return NextResponse.json({ authenticated: false, role: null }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, role: result.role });
}
