import type { Metadata } from 'next';
import { VerticalPage } from '@/components/ui/VerticalPage';

export const metadata: Metadata = { title: 'Automotive Dealers' };

export default function AutomotivePage() {
  return (
    <VerticalPage
      title="Automotive Dealers"
      subtitle="Unified sales and service marketing intelligence for dealer groups."
      marketStats={[
        '18,000 franchised dealership rooftops across the US',
        'Average revenue per dealership approximately $70.8M',
        'Top 150 dealer groups control 33% of total industry revenue',
        'Key stat: 18,000 rooftops, $1.3 trillion in total industry revenue',
      ]}
      painHeading="What auto marketers struggle with"
      painPoints={[
        'Each rooftop running its own marketing through its own vendors — no aggregate visibility across the group',
        'OEM co-op programs are a compliance nightmare; money is left on the table annually due to missed claims and documentation gaps',
        'Service marketing (fixed ops) is under-leveraged versus sales despite significantly higher margins',
        'Siloed systems everywhere: DMS, CRM, inventory feeds, websites, call tracking — none of them talk to each other',
      ]}
      solutions={[
        {
          title: 'AMMS Data Asset',
          description:
            '160 million automotive consumer records enabling audience segments no competitor can build. In-market buyers, service mileage intervals, conquest opportunities — proprietary data that fuels targeting and intelligence other platforms simply cannot replicate.',
        },
        {
          title: 'Unified Sales + Service ROI',
          description:
            'Campaign spend mapped to VDP views, leads, appointments, and closed repair orders by rooftop. Both the sales floor and the service bay get attribution, giving dealer groups a complete picture of marketing ROI.',
        },
        {
          title: 'OEM Co-op Compliance',
          description:
            'Pre-approved templates, auto-generated offer footnotes and disclaimers, and documentation that meets OEM submission requirements. Stop leaving co-op money on the table because the paperwork is too complicated.',
        },
      ]}
      proofHeading="Data already in production"
      proofContent={
        <>
          <p className="font-semibold text-emerald-800 mb-1">AMMS — 160M Records</p>
          <p>
            The AMMS automotive data asset is live and generating measurable value. Channel
            partners like DealerWing and Dynatron already white-label Ironmark solutions in
            the automotive space. This proprietary data is the moat — no competitor can
            replicate this asset.
          </p>
        </>
      }
      terminology={[
        { term: 'Rooftop', definition: 'Not "location" — a single dealership location within a dealer group' },
        { term: 'Fixed ops / Service department', definition: 'The parts and service side of the dealership (higher margins than vehicle sales)' },
        { term: 'VDP', definition: 'Vehicle Detail Page — the webpage showing a specific vehicle\'s details; VDP views are a key marketing metric' },
        { term: 'DMS', definition: 'Dealer Management System — the dealership\'s core operating software (like Reynolds & Reynolds or CDK)' },
        { term: 'RO', definition: 'Repair Order — a service department work ticket; closed ROs are the downstream conversion metric for service marketing' },
      ]}
      roiLinkText="See rooftop-level ROI Reporting"
      iggyLinkText="See how Iggy analyzes dealership performance"
    />
  );
}
