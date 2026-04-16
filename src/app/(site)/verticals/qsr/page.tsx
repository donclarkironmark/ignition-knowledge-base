import type { Metadata } from 'next';
import { VerticalPage } from '@/components/ui/VerticalPage';

export const metadata: Metadata = { title: 'Quick Service Restaurants' };

export default function QsrPage() {
  return (
    <VerticalPage
      title="Quick Service Restaurants"
      subtitle="Store-level campaign performance, LTO execution, and franchise marketing intelligence."
      marketStats={[
        '204,000 QSR franchise locations — the largest addressable segment in our TAM',
        '82% operated by multi-unit franchisees running multiple stores',
        '+2.2% year-over-year growth',
        'Key stat: 204,000 locations with high franchise density',
      ]}
      painHeading="What QSR marketers struggle with"
      painPoints={[
        "LTO execution is fragmented and inconsistent at the store level — corporate doesn't know if stores are actually running the campaigns",
        'Disconnected data across POS, loyalty programs, app/web ordering, and delivery marketplaces — nothing talks to anything else',
        'Heavy lift to localize creative across hundreds of stores for each LTO window, and compliance is difficult to verify at scale',
        "Co-op and ad fund dollars deployed on faith with no ROI proof — franchisees don't know if the money is working",
      ]}
      solutions={[
        {
          title: 'Campaign Performance by Location',
          description:
            'Store-by-store view for every active LTO campaign. Not brand-level averages — actual performance at each individual store. You can see which stores are executing and which are not, in real time.',
        },
        {
          title: 'Channel Attribution for Local Marketing',
          description:
            'Connects marketing spend to same-store traffic indicators and average ticket movement. The link between what was spent and what happened at the register.',
        },
        {
          title: 'Network Benchmarking',
          description:
            'Surfaces top-quartile franchisee behavior and packages it as actionable recommendations for underperformers. Instead of guessing what works, Iggy shows you what the best operators are doing differently.',
        },
      ]}
      proofHeading="In the pipeline"
      proofContent={
        <>
          <p className="font-semibold text-emerald-800 mb-1">Domino&apos;s</p>
          <p>
            Targeted for onboarding as the first QSR customer on Ignition. QSR-specific
            campaign kits (LTO Booster, New-Store Launch) are designed and ready for the
            platform. This validates the QSR model for the broader 204,000-location market.
          </p>
        </>
      }
      terminology={[
        { term: 'LTO', definition: 'Limited-Time Offer — a promotion available for a short period (seasonal menu items, limited deals)' },
        { term: 'Store / Unit', definition: 'Not "location" in customer conversations — a single restaurant location' },
        { term: 'Guest count / Traffic', definition: 'Not "leads" — the number of customers visiting a store' },
        { term: 'Average ticket', definition: 'Not "order value" — the average amount spent per guest visit' },
        { term: 'Franchisee / Operator', definition: 'The person or company that owns and runs the store(s)' },
      ]}
      roiLinkText="See store-level ROI Reporting"
      iggyLinkText="See how Iggy benchmarks stores against top performers"
    />
  );
}
