'use client';

/**
 * AdminGuard — client-side passthrough.
 *
 * The real admin gate is the server-component layout at
 * `src/app/(site)/insider/admin/layout.tsx`, which reads the session cookie
 * and redirects non-admins to /login before any admin page renders. That
 * enforcement runs on the server and cannot be bypassed.
 *
 * This client component exists so that the ported Insider pages — which wrap
 * their content in `<AdminGuard>` — can import and render without rewrites.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
