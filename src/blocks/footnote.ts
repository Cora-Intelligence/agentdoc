// ---------------------------------------------------------------------------
// Block: footnote
// Small gray text at the bottom of content.
// ---------------------------------------------------------------------------

import type { FootnoteBlock } from '../types';

export function renderFootnote(block: FootnoteBlock): string {
  return `
    <div class="block block-footnote">
      <p class="footnote-text">${escapeHtml(block.text)}</p>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
