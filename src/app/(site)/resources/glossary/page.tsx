'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const GLOSSARY_TERMS = [
  {
    term: 'Attribution',
    definition:
      'Connecting a marketing action (like an ad click) to a business outcome (like a sale). "Closed-loop attribution" means tracking the full journey from ad spend to revenue — not just the first touch or last touch, but the complete path.',
    context: 'ROI Reporting, Iggy AI',
  },
  {
    term: 'Brand Guardrails',
    definition:
      'Rules that constrain AI-generated creative output: tone of voice, required disclaimers, prohibited claims, font and color systems, logo treatment. Treated as hard constraints — outputs that violate the rulebook are rejected and regenerated, not flagged for human review.',
    context: 'Dynamic AI Creative',
  },
  {
    term: 'Campaign Kit',
    definition:
      'A pre-configured campaign package with channel mix, creative templates, audience targeting, and budget defaults baked in. Brand HQ assembles the kit; local operators launch it with one click and minimal customization.',
    context: 'Campaign Management, Marketing Hub',
  },
  {
    term: 'CDP',
    definition:
      'Customer Data Platform. A system that unifies customer data from multiple sources (CRM, POS, ad platforms, web analytics, even direct mail response cards) into a single profile per customer. The data layer that turns fragmented marketing signals into an audience asset.',
    context: 'Phase 2 capability',
  },
  {
    term: 'Closed-Loop',
    definition:
      'Tracking that connects the beginning of a marketing journey (an ad impression or click) all the way through to the end result (revenue or sale). Most marketing platforms only track partway — they see the click but not the revenue. Closing the loop means connecting both ends.',
    context: 'ROI Reporting',
  },
  {
    term: 'Co-op / MDF',
    definition:
      'Cooperative advertising funds. Money that brand HQ provides to local operators to spend on marketing, often with rules about how it can be used. MDF stands for Market Development Funds. Both refer to shared marketing budgets between corporate and local.',
    context: 'Franchise vertical, Phase 3 capability',
  },
  {
    term: 'DMP',
    definition:
      'Distributed Marketing Platform. A software platform that helps multilocation brands manage marketing across all their locations from one system. This is the product category Ignition competes in.',
    context: 'Platform-wide',
  },
  {
    term: 'Fixed Ops',
    definition:
      'Automotive industry term for the service and parts departments at a dealership. Called "fixed" because the revenue is more predictable than variable vehicle sales. Higher margins than vehicle sales but often under-marketed.',
    context: 'Automotive vertical',
  },
  {
    term: 'Identity Resolution',
    definition:
      'The process of recognizing the same customer across email, phone, device IDs, loyalty number, and household — resolving multiple signals to one person. Foundational to a CDP: every downstream segment, model, and activation depends on knowing who the same person actually is.',
    context: 'CDP',
  },
  {
    term: 'Iggy',
    definition:
      "Ignition's AI-powered insights agent. Can be used in two modes: proactive alerts (Insights Panel) that surface issues automatically, and conversational Q&A (Ask Iggy) where you type questions in plain English and get data-driven answers.",
    context: 'Iggy AI capability',
  },
  {
    term: 'Insight Lifecycle',
    definition:
      'The tracking states an Iggy insight moves through: New, Acknowledged, In Progress, Resolved, Dismissed. Turns intelligence into accountability by ensuring identified problems are tracked to resolution.',
    context: 'Iggy AI capability',
  },
  {
    term: 'LTO',
    definition:
      'Limited-Time Offer. A promotion available for a short period. Common in QSR — think seasonal menu items, limited deals, or promotional pricing windows. LTO execution across multiple stores is a major pain point.',
    context: 'QSR vertical',
  },
  {
    term: 'Multi-Tenant',
    definition:
      "An architecture where one platform serves multiple separate organizations (brands), each seeing only their own data. Ignition is multi-tenant — each brand's data is completely isolated from other brands on the same platform.",
    context: 'Platform architecture',
  },
  {
    term: 'Notebook (Iggy)',
    definition:
      'A feature where natural language questions become visual reports with metrics, charts, tables, and narrative insights. Reports are saveable, re-runnable, and exportable as PDF. Turns ad-hoc questions into reusable reporting assets.',
    context: 'Iggy AI capability',
  },
  {
    term: 'Predictive Segmentation',
    definition:
      'Audience segments built from forward-looking models — churn risk, upsell readiness, lifetime value tier, lapsed-customer windows — rather than just descriptive criteria. Anticipates the next move instead of describing the last one.',
    context: 'CDP',
  },
  {
    term: 'RBAC',
    definition:
      'Role-Based Access Control. A system where what you can see and do is determined by your role. For example, a Brand Admin sees all locations, a Regional Manager sees their region, and a Location Operator sees only their location.',
    context: 'Platform-wide',
  },
  {
    term: 'ROI',
    definition:
      "Return on Investment. In Ignition's context: how much revenue was generated relative to how much was spent on marketing. Unlike ROAS (Return on Ad Spend) which only measures ad spend, ROI in Ignition can include all marketing costs.",
    context: 'ROI Reporting',
  },
  {
    term: 'Rooftop',
    definition:
      'Automotive industry term for a single dealership location. A dealer group might have 20 "rooftops" — each rooftop is one physical dealership. Used instead of "location" when talking to auto clients.',
    context: 'Automotive vertical',
  },
  {
    term: 'Through-Channel Marketing',
    definition:
      'Marketing that flows through multiple levels of an organization — from brand HQ through regional managers to local operators and their end customers. Ignition serves the entire channel, not just one level. Most competitors serve only headquarters or only local operators.',
    context: 'Platform positioning',
  },
  {
    term: 'VDP',
    definition:
      "Vehicle Detail Page. The webpage showing a specific vehicle's details on a dealer website. VDP views are a key automotive marketing metric — they indicate purchase intent and are used to measure campaign effectiveness for vehicle sales.",
    context: 'Automotive vertical',
  },
];

export default function GlossaryPage() {
  const [filter, setFilter] = useState('');

  const filteredTerms = useMemo(() => {
    if (!filter.trim()) return GLOSSARY_TERMS;
    const q = filter.toLowerCase();
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.context.toLowerCase().includes(q)
    );
  }, [filter]);

  const letters = useMemo(() => {
    const set = new Set(GLOSSARY_TERMS.map((t) => t.term[0].toUpperCase()));
    return Array.from(set).sort();
  }, []);

  return (
    <>
      {/* Page header (inline since this is a client component) */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-heading tracking-wide text-brand-red mb-3">
          Glossary
        </h1>
        <p className="text-lg text-brand-gray leading-relaxed max-w-3xl">
          Key terms and concepts used across the Ignition platform — in plain English.
        </p>
      </div>

      {/* Search box */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter terms..."
          className="w-full rounded-lg border border-brand-border bg-white pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 focus:border-brand-cyan"
        />
      </div>

      {/* Letter jump links */}
      <div className="flex flex-wrap gap-1 mb-6">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-semibold text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Term list */}
      <div className="space-y-4 mb-8">
        {filteredTerms.length === 0 && (
          <p className="text-sm text-brand-gray py-8 text-center">
            No terms match your filter. Try a different search.
          </p>
        )}
        {filteredTerms.map((t, i) => {
          const showLetterHeader =
            i === 0 ||
            t.term[0].toUpperCase() !== filteredTerms[i - 1].term[0].toUpperCase();
          return (
            <div key={t.term}>
              {showLetterHeader && (
                <SectionHeading>
                  <span id={`letter-${t.term[0].toUpperCase()}`}>
                    {t.term[0].toUpperCase()}
                  </span>
                </SectionHeading>
              )}
              <div className="rounded-lg border border-brand-border bg-white p-4">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{t.term}</h3>
                  <span className="shrink-0 text-[10px] font-medium text-brand-gray bg-brand-off-white rounded-full px-2 py-0.5">
                    {t.context}
                  </span>
                </div>
                <p className="text-sm text-brand-gray leading-relaxed">{t.definition}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
