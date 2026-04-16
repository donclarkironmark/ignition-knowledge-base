import type { Metadata } from 'next';
import { VerticalPage } from '@/components/ui/VerticalPage';

export const metadata: Metadata = { title: 'Franchise & Multi-Unit Brands' };

export default function FranchisePage() {
  return (
    <VerticalPage
      title="Franchise & Multi-Unit Brands"
      subtitle="Close the gap between your best-performing franchisees and everyone else."
      marketStats={[
        '647,000 non-QSR franchise locations across personal services, retail, home services, fitness, education, and more',
        '+2.5% year-over-year growth across the segment',
        'The broadest segment in the TAM — and the one where the performance gap between top and bottom franchisees is most visible',
        'Key stat: 647,000 locations across dozens of industries',
      ]}
      painHeading="What franchise marketers struggle with"
      painPoints={[
        'Franchisees either do nothing with their local marketing budget or go off-brand — there is no middle ground between inaction and chaos',
        'Ad fund contributions collected from every franchisee, but ROI on fund deployment is nearly impossible to demonstrate to the network',
        'Best franchisees figured out what works through trial and error; worst franchisees do not know what to run; there is no scalable way to close the gap',
        'Every franchise system is slightly different — personal services, home repair, fitness, retail — one size does not fit',
      ]}
      solutions={[
        {
          title: 'One-Click Campaign Kits',
          description:
            'Everything a franchisee needs to run a brand-approved campaign in a single deployable unit. Select, customize, launch. No marketing expertise required. No risk of going off-brand. The best practices from top performers packaged for everyone.',
        },
        {
          title: 'Location Benchmarking with Iggy',
          description:
            '"You are in the bottom quartile for marketing-attributed revenue — top performers run two additional campaigns per month. Here is how to match them." Iggy turns network data into specific, actionable guidance for every franchisee.',
        },
        {
          title: 'Ad Fund and Co-op Visibility',
          description:
            'Connects fund spend to network-level and location-level outcomes. Finally prove the ad fund is working — or identify exactly where it is not. Transparency that builds trust between franchisor and franchisees.',
        },
      ]}
      proofHeading="Validated across verticals"
      proofContent={
        <>
          <p className="font-semibold text-emerald-800 mb-1">Cross-Vertical Validation</p>
          <p>
            The Joint Chiropractic validates the franchise model at 900+ locations. Home
            Instead (senior care), South Moon Under (retail), and Madden Plumbing (home
            services) are in the MVP cohort. This cross-vertical validation proves the
            franchise model works beyond any single industry.
          </p>
        </>
      }
      terminology={[
        { term: 'Franchisee / Owner-operator', definition: 'The person or company that owns and runs the local franchise unit' },
        { term: 'Unit', definition: 'Not "store" unless in a QSR context — a single franchise location' },
        { term: 'Ad fund / Brand fund', definition: 'Pooled marketing dollars collected from franchisees, managed by the franchisor for network-wide campaigns' },
        { term: 'Co-op', definition: 'Cooperative advertising — shared marketing programs between franchisor and franchisee, often with matching funds' },
        { term: 'Franchisor', definition: 'The corporate/brand HQ entity that owns the franchise system and sets brand standards' },
      ]}
      roiLinkText="See franchisee-level ROI Reporting"
      iggyLinkText="See how Iggy benchmarks franchisees against top performers"
    />
  );
}
