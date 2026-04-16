import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'kb-session';
const SESSION_DURATION_DAYS = 7;

/**
 * Get the signing secret as a Uint8Array (required by jose).
 * Throws at startup if KB_SESSION_SECRET is missing.
 */
function getSecret(): Uint8Array {
  const secret = process.env.KB_SESSION_SECRET;
  if (!secret) {
    throw new Error('KB_SESSION_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

/** Create a signed JWT valid for SESSION_DURATION_DAYS */
export async function createSessionToken(): Promise<string> {
  const token = await new SignJWT({ role: 'viewer' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getSecret());

  return token;
}

/** Verify a session token. Returns true if valid, false otherwise. */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/** Check if the provided password matches KB_PASSWORD */
export function checkPassword(password: string): boolean {
  const expected = process.env.KB_PASSWORD;
  if (!expected) {
    throw new Error('KB_PASSWORD environment variable is not set');
  }
  // Constant-time-ish comparison — not critical for a shared password,
  // but good hygiene.
  if (password.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Cookie name used for the session */
export { COOKIE_NAME };
