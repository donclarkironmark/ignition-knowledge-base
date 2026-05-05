'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { NAV_SECTIONS } from '@/config/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface SiteNavProps {
  onLinkClick?: () => void;
}

export function SiteNav({ onLinkClick }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 py-4 px-3">
      {/* Home link */}
      <Link
        href="/"
        onClick={onLinkClick}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          pathname === '/'
            ? 'bg-brand-cyan/10 text-brand-cyan'
            : 'text-foreground hover:bg-brand-off-white'
        }`}
      >
        <Home className="w-4 h-4" />
        Home
      </Link>

      {/* Nav sections */}
      {NAV_SECTIONS.map((section) => (
        <div key={section.heading}>
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-red">
            {section.heading}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={onLinkClick}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-cyan/10 text-brand-cyan font-medium'
                        : 'text-foreground/80 hover:bg-brand-off-white hover:text-foreground'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.status === 'live' && <StatusBadge status="live" size="sm" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
