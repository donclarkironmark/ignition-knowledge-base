import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'kb-session';

// Routes that don't require authentication.
// Insider subscribe/unsubscribe endpoints must be callable from email clients
// (recipients of digest emails click unsubscribe links without logging in).
// The cron endpoint authenticates via CRON_SECRET bearer (enforced inside the route).
const PUBLIC_ROUTES = [
  '/login',
  '/api/auth',
  '/api/insider/subscribe',
  '/api/insider/unsubscribe',
  '/api/insider/cron',
  '/insider/unsubscribe',
];

/**
 * Auth middleware — simple JWT cookie check.
 *
 * Reads the kb-session cookie, verifies the JWT signature,
 * and redirects to /login if missing or invalid.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and Next.js internals — skip
  if (pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Pagefind search index chunks — skip
  if (pathname.startsWith('/pagefind/')) {
    return NextResponse.next();
  }

  // Public routes — skip
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // API routes that carry an Authorization: Bearer header do their own auth
  // (e.g. /api/insider/admin/posts supports INSIDER_SERVICE_TOKEN for Routines,
  // /api/insider/cron/* uses CRON_SECRET). Let them through; the route handler
  // validates the token and returns 401/403 on its own.
  if (pathname.startsWith('/api/') && request.headers.get('authorization')?.startsWith('Bearer ')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return redirectToLogin(request, pathname);
  }

  // Verify JWT
  try {
    const secret = new TextEncoder().encode(process.env.KB_SESSION_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Invalid or expired token — clear it and redirect
    const response = redirectToLogin(request, pathname);
    response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return response;
  }
}

/** Build a redirect response to /login with the original path preserved */
function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
