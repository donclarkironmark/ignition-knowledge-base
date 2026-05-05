import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ignition Insider',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Thin wrapper that renders the Insider-local nav (Feed / Editions / Admin)
 * inside the SiteShell. No full-page chrome — the parent `(site)` layout
 * already supplies the site header and sidebar.
 */
export default function InsiderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-6 border-b border-slate-200 pb-3 text-sm">
        <Link href="/insider" className="font-medium text-slate-700 hover:text-ironmark-red transition-colors">
          Feed
        </Link>
        <Link href="/insider/editions" className="font-medium text-slate-700 hover:text-ironmark-red transition-colors">
          Editions
        </Link>
        <Link href="/insider/admin" className="font-medium text-slate-500 hover:text-ironmark-red transition-colors">
          Admin
        </Link>
      </nav>
      {children}
    </div>
  );
}
