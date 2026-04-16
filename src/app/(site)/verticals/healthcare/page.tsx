import type { Metadata } from 'next';
import { VerticalPage } from '@/components/ui/VerticalPage';

export const metadata: Metadata = { title: 'Healthcare & Chiropractic' };

export default function HealthcarePage() {
  return (
    <VerticalPage
      title="Healthcare & Chiropractic"
      subtitle="From patient acquisition to clinic-level ROI — marketing intelligence for healthcare networks."
      marketStats={[
        '40,000 enterprise healthcare locations (hospitals, ASCs, urgent care, multi-location physician groups)',
        '70,000 chiropractic clinics across the US',
        'Franchise chiropractic segment growing at 28.5% CAGR — the fastest-growing sub-segment in healthcare',
        'Key stat: 110,000 total addressable locations',
      ]}
      painHeading="What healthcare marketers struggle with"
      painPoints={[
        'Clinic managers are not marketers — there is wide variance in local marketing skills and execution across locations in a network',
        'Fragmented tooling (print portals, creative asset managers, digital vendors) with no hierarchical visibility across the network',
        'Attribution gaps across the full funnel: media spend to call to schedule to visit to revenue — nobody can connect the dots',
        'HIPAA and PHI compliance slows speed to market and limits what tools clinics can safely use',
      ]}
      solutions={[
        {
          title: 'Location-Level ROI Reporting',
          description:
            'Turns 900 scattered clinic reports into one source of truth showing new patient cost and channel performance by clinic. You see which clinics are acquiring patients efficiently and which are overspending — in one dashboard.',
        },
        {
          title: 'Iggy AI for Clinic Benchmarking',
          description:
            'Surfaces insights in plain language: "Your new patient cost is 34% above network average — here is what top clinics do differently." No manual analysis. No waiting for someone to pull the numbers. Iggy finds the pattern and tells you.',
        },
        {
          title: 'Patient Acquisition Attribution',
          description:
            'Connects campaign spend to call tracking, appointment booking, and new patient visits. The full funnel from ad to patient, not just ad to click.',
        },
        {
          title: 'HIPAA-Aware Workflows',
          description:
            'Privacy-first architecture designed for healthcare compliance requirements. Clinics can use the platform without compromising patient data or violating regulatory standards.',
        },
      ]}
      proofHeading="Already in production"
      proofContent={
        <>
          <p className="font-semibold text-emerald-800 mb-1">The Joint Chiropractic</p>
          <p>
            900+ clinic locations live on Ignition as of February 2026. Network-wide ROI
            reporting with clinic-level granularity. The largest deployment on the Ignition
            platform, validating the healthcare model at scale.
          </p>
        </>
      }
      terminology={[
        { term: 'New patient cost', definition: 'Not "cost per lead" — the cost to acquire a new patient through the door' },
        { term: 'Clinic', definition: 'Not "location" or "store" — a healthcare practice location' },
        { term: 'Patient acquisition', definition: 'Not "lead generation" — the process of getting new patients into a clinic' },
        { term: 'Provider / Practitioner', definition: 'Not "operator" — the healthcare professional at the clinic' },
      ]}
      roiLinkText="See how ROI Reporting works for healthcare networks"
      iggyLinkText="See how Iggy provides clinic-level benchmarking"
    />
  );
}
