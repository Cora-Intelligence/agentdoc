// ---------------------------------------------------------------------------
// Block: callout
// Highlighted box with colored left border. Supports info/warning/success/error
// styles, an optional title, content text, or a bullet list of items.
// Uses inline SVG icons for reliable rendering.
// ---------------------------------------------------------------------------

import type { CalloutBlock } from '../types';
import { renderMarkdown } from '../markdown';
import { icon } from '../icons';

const STYLE_ICON_NAMES: Record<CalloutBlock['style'], string> = {
  info: 'info',
  warning: 'alert',
  success: 'check',
  error: 'error',
};

export function renderCallout(block: CalloutBlock): string {
  const iconSvg = icon(STYLE_ICON_NAMES[block.style]);

  const title = block.title
    ? `<div class="callout-header">
        <span class="callout-icon-circle">${iconSvg}</span>
        <div class="callout-title">${escapeHtml(block.title)}</div>
      </div>`
    : '';

  let body = '';
  if (block.items && block.items.length > 0) {
    const listItems = block.items
      .map((item) => `<li>${renderMarkdown(item)}</li>`)
      .join('\n');
    body = `<ul class="callout-items">${listItems}</ul>`;
  } else if (block.content) {
    body = `<div class="callout-content">${renderMarkdown(block.content)}</div>`;
  }

  const bodyWrapper = body
    ? `<div class="callout-body">${body}</div>`
    : '';

  return `
    <div class="block block-callout callout-${block.style}">
      ${title}
      ${bodyWrapper}
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
