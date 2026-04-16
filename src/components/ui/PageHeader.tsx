import type { NavStatus } from '@/config/navigation';

const BANNER_STYLES: Record<NavStatus, { bg: string; text: string; message: string }> = {
  live: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    message: 'This capability is live in production.',
  },
  phase2: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    message: 'This capability is in development.',
  },
  phase3: {
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-600',
    message: 'This capability is on the roadmap.',
  },
};

interface PageHeaderProps {
  title: string;
  subtitle: string;
  status?: NavStatus;
}

export function PageHeader({ title, subtitle, status }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {status && (
        <div className={`mb-4 rounded-lg border px-4 py-2.5 text-sm font-medium ${BANNER_STYLES[status].bg} ${BANNER_STYLES[status].text}`}>
          {BANNER_STYLES[status].message}
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-heading tracking-wide text-brand-red mb-3">
        {title}
      </h1>
      <p className="text-lg text-brand-gray leading-relaxed max-w-3xl">
        {subtitle}
      </p>
    </div>
  );
}
