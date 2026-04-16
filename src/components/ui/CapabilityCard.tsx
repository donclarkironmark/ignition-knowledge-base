import Link from 'next/link';
import type { NavStatus } from '@/config/navigation';
import { StatusBadge } from './StatusBadge';

const ACCENT_COLORS: Record<NavStatus, string> = {
  live: 'border-l-emerald-500',
  phase2: 'border-l-amber-400',
  phase3: 'border-l-gray-400',
};

interface CapabilityCardProps {
  title: string;
  description: string;
  status: NavStatus;
  href?: string;
}

export function CapabilityCard({ title, description, status, href }: CapabilityCardProps) {
  const card = (
    <div
      className={`rounded-lg border border-brand-border bg-white p-5 shadow-sm border-l-4 ${ACCENT_COLORS[status]} ${href ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <StatusBadge status={status} size="sm" />
      </div>
      <p className="text-sm text-brand-gray leading-relaxed">{description}</p>
    </div>
  );

  if (href) {
    return <Link href={href} className="block no-underline">{card}</Link>;
  }

  return card;
}
