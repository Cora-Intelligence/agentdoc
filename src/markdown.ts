// ---------------------------------------------------------------------------
// agentdoc – Markdown utility
// Thin wrapper around `marked` for rendering inline markdown in block content.
// ---------------------------------------------------------------------------

import { marked } from 'marked';

// Configure marked for safe, inline-friendly output
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Render a markdown string to HTML.
 * Handles bold, italic, links, line breaks, and inline code.
 */
export function renderMarkdown(text: string): string {
  return marked.parse(text) as string;
}

/**
 * Render inline markdown only (no wrapping <p> tags).
 * Use this for single-line fields like titles.
 */
export function renderInlineMarkdown(text: string): string {
  return marked.parseInline(text) as string;
}
