'use client';

import { useState, useCallback } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteNav } from './SiteNav';

interface SiteShellProps {
  children: React.ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex h-screen flex-col bg-brand-off-white">
      <SiteHeader onMenuToggle={() => setMobileOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-brand-border bg-white overflow-y-auto shrink-0">
          <SiteNav />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              onClick={closeMobile}
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl overflow-y-auto md:hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                <span className="font-heading text-lg tracking-wide">Navigation</span>
                <button
                  onClick={closeMobile}
                  className="rounded-md p-1 text-brand-gray hover:text-foreground"
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>
              <SiteNav onLinkClick={closeMobile} />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
