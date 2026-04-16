import type { Metadata } from 'next';
import { VerticalPage } from '@/components/ui/VerticalPage';

export const metadata: Metadata = { title: 'Financial Services' };

export default function FinancialServicesPage() {
  return (
    <VerticalPage
      title="Financial Services"
      subtitle="Compliant advisor marketing, branch-level attribution, and audit-ready campaign management."
      marketStats={[
        '98,000 locations (76,000 bank branches + 22,000 credit union offices)',
        'Excludes approximately 135K-145K insurance agencies — significant TAM upside beyond the core market',
        '9-18 month sales cycles; compliance is the gating factor for every buying decision in this vertical',
        'Key stat: 98,000+ locations in a compliance-first market',
      ]}
      painHeading="What financial services marketers struggle with"
      painPoints={[
        'Strict compliance requirements (FINRA, SEC, GLBA) slow campaigns and create fragmented review loops that kill momentum',
        'Branches and advisors either go rogue on marketing or do not market at all — there is no easy middle ground between inaction and risk',
        'Scaling local advisor marketing while maintaining brand safety and audit readiness is a manual, error-prone process',
        'Cannot connect marketing spend to qualified appointments, proposals, or funded accounts — the outcomes that actually matter',
      ]}
      solutions={[
        {
          title: 'Pre-Approved Creative and Compliance Workflow',
          description:
            'Moves compliance upstream so advisors deploy from approved libraries without individual reviews per piece. The result: fast time-to-market without compliance risk. Advisors get marketing done; compliance teams get peace of mind.',
        },
        {
          title: 'Branch-Level Benchmarking',
          description:
            'Surfaces marketing activity rates, campaign participation, and pipeline attribution by branch, region, and advisor. You can see which branches are actively marketing and which are sitting idle — and what the performance difference looks like.',
        },
        {
          title: 'Full Audit Trail',
          description:
            'Timestamps, approval records, and disclosure versions for every piece of advisor-generated marketing. Audit-ready from day one. When the regulators ask, the documentation is already there.',
        },
      ]}
      proofHeading="Built for compliance"
      proofContent={
        <p>
          Compliance workflow, pre-approved template libraries, and role-based access
          control (RBAC) are built into the Ignition MVP from the ground up. Preferra and
          Janney are in the sales pipeline. The architecture is designed for the regulatory
          requirements that financial services demands — not bolted on after the fact.
        </p>
      }
      terminology={[
        { term: 'Advisor / Financial advisor', definition: 'Not "operator" or "agent" — the individual managing client relationships and marketing' },
        { term: 'Branch', definition: 'Not "location" — a bank or credit union office' },
        { term: 'AUM', definition: 'Assets Under Management — total value of client investments an advisor manages' },
        { term: 'Funded account', definition: 'Not "conversion" — the downstream outcome financial services tracks (a new account with money in it)' },
        { term: 'Compliance review', definition: 'Not just "approval" — the regulatory validation process that every marketing piece must pass' },
      ]}
      roiLinkText="See branch-level ROI Reporting"
      iggyLinkText="See how Iggy tracks advisor marketing performance"
    />
  );
}
