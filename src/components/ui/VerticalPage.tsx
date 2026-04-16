import { PageHeader } from './PageHeader';
import { SectionHeading } from './SectionHeading';
import { InternalLink } from './InternalLink';

interface TermEntry {
  term: string;
  definition: string;
}

interface SolutionEntry {
  title: string;
  description: string;
}

interface VerticalPageProps {
  title: string;
  subtitle: string;
  /** Market context section heading */
  marketHeading?: string;
  marketStats: string[];
  painHeading?: string;
  painPoints: string[];
  solutionHeading?: string;
  solutions: SolutionEntry[];
  proofHeading: string;
  proofContent: React.ReactNode;
  terminology: TermEntry[];
  /** Vertical-specific capability link text */
  roiLinkText: string;
  iggyLinkText: string;
}

export function VerticalPage({
  title,
  subtitle,
  marketHeading = 'The opportunity',
  marketStats,
  painHeading = `What ${title.toLowerCase().includes('franchise') ? 'franchise' : title.toLowerCase().split(' ')[0]} marketers struggle with`,
  painPoints,
  solutionHeading = 'How Ignition solves it',
  solutions,
  proofHeading,
  proofContent,
  terminology,
  roiLinkText,
  iggyLinkText,
}: VerticalPageProps) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      {/* Market Context */}
      <SectionHeading>{marketHeading}</SectionHeading>
      <ul className="space-y-2 mb-6 text-sm text-brand-gray">
        {marketStats.map((stat) => (
          <li key={stat} className="flex gap-2">
            <span className="text-brand-cyan font-bold shrink-0">&#8226;</span>
            <span>{stat}</span>
          </li>
        ))}
      </ul>

      {/* Pain Points */}
      <SectionHeading>{painHeading}</SectionHeading>
      <ul className="space-y-2 mb-6 text-sm text-brand-gray">
        {painPoints.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="text-brand-red font-bold shrink-0">&#8226;</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* How Ignition Helps */}
      <SectionHeading>{solutionHeading}</SectionHeading>
      <div className="space-y-4 mb-8">
        {solutions.map((s) => (
          <div key={s.title} className="rounded-lg border border-brand-border bg-white p-5">
            <h3 className="text-base font-semibold text-foreground mb-1">{s.title}</h3>
            <p className="text-sm text-brand-gray leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Proof Point */}
      <SectionHeading>{proofHeading}</SectionHeading>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 mb-8">
        <div className="text-sm text-emerald-700">{proofContent}</div>
      </div>

      {/* Terminology Guide */}
      <SectionHeading>Terminology guide</SectionHeading>
      <p className="text-sm text-brand-gray mb-3">
        Use these terms when speaking with customers in this vertical.
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2 pr-4 font-semibold text-foreground">Use this</th>
              <th className="text-left py-2 font-semibold text-foreground">Instead of / Meaning</th>
            </tr>
          </thead>
          <tbody className="text-brand-gray">
            {terminology.map((t) => (
              <tr key={t.term} className="border-b border-brand-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">{t.term}</td>
                <td className="py-2">{t.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-brand-border">
        <InternalLink href="/capabilities/roi-reporting">{roiLinkText}</InternalLink>
        <InternalLink href="/capabilities/iggy-ai">{iggyLinkText}</InternalLink>
        <InternalLink href="/verticals">See all industries</InternalLink>
      </div>
    </>
  );
}
