import type { Metadata } from 'next';
import { Book, MonitorPlay, Newspaper } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { QuickLinkCard } from '@/components/ui/QuickLinkCard';

export const metadata: Metadata = { title: 'Help Guides' };

const GUIDES = [
  {
    title: 'Using This Knowledge Base',
    description:
      'How to navigate sections, find content fast, and share links. Covers login, search, and the capability status system.',
    href: '/resources/help-guides/using-this-kb',
    icon: <Book size={22} />,
  },
  {
    title: 'Demo Playbook',
    description:
      'Step-by-step walkthroughs for the demo environment — login, the ROI dashboard, and common talk tracks.',
    href: '/resources/help-guides/demo-playbook',
    icon: <MonitorPlay size={22} />,
  },
  {
    title: 'Insider Admin How-To',
    description:
      'How to create, review, and publish Insider posts; assemble weekly editions; and manage subscribers.',
    href: '/resources/help-guides/insider-admin-how-to',
    icon: <Newspaper size={22} />,
  },
];

export default function HelpGuidesIndex() {
  return (
    <>
      <PageHeader
        title="Help Guides"
        subtitle="Internal playbooks for the Ironmark team — how to use this KB, run demos, and work the Insider workflow. Step-by-step Tango walkthroughs are embedded inside each guide."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <QuickLinkCard
            key={g.href}
            title={g.title}
            description={g.description}
            href={g.href}
            icon={g.icon}
          />
        ))}
      </div>
    </>
  );
}
