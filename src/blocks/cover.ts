// ---------------------------------------------------------------------------
// Block: cover
// Full-page title page with large title, subtitle, date, optional logo,
// accent bar, decorative divider, and brand badge.
// ---------------------------------------------------------------------------

import type { CoverBlock } from '../types';

export function renderCover(block: CoverBlock): string {
  const logo = block.logo
    ? `<img class="cover-logo" src="${escapeAttr(block.logo)}" alt="Logo" />`
    : '';

  const subtitle = block.subtitle
    ? `<p class="cover-subtitle">${escapeHtml(block.subtitle)}</p>`
    : '';

  const date = block.date
    ? `<p class="cover-date">${escapeHtml(block.date)}</p>`
    : '';

  return `
    <div class="block block-cover">
      <div class="cover-accent-bar"></div>
      <div class="cover-inner">
        ${logo}
        <h1 class="cover-title">${escapeHtml(block.title)}</h1>
        <div class="cover-divider"></div>
        ${subtitle}
        ${date}
      </div>
      <div class="cover-footer-line"></div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, '&quot;');
}
