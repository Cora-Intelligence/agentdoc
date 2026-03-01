// ---------------------------------------------------------------------------
// Block: section
// Text section with a heading. Content supports markdown.
// ---------------------------------------------------------------------------

import type { SectionBlock } from '../types';
import { renderMarkdown } from '../markdown';

export function renderSection(block: SectionBlock): string {
  const content = renderMarkdown(block.content);

  return `
    <div class="block block-section">
      <div class="section-header">
        <div class="section-accent"></div>
        <h2 class="section-title">${escapeHtml(block.title)}</h2>
      </div>
      <div class="section-content">${content}</div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
