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
      { label: 'ROI-Based Reporting', path: '/capabilities/roi-reporting', status: 'live' },
      { label: 'Iggy AI Insights Agent', path: '/capabilities/iggy-ai', status: 'live' },
      { label: 'Dynamic AI Creative', path: '/capabilities/dynamic-ai-creative', status: 'phase2' },
      { label: 'Customer Data Platform', path: '/capabilities/cdp', status: 'phase2' },
      { label: 'Omni-Channel Campaigns', path: '/capabilities/campaign-management', status: 'phase2' },
      { label: 'Marketing Hub', path: '/capabilities/marketing-hub', status: 'phase3' },
      { label: 'Full-Funnel Automation', path: '/capabilities/full-funnel-automation', status: 'phase3' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Demo Guide', path: '/demo-guide' },
      { label: 'Competitive Positioning', path: '/resources/competitive' },
      { label: 'Glossary', path: '/resources/glossary' },
      { label: 'Help Guides', path: '/resources/help-guides' },
    ],
  },
];
