/**
 * Ironmark brand tokens and shared styling constants.
 *
 * Single source of truth for colors, fonts, and prose classes
 * used across Ignition Insider.
 */

export const BRAND = {
  colors: {
    red: '#E9472F',
    cyan: '#38C6F4',
    gray: '#707070',
    offWhite: '#f4f2f2',
    darkText: '#1a1a1a',
    lightText: '#4a4a4a',
    border: '#e5e5e5',
    white: '#ffffff',
  },
  fonts: {
    body: 'var(--font-raleway)',
    heading: 'var(--font-bebas-neue)',
    serif: 'var(--font-lora)',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
} as const;

/**
 * Tailwind prose classes for markdown content rendering.
 * Mirrors the PM app's PREMIUM_PROSE_CLASSES pattern but
 * adapted for the KB's Ironmark brand.
 */
export const PROSE_CLASSES = [
  // Base prose
  'prose prose-lg max-w-none',

  // Headings — dark text, Bebas Neue via CSS var
  'prose-headings:text-[#1a1a1a] prose-headings:font-bold prose-headings:tracking-tight',

  // Body text
  'prose-p:text-[#4a4a4a] prose-p:leading-relaxed',

  // Links — cyan with underline
  'prose-a:text-[#38C6F4] prose-a:underline prose-a:decoration-[#38C6F4]/30',
  'hover:prose-a:decoration-[#38C6F4]',

  // Strong/emphasis
  'prose-strong:text-[#1a1a1a] prose-strong:font-semibold',

  // Lists
  'prose-li:text-[#4a4a4a]',
  'prose-ul:list-disc prose-ol:list-decimal',

  // Blockquotes — left border in cyan
  'prose-blockquote:border-l-[#38C6F4] prose-blockquote:text-[#707070]',
  'prose-blockquote:not-italic',

  // Code — monospace on gray background
  'prose-code:text-[#1a1a1a] prose-code:bg-[#f4f2f2] prose-code:rounded prose-code:px-1.5 prose-code:py-0.5',
  'prose-code:before:content-none prose-code:after:content-none',

  // Pre blocks (code blocks)
  'prose-pre:bg-[#1a1a1a] prose-pre:text-[#e5e5e5] prose-pre:rounded-lg',

  // Tables
  'prose-th:text-left prose-th:text-[#1a1a1a] prose-th:font-semibold',
  'prose-td:text-[#4a4a4a]',

  // Horizontal rules
  'prose-hr:border-[#e5e5e5]',

  // Images
  'prose-img:rounded-lg',
].join(' ');

/**
 * Category icon mapping.
 * Maps category keys to lucide-react icon names.
 */
export const CATEGORY_ICONS: Record<string, string> = {
  strategy: 'Target',
  roadmap: 'Map',
  capabilities: 'Layers',
  architecture: 'Network',
  operations: 'Settings',
  research: 'Search',
  communications: 'MessageSquare',
  departments: 'Users',
};
