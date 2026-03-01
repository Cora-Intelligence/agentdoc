// ---------------------------------------------------------------------------
// Block: table
// Data table with automatic column sizing, optional bold first column,
// rounded container, blue header, and zebra striping.
// ---------------------------------------------------------------------------

import type { TableBlock } from '../types';

export function renderTable(block: TableBlock): string {
  const title = block.title
    ? `<h3 class="table-title">${escapeHtml(block.title)}</h3>`
    : '';

  const headerCells = block.columns
    .map((col) => `<th>${escapeHtml(col)}</th>`)
    .join('');

  const bodyRows = block.rows
    .map((row, rowIndex) => {
      const rowClass = rowIndex % 2 === 0 ? 'table-row-even' : 'table-row-odd';
      const cells = row
        .map((cell, i) => {
          const bold = block.highlightFirst && i === 0;
          const content = escapeHtml(cell);
          return bold
            ? `<td><strong>${content}</strong></td>`
            : `<td>${content}</td>`;
        })
        .join('');
      return `<tr class="${rowClass}">${cells}</tr>`;
    })
    .join('\n');

  return `
    <div class="block block-table">
      ${title}
      <div class="table-container">
        <table>
          <thead>
            <tr>${headerCells}</tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
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
