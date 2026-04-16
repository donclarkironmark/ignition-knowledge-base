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
    heading: 'Platform',
    items: [
      { label: 'What Is Ignition', path: '/platform' },
      { label: 'Why Ignition', path: '/platform/why-ignition' },
    ],
  },
  {
    heading: 'Capabilities',
    items: [
      { label: 'Overview', path: '/capabilities' },
      { label: 'ROI-Based Reporting', path: '/capabilities/roi-reporting', status: 'live' },
      { label: 'Iggy AI Insights Agent', path: '/capabilities/iggy-ai', status: 'live' },
    ],
  },
  {
    heading: 'Industries',
    items: [
      { label: 'Overview', path: '/verticals' },
      { label: 'Healthcare & Chiropractic', path: '/verticals/healthcare' },
      { label: 'Quick Service Restaurants', path: '/verticals/qsr' },
      { label: 'Automotive Dealers', path: '/verticals/automotive' },
      { label: 'Financial Services', path: '/verticals/financial-services' },
      { label: 'Franchise & Multi-Unit', path: '/verticals/franchise' },
    ],
  },
  {
    heading: 'Competitive',
    items: [
      { label: 'Competitive Positioning', path: '/competitive' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Demo Guide', path: '/demo-guide' },
      { label: 'Glossary', path: '/resources/glossary' },
    ],
  },
];
