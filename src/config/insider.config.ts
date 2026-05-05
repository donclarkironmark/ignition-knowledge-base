// ── Ignition Insider: Types, interfaces, and config constants ──

// ── Enums ─────────────────────────────────────────────────────

export type InsiderCategory = 'competitor' | 'category' | 'customer' | 'martech';

export type PostStatus = 'draft' | 'review' | 'published' | 'archived';

export type EditionStatus = 'draft' | 'published';

export type EditionSection = 'top_signal' | 'competitor' | 'category' | 'customer' | 'martech' | 'radar';

export type TagType = 'signal' | 'capability' | 'vertical' | 'technology' | 'source-confidence' | 'competitor';

// ── Data models ───────────────────────────────────────────────

export interface InsiderTag {
  id: string;
  name: string;
  tag_type: TagType;
}

export interface InsiderPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: InsiderCategory;
  relevance_score: number;
  source_url: string;
  source_name: string;
  source_date: string;
  ironmark_dimensions: string[];
  competitors_mentioned: string[];
  customers_mentioned: string[];
  verticals: string[];
  status: PostStatus;
  is_pinned: boolean;
  admin_commentary: string | null;
  review_notes: string | null;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  tags?: InsiderTag[];
}

export interface InsiderEdition {
  id: string;
  edition_number: number;
  edition_type: 'weekly' | 'quarterly' | 'annual';
  week_start: string;
  week_end: string;
  title: string | null;
  executive_summary: string | null;
  data_point_of_week: string | null;
  coming_up: string | null;
  status: EditionStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  posts?: InsiderEditionPost[];
}

export interface InsiderEditionPost {
  edition_id: string;
  post_id: string;
  section: EditionSection;
  display_order: number;
  post?: InsiderPost;
}

export interface InsiderSubscription {
  id: string;
  email: string;
  categories: InsiderCategory[];
  token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── API request/response shapes ───────────────────────────────

export interface CreatePostRequest {
  title: string;
  summary: string;
  body: string;
  category: InsiderCategory;
  relevance_score: number;
  source_url: string;
  source_name: string;
  source_date: string;
  tags: string[];
  ironmark_dimensions?: string[];
  competitors_mentioned?: string[];
  customers_mentioned?: string[];
  verticals?: string[];
  admin_commentary?: string;
}

export interface UpdatePostRequest {
  title?: string;
  summary?: string;
  body?: string;
  category?: InsiderCategory;
  relevance_score?: number;
  source_url?: string;
  source_name?: string;
  source_date?: string;
  tags?: string[];
  ironmark_dimensions?: string[];
  competitors_mentioned?: string[];
  customers_mentioned?: string[];
  verticals?: string[];
  status?: PostStatus;
  is_pinned?: boolean;
  admin_commentary?: string;
  review_notes?: string;
}

export interface PostListResponse {
  posts: InsiderPost[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SubscribeRequest {
  email: string;
  categories: InsiderCategory[];
}

export interface CreateEditionRequest {
  week_start: string;
  week_end: string;
  title?: string;
  executive_summary?: string;
  data_point_of_week?: string;
  coming_up?: string;
  posts: { post_id: string; section: EditionSection; display_order: number }[];
}

export interface UpdateEditionRequest {
  title?: string;
  executive_summary?: string;
  data_point_of_week?: string;
  coming_up?: string;
  status?: EditionStatus;
  posts?: { post_id: string; section: EditionSection; display_order: number }[];
}

// ── Config constants ──────────────────────────────────────────

export const INSIDER_CATEGORIES: { value: InsiderCategory; label: string; color: string }[] = [
  { value: 'competitor', label: 'Competitor Watch', color: '#E9472F' },
  { value: 'category', label: 'Category & Market', color: '#38C6F4' },
  { value: 'customer', label: 'Customer & Prospect Intel', color: '#10B981' },
  { value: 'martech', label: 'MarTech Radar', color: '#8B5CF6' },
];

export const VALID_CATEGORIES: InsiderCategory[] = ['competitor', 'category', 'customer', 'martech'];

export const VALID_STATUS_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  draft: ['review', 'published'],
  review: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
};

export const VALID_EDITION_SECTIONS: EditionSection[] = [
  'top_signal', 'competitor', 'category', 'customer', 'martech', 'radar',
];

export const AUTO_PUBLISH_MIN_RELEVANCE = 7;

export const MAX_PINNED_POSTS = 3;

export const POSTS_PER_PAGE = 10;

export const FLAG_KEYWORDS = ['unverified', 'estimated', 'paywalled'];

export const MAX_STALE_SOURCE_DAYS = 30;

export function getCategoryLabel(category: InsiderCategory): string {
  return INSIDER_CATEGORIES.find(c => c.value === category)?.label ?? category;
}

export function getCategoryColor(category: InsiderCategory): string {
  return INSIDER_CATEGORIES.find(c => c.value === category)?.color ?? '#707070';
}
