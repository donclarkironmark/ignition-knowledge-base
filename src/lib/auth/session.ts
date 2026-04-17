import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'kb-session';
const SESSION_DURATION_DAYS = 7;

export type SessionRole = 'viewer' | 'admin';

function getSecret(): Uint8Array {
  const secret = process.env.KB_SESSION_SECRET;
  if (!secret) {
    throw new Error('KB_SESSION_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

/** Create a signed JWT valid for SESSION_DURATION_DAYS with the given role */
export async function createSessionToken(role: SessionRole = 'viewer'): Promise<string> {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getSecret());

  return token;
}

/** Verify a session token. Returns { role } if valid, null otherwise. */
export async function verifySessionToken(
  token: string,
): Promise<{ role: SessionRole } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role;
    if (role === 'admin' || role === 'viewer') {
      return { role };
    }
    return null;
  } catch {
    return null;
  }
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) { return false; }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Check the provided password against KB_PASSWORD (viewer) and
 * KB_ADMIN_PASSWORD (admin, optional). Admin is tried first so that if both
 * passwords are ever identical, admin wins.
 */
export function checkPassword(password: string): SessionRole | null {
  const viewer = process.env.KB_PASSWORD;
  if (!viewer) {
    throw new Error('KB_PASSWORD environment variable is not set');
  }

  const admin = process.env.KB_ADMIN_PASSWORD;
  if (admin && constantTimeEquals(password, admin)) {
    return 'admin';
  }

  if (constantTimeEquals(password, viewer)) {
    return 'viewer';
  }

  return null;
}

export { COOKIE_NAME };
