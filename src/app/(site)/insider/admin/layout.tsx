import { redirect } from 'next/navigation';
import { getServerSessionRole } from '@/lib/secure-route';

/**
 * Server-side admin gate for the Insider admin surface.
 *
 * Reads the session cookie, verifies the JWT, and redirects any
 * non-admin request to /login before the admin page component runs.
 * All routes under /insider/admin/** inherit this layout.
 */
export default async function InsiderAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getServerSessionRole();

  if (role !== 'admin') {
    redirect('/login?redirect=/insider/admin');
  }

  return <>{children}</>;
}
