export type NavStatus = 'live' | 'phase2' | 'phase3';

export interface NavItem {
  label: string;
  path: string;
  status?: NavStatus;
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    heading: 'Intel & Insights',
    items: [
      { label: 'Feed', path: '/insider' },
      { label: 'Editions', path: '/insider/editions' },
      { label: 'Admin', path: '/insider/admin' },
    ],
  },
  {
    heading: 'Capabilities',
    items: [
      { label: 'ROI-Based Reporting', path: '/capabilities/roi-reporting', status: 'live' },
      { label: 'Iggy AI Insights Agent', path: '/capabilities/iggy-ai', status: 'live' },
      { label: 'Campaign Management', path: '/capabilities/campaign-management', status: 'phase2' },
      { label: 'Dynamic AI Creative', path: '/capabilities/dynamic-ai-creative', status: 'phase2' },
      { label: 'CDP & Audience Builder', path: '/capabilities/cdp', status: 'phase2' },
      { label: 'Distributed Marketing/DAM', path: '/capabilities/marketing-hub', status: 'phase3' },
      { label: 'Full-funnel & Automation', path: '/capabilities/full-funnel-automation', status: 'phase3' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Demo Guide', path: '/demo-guide' },
      { label: 'Glossary', path: '/resources/glossary' },
      { label: 'Help Guides', path: '/resources/help-guides' },
    ],
  },
];
