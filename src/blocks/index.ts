// ---------------------------------------------------------------------------
// Block registry
// Maps each block type string to its render function.
// This is the single place where new block types are registered.
// ---------------------------------------------------------------------------

import type { Block } from '../types';

import { renderCover } from './cover';
import { renderSection } from './section';
import { renderParagraph } from './paragraph';
import { renderCallout } from './callout';
import { renderQuote } from './quote';
import { renderMetrics } from './metrics';
import { renderTable } from './table';
import { renderTimeline } from './timeline';
import { renderDivider } from './divider';
import { renderSpacer } from './spacer';
import { renderPageBreak } from './page-break';
import { renderFootnote } from './footnote';

// Explicit map — no magic, easy to read and extend.
const renderers: Record<string, (block: any) => string> = {
  'cover': renderCover,
  'section': renderSection,
  'paragraph': renderParagraph,
  'callout': renderCallout,
  'quote': renderQuote,
  'metrics': renderMetrics,
  'table': renderTable,
  'timeline': renderTimeline,
  'divider': renderDivider,
  'spacer': renderSpacer,
  'page-break': renderPageBreak,
  'footnote': renderFootnote,
};

/**
 * Render a single block to an HTML string.
 * Throws if the block type is not registered.
 */
export function renderBlock(block: Block): string {
  const renderer = renderers[block.type];

  if (!renderer) {
    throw new Error(`agentdoc: unknown block type "${block.type}"`);
  }

  return renderer(block);
}
