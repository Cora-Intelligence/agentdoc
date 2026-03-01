// ---------------------------------------------------------------------------
// agentdoc – Type definitions
// Every block the agent can use is defined here as a TypeScript interface.
// The discriminated union `Block` is what the public API accepts.
// ---------------------------------------------------------------------------

// ── Brand configuration ─────────────────────────────────────────────────────

export interface BrandConfig {
  primaryColor?: string;
  secondaryColor?: string;
  /** Google Font name – auto-loaded at render time */
  font?: string;
  /** File path or URL to a logo image */
  logo?: string;
  companyName?: string;
}

// ── Theme names ─────────────────────────────────────────────────────────────

export type ThemeName = 'clean' | 'modern-dark' | 'corporate' | 'minimal' | 'bold';

// ── Page size ───────────────────────────────────────────────────────────────

export type PageSize = 'a4' | 'letter';

// ── Top-level options passed to createPdf() ─────────────────────────────────

export interface AgentDocOptions {
  theme?: ThemeName;
  brand?: BrandConfig;
  pageSize?: PageSize;
  blocks: Block[];
}

// ── Content blocks ──────────────────────────────────────────────────────────

export interface CoverBlock {
  type: 'cover';
  title: string;
  subtitle?: string;
  date?: string;
  logo?: string;
}

export interface SectionBlock {
  type: 'section';
  title: string;
  /** Supports basic markdown: bold, italic, links, line breaks */
  content: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  /** Supports basic markdown */
  content: string;
}

export interface CalloutBlock {
  type: 'callout';
  style: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  content?: string;
  /** Rendered as a bullet list */
  items?: string[];
}

export interface QuoteBlock {
  type: 'quote';
  text: string;
  attribution?: string;
}

// ── Data blocks ─────────────────────────────────────────────────────────────

export interface MetricItem {
  label: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface MetricsBlock {
  type: 'metrics';
  items: MetricItem[];
}

export interface TableBlock {
  type: 'table';
  title?: string;
  columns: string[];
  rows: string[][];
  /** Bold the first column for emphasis */
  highlightFirst?: boolean;
}

// ── Narrative blocks ────────────────────────────────────────────────────────

export type TimelineIcon =
  | 'search'
  | 'mail'
  | 'phone'
  | 'calendar'
  | 'check'
  | 'alert'
  | 'user'
  | 'document'
  | 'star';

export interface TimelineEvent {
  date: string;
  icon?: TimelineIcon;
  text: string;
  detail?: string;
}

export interface TimelineBlock {
  type: 'timeline';
  title?: string;
  events: TimelineEvent[];
}

// ── Layout blocks ───────────────────────────────────────────────────────────

export interface DividerBlock {
  type: 'divider';
}

export interface SpacerBlock {
  type: 'spacer';
  size?: 'sm' | 'md' | 'lg';
}

export interface PageBreakBlock {
  type: 'page-break';
}

// ── Utility blocks ──────────────────────────────────────────────────────────

export interface FootnoteBlock {
  type: 'footnote';
  text: string;
}

// ── Block union ─────────────────────────────────────────────────────────────
// Phase 1 blocks. Phase 2 will extend this union with additional types.

export type Block =
  | CoverBlock
  | SectionBlock
  | ParagraphBlock
  | CalloutBlock
  | QuoteBlock
  | MetricsBlock
  | TableBlock
  | TimelineBlock
  | DividerBlock
  | SpacerBlock
  | PageBreakBlock
  | FootnoteBlock;

// ── Block renderer signature ────────────────────────────────────────────────
// Every block renderer file exports a function matching this shape.

export type BlockRenderer<T extends Block = Block> = (block: T) => string;
