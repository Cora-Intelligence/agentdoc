// ---------------------------------------------------------------------------
// Block: divider
// Horizontal line separator.
// ---------------------------------------------------------------------------

import type { DividerBlock } from '../types';

export function renderDivider(_block: DividerBlock): string {
  return `<hr class="block block-divider" />`;
}
