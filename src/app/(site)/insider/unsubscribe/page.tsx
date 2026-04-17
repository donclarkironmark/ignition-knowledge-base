'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { INSIDER_CATEGORIES, type InsiderCategory } from '@/config/insider.config';

type PrefsState = {
  email: string;
  categories: InsiderCategory[];
  is_active: boolean;
};

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-slate-400 text-sm">Loading…</div>}>
      <UnsubscribeInner />
    </Suspense>
  );
}

function UnsubscribeInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [prefs, setPrefs] = useState<PrefsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<InsiderCategory | 'all' | null>(null);
  const [unsubscribed, setUnsubscribed] = useState(false);

  const loadPrefs = useCallback(async () => {
    if (!token) {
      setError('Missing unsubscribe token. Please use the link from your email.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/insider/unsubscribe?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Invalid or expired unsubscribe link');
      }
      const data = await res.json();
      setPrefs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadPrefs();
  }, [loadPrefs]);

  async function toggleCategory(category: InsiderCategory) {
    if (!prefs) { return; }
    const isActive = prefs.categories.includes(category);
    const newCategories = isActive
      ? prefs.categories.filter(c => c !== category)
      : [...prefs.categories, category];

    // Optimistic update
    setPrefs(prev => prev ? { ...prev, categories: newCategories } : prev);
    setSaving(category);

    try {
      const res = await fetch('/api/insider/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, categories: newCategories }),
      });
      if (!res.ok) {
        // Revert on error
        setPrefs(prev => prev ? { ...prev, categories: prefs.categories } : prev);
        const body = await res.json();
        setError(body.error ?? 'Failed to update preferences');
      }
    } catch {
      // Revert on error
      setPrefs(prev => prev ? { ...prev, categories: prefs.categories } : prev);
      setError('Network error — please try again');
    } finally {
      setSaving(null);
    }
  }

  async function handleUnsubscribeAll() {
    setSaving('all');
    setError(null);

    try {
      const res = await fetch('/api/insider/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, unsubscribe_all: true }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to unsubscribe');
      }
      setUnsubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
    } finally {
      setSaving(null);
    }
  }

  // ── Loading state ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-ironmark-red border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading your preferences…</p>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────

  if (error && !prefs) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h1 className="font-veneer text-2xl text-slate-900 tracking-wide mb-2">
          Invalid Link
        </h1>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <p className="text-xs text-slate-400">
          Unsubscribe links expire after use. If you need to update your preferences, use the link from your most recent email.
        </p>
      </div>
    );
  }

  // ── Unsubscribed state ───────────────────────────────────────────────

  if (unsubscribed) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={24} className="text-emerald-600" />
        </div>
        <h1 className="font-veneer text-2xl text-slate-900 tracking-wide mb-2">
          Unsubscribed
        </h1>
        <p className="text-sm text-slate-500">
          You&apos;ve been removed from Ignition Insider. You won&apos;t receive any more digest emails.
        </p>
      </div>
    );
  }

  if (!prefs) { return null; }

  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-ironmark-red flex items-center justify-center mx-auto mb-4">
          <Zap size={22} className="text-white" fill="currentColor" />
        </div>
        <h1 className="font-veneer text-3xl text-slate-900 tracking-wide mb-2">
          Email Preferences
        </h1>
        <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500">
          <Mail size={13} />
          <span>{prefs.email}</span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Category toggles */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        <div className="px-5 py-4">
          <h2 className="font-semibold text-slate-900 text-sm">Which categories would you like?</h2>
          <p className="text-xs text-slate-500 mt-0.5">Toggle each category on or off. Changes save automatically.</p>
        </div>

        {INSIDER_CATEGORIES.map(cat => {
          const isActive = prefs.categories.includes(cat.value);
          const isSavingThis = saving === cat.value;

          return (
            <div key={cat.value} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{cat.label}</p>
              </div>
              <button
                data-testid={`category-toggle-${cat.value}`}
                onClick={() => toggleCategory(cat.value)}
                disabled={isSavingThis || saving === 'all'}
                aria-pressed={isActive}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                  isActive ? '' : 'bg-slate-200'
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
                {isSavingThis && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Unsubscribe all */}
      <div className="text-center">
        <button
          onClick={handleUnsubscribeAll}
          disabled={saving !== null}
          className="text-sm text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50 underline underline-offset-2"
        >
          {saving === 'all' ? 'Unsubscribing…' : 'Unsubscribe from all emails'}
        </button>
      </div>
    </div>
  );
}
