// ---------------------------------------------------------------------------
// Block: page-break
// Forces a new page in the PDF output.
// ---------------------------------------------------------------------------

import type { PageBreakBlock } from '../types';

export function renderPageBreak(_block: PageBreakBlock): string {
  return `<div class="block block-page-break"></div>`;
}
