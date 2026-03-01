// ---------------------------------------------------------------------------
// Block: metrics
// Row of KPI cards with gradient accent, trend badges, deep shadows.
// Smart layout: 1-2 items → full width, 3-4 → row, 5+ → two rows.
// ---------------------------------------------------------------------------

import type { MetricsBlock, MetricItem } from '../types';
import { icon } from '../icons';

const TREND_ICON_NAMES: Record<string, string> = {
  up: 'arrow-up',
  down: 'arrow-down',
  neutral: 'arrow-right',
};

export function renderMetrics(block: MetricsBlock): string {
  const count = block.items.length;

  let columns: number;
  if (count <= 2) columns = count;
  else if (count <= 4) columns = count;
  else columns = Math.ceil(count / 2);

  const cards = block.items.map((item) => renderCard(item)).join('\n');

  return `
    <div class="block block-metrics" style="--metric-columns: ${columns}">
      <div class="metrics-grid">
        ${cards}
      </div>
    </div>
  `;
}

function renderCard(item: MetricItem): string {
  const unit = item.unit
    ? `<span class="metric-unit">${escapeHtml(item.unit)}</span>`
    : '';

  const trend = item.trend
    ? `<span class="metric-trend metric-trend-${item.trend}">${icon(TREND_ICON_NAMES[item.trend])}</span>`
    : '';

  return `
    <div class="metric-card">
      <div class="metric-accent"></div>
      <div class="metric-body">
        <div class="metric-label">${escapeHtml(item.label)}</div>
        <div class="metric-value-row">
          <div class="metric-value">${escapeHtml(item.value)}${unit}</div>
          ${trend}
        </div>
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
