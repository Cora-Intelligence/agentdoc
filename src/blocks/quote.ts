// ---------------------------------------------------------------------------
// Block: quote
// Pull quote with optional attribution. Large decorative quotation mark SVG.
// ---------------------------------------------------------------------------

import type { QuoteBlock } from '../types';
import { icon } from '../icons';

export function renderQuote(block: QuoteBlock): string {
  const quoteMarkSvg = icon('quote-mark');

  const attribution = block.attribution
    ? `<cite class="quote-attribution">— ${escapeHtml(block.attribution)}</cite>`
    : '';

  return `
    <div class="block block-quote">
      <div class="quote-mark">${quoteMarkSvg}</div>
      <blockquote class="quote-text">${escapeHtml(block.text)}</blockquote>
      ${attribution}
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
