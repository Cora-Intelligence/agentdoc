// ---------------------------------------------------------------------------
// agentdoc – Main entry point
// Beautiful PDFs from AI agents. Block-based. Zero design required.
//
// Usage:
//   import { createPdf } from 'agentdoc';
//   const pdf = await createPdf({ theme: 'clean', blocks: [...] });
// ---------------------------------------------------------------------------

import type { AgentDocOptions } from './types';
import { validateOptions } from './validator';
import { renderToHtml } from './renderer';
import { generatePdf, closeBrowser } from './pdf-engine';

/**
 * Generate a PDF document from an array of blocks.
 *
 * @param options - Theme, brand config, page size, and blocks to render
 * @returns A Buffer containing the PDF binary data
 *
 * @example
 * ```typescript
 * const pdf = await createPdf({
 *   theme: 'clean',
 *   blocks: [
 *     { type: 'cover', title: 'My Report', subtitle: 'Q1 2026' },
 *     { type: 'section', title: 'Summary', content: 'This quarter was strong.' },
 *   ]
 * });
 * fs.writeFileSync('report.pdf', pdf);
 * ```
 */
export async function createPdf(options: AgentDocOptions): Promise<Buffer> {
  // 1. Validate input — clear errors if the agent passes bad data
  const validated = validateOptions(options);

  // 2. Render blocks to a complete HTML document
  const html = renderToHtml(validated);

  // 3. Convert HTML to PDF via Puppeteer
  const pdf = await generatePdf(html, validated.pageSize);

  return pdf;
}

// Re-export types for consumers
export type {
  AgentDocOptions,
  BrandConfig,
  ThemeName,
  PageSize,
  Block,
  CoverBlock,
  SectionBlock,
  ParagraphBlock,
  CalloutBlock,
  QuoteBlock,
  MetricsBlock,
  MetricItem,
  TableBlock,
  TimelineBlock,
  TimelineEvent,
  TimelineIcon,
  DividerBlock,
  SpacerBlock,
  PageBreakBlock,
  FootnoteBlock,
} from './types';

// Re-export utilities for advanced usage
export { renderToHtml } from './renderer';
export { closeBrowser } from './pdf-engine';
export { validateOptions, validateBlock } from './validator';
