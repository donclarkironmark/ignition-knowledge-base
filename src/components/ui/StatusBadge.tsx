import type { NavStatus } from '@/config/navigation';

const STATUS_STYLES: Record<NavStatus, { bg: string; text: string; label: string }> = {
  live: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'LIVE' },
  phase2: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'PHASE 2' },
  phase3: { bg: 'bg-gray-200', text: 'text-gray-600', label: 'PHASE 3' },
};

interface StatusBadgeProps {
  status: NavStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide ${style.bg} ${style.text} ${sizeClasses}`}
    >
      {style.label}
    </span>
  );
}
