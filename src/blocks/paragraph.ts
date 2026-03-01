// ---------------------------------------------------------------------------
// Block: paragraph
// Plain text without heading. Content supports markdown.
// ---------------------------------------------------------------------------

import type { ParagraphBlock } from '../types';
import { renderMarkdown } from '../markdown';

export function renderParagraph(block: ParagraphBlock): string {
  const content = renderMarkdown(block.content);

  return `
    <div class="block block-paragraph">
      ${content}
    </div>
  `;
}
