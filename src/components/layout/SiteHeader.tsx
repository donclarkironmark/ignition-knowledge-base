'use client';

import { useRouter } from 'next/navigation';
import { Menu, LogOut, Flame } from 'lucide-react';

interface SiteHeaderProps {
  onMenuToggle: () => void;
}

export function SiteHeader({ onMenuToggle }: SiteHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-brand-border bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden rounded-md p-1.5 text-foreground hover:bg-brand-off-white"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo / site title */}
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand-red" />
          <span className="font-heading text-xl tracking-wide text-foreground">
            Ignition
          </span>
          <span className="hidden sm:inline text-xs text-brand-gray font-medium tracking-wide uppercase">
            Knowledge Base
          </span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-brand-gray hover:text-foreground hover:bg-brand-off-white transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
