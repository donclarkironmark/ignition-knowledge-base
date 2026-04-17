import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, CalendarDays, ChevronRight } from 'lucide-react';
import { getPublicEditions } from '@/lib/insider-edition.service';
import type { InsiderEdition } from '@/config/insider.config';

// Supabase-backed — don't attempt static prerender at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editions — Ignition Insider',
  robots: { index: false, follow: false },
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const endOpts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', endOpts)}`;
}

export default async function EditionsPage() {
  const editions: InsiderEdition[] = await getPublicEditions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-ironmark-cyan" />
          <h1 className="font-veneer text-3xl text-slate-900 tracking-wide">
            Weekly Editions
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          Every week&apos;s competitive intelligence, packaged and archived.
        </p>
      </div>

      {/* Edition list */}
      {editions.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-veneer text-xl tracking-wide mb-1">No editions yet</p>
          <p className="text-sm">Check back soon — the first edition is on its way.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {editions.map(edition => (
            <EditionCard key={edition.id} edition={edition} />
          ))}
        </div>
      )}
    </div>
  );
}

function EditionCard({ edition }: { edition: InsiderEdition }) {
  return (
    <Link
      href={`/insider/editions/${edition.id}`}
      className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        {/* Edition number badge */}
        <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-ironmark-red transition-colors">
          <span className="font-veneer text-white text-lg leading-none">
            #{edition.edition_number}
          </span>
        </div>

        {/* Info */}
        <div>
          <h2 className="font-semibold text-slate-900 group-hover:text-ironmark-red transition-colors">
            {edition.title ?? `Edition #${edition.edition_number}`}
          </h2>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
            <CalendarDays size={11} />
            <span>{formatDateRange(edition.week_start, edition.week_end)}</span>
            {edition.published_at && (
              <>
                <span>·</span>
                <span>
                  Published{' '}
                  {new Date(edition.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>
          {edition.executive_summary && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">
              {edition.executive_summary}
            </p>
          )}
        </div>
      </div>

      <ChevronRight size={18} className="text-slate-300 group-hover:text-ironmark-red transition-colors shrink-0" />
    </Link>
  );
}
