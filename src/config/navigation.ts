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
      { label: 'Feed', path: '/insider', status: 'live' },
      { label: 'Editions', path: '/insider/editions', status: 'live' },
      { label: 'Admin', path: '/insider/admin' },
    ],
  },
  {
    heading: 'Capabilities',
    items: [
      { label: 'Overview', path: '/capabilities' },
      { label: 'ROI-Based Reporting', path: '/capabilities/roi-reporting', status: 'live' },
      { label: 'Iggy AI Insights Agent', path: '/capabilities/iggy-ai', status: 'live' },
      { label: 'Competitive Positioning', path: '/capabilities/competitive' },
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
