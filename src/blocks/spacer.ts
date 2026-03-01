// ---------------------------------------------------------------------------
// Block: spacer
// Vertical whitespace. Sizes: sm (16px), md (32px), lg (64px).
// ---------------------------------------------------------------------------

import type { SpacerBlock } from '../types';

export function renderSpacer(block: SpacerBlock): string {
  const size = block.size ?? 'md';
  return `<div class="block block-spacer spacer-${size}"></div>`;
}
