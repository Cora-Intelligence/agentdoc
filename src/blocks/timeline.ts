// ---------------------------------------------------------------------------
// Block: timeline
// Vertical event timeline with SVG icons, gradient connecting line,
// left-accented event cards, date pills. Auto-paginates after 10.
// ---------------------------------------------------------------------------

import type { TimelineBlock, TimelineIcon } from '../types';
import { icon } from '../icons';

export function renderTimeline(block: TimelineBlock): string {
  const title = block.title
    ? `<h3 class="timeline-title">${escapeHtml(block.title)}</h3>`
    : '';

  const events = block.events
    .map((event, index) => {
      const iconSvg = event.icon ? icon(event.icon) : '';
      const marker = iconSvg
        ? `<span class="timeline-icon">${iconSvg}</span>`
        : '<span class="timeline-dot"></span>';

      const detail = event.detail
        ? `<p class="timeline-detail">${escapeHtml(event.detail)}</p>`
        : '';

      const pageBreak = index > 0 && index % 10 === 0
        ? '<div class="timeline-page-break"></div>'
        : '';

      return `
        ${pageBreak}
        <div class="timeline-event">
          <div class="timeline-marker">
            ${marker}
            <div class="timeline-line"></div>
          </div>
          <div class="timeline-body">
            <span class="timeline-date">${escapeHtml(event.date)}</span>
            <div class="timeline-card">
              <p class="timeline-text">${escapeHtml(event.text)}</p>
              ${detail}
            </div>
          </div>
        </div>
      `;
    })
    .join('\n');

  return `
    <div class="block block-timeline">
      ${title}
      <div class="timeline-events">
        ${events}
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
