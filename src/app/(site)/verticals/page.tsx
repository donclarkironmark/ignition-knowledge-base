import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InternalLink } from '@/components/ui/InternalLink';

export const metadata: Metadata = { title: 'Industries We Serve' };

export default function VerticalsOverviewPage() {
  return (
    <>
      <PageHeader
        title="Industries We Serve"
        subtitle="Ignition is purpose-built for multilocation brands. Here's how it works in your vertical."
      />

      {/* Vertical Cards */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        {VERTICALS.map((v) => (
          <Link key={v.href} href={v.href} className="block no-underline group">
            <div className="rounded-lg border border-brand-border bg-white p-5 h-full hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-cyan transition-colors mb-1">
                {v.name}
              </h3>
              <p className="text-xs font-medium text-brand-cyan mb-2">{v.stat}</p>
              <p className="text-sm text-brand-gray leading-relaxed">{v.tagline}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Why Verticals Matter */}
      <SectionHeading>One platform, adapted for each industry</SectionHeading>
      <p className="text-brand-gray leading-relaxed mb-4">
        Ignition is not one-size-fits-all. Each vertical has specific terminology, compliance
        requirements, KPIs, and operational patterns that generic marketing platforms ignore.
      </p>
      <p className="text-brand-gray leading-relaxed mb-4">
        Our vertical pages use the language your customers use. Healthcare talks about
        patients and clinics, not leads and stores. QSR talks about LTOs and guest counts.
        Automotive talks about rooftops and repair orders. Financial services talks about
        advisors and branches.
      </p>
      <p className="text-brand-gray leading-relaxed mb-8">
        When you are preparing for a customer conversation, start with their vertical page.
        It will give you the terminology, pain points, and proof points you need to speak
        their language.
      </p>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/platform">Learn the full Ignition story</InternalLink>
        <InternalLink href="/capabilities">See platform capabilities</InternalLink>
      </div>
    </>
  );
}

const VERTICALS = [
  {
    name: 'Healthcare & Chiropractic',
    stat: '110,000 locations',
    tagline:
      'Clinic networks, chiropractic franchises, and healthcare systems. From patient acquisition to clinic-level ROI.',
    href: '/verticals/healthcare',
  },
  {
    name: 'Quick Service Restaurants',
    stat: '204,000 locations',
    tagline:
      'QSR franchises and multi-unit restaurant operators. Store-level LTO performance and franchise marketing intelligence.',
    href: '/verticals/qsr',
  },
  {
    name: 'Automotive Dealers',
    stat: '18,000 rooftops',
    tagline:
      'Dealer groups and OEM franchise networks. Unified sales and service marketing with proprietary data.',
    href: '/verticals/automotive',
  },
  {
    name: 'Financial Services',
    stat: '98,000+ locations',
    tagline:
      'Banks, credit unions, advisory firms, and insurance agencies. Compliant advisor marketing with full audit trails.',
    href: '/verticals/financial-services',
  },
  {
    name: 'Franchise & Multi-Unit',
    stat: '647,000 locations',
    tagline:
      'Personal services, retail, home services, fitness, education, and more. Close the gap between your best-performing franchisees and everyone else.',
    href: '/verticals/franchise',
  },
];
