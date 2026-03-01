// ---------------------------------------------------------------------------
// agentdoc – HTML Renderer
// Assembles a full HTML document from blocks, theme CSS, and brand config.
// This HTML is then passed to the PDF engine for rendering.
// ---------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import type { AgentDocOptions, BrandConfig, ThemeName } from './types';
import { renderBlock } from './blocks';

/**
 * Load a theme CSS file from the themes directory.
 */
function loadThemeCSS(theme: ThemeName): string {
  const themePath = path.join(__dirname, '..', 'src', 'themes', `${theme}.css`);
  const fallbackPath = path.join(__dirname, 'themes', `${theme}.css`);

  // Try source path first (development), then dist-relative path
  if (fs.existsSync(themePath)) {
    return fs.readFileSync(themePath, 'utf-8');
  }
  if (fs.existsSync(fallbackPath)) {
    return fs.readFileSync(fallbackPath, 'utf-8');
  }

  throw new Error(`agentdoc: theme "${theme}" not found`);
}

/**
 * Generate CSS custom property overrides from brand config.
 * Uses color-mix() for reliable light/dark variants in modern Chromium.
 */
function buildBrandCSS(brand?: BrandConfig): string {
  if (!brand) return '';

  const overrides: string[] = [];

  if (brand.primaryColor) {
    const c = brand.primaryColor;
    overrides.push(`--primary-color: ${c};`);
    overrides.push(`--primary-light: color-mix(in srgb, ${c} 20%, white);`);
    overrides.push(`--primary-ultra-light: color-mix(in srgb, ${c} 8%, white);`);
    overrides.push(`--primary-dark: color-mix(in srgb, ${c}, #1e293b 30%);`);
    overrides.push(`--primary-gradient: linear-gradient(135deg, ${c}, color-mix(in srgb, ${c}, #1e293b 30%));`);
  }
  if (brand.secondaryColor) {
    overrides.push(`--secondary-color: ${brand.secondaryColor};`);
  }
  if (brand.font) {
    overrides.push(`--font-family: '${brand.font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;`);
  }

  if (overrides.length === 0) return '';

  return `:root { ${overrides.join(' ')} }`;
}

/**
 * Build <link> tags for Google Fonts (more reliable than @import in headless Chromium).
 * Always loads Inter as the base font; loads custom brand font additionally.
 */
function buildFontLinks(brand?: BrandConfig): string {
  const links: string[] = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">',
  ];

  if (brand?.font && brand.font !== 'Inter') {
    const fontName = encodeURIComponent(brand.font);
    links.push(
      `<link href="https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700;800&display=swap" rel="stylesheet">`
    );
  }

  return links.join('\n  ');
}

/**
 * Render all blocks into a complete HTML document string.
 */
export function renderToHtml(options: AgentDocOptions): string {
  const theme = options.theme ?? 'clean';

  const themeCSS = loadThemeCSS(theme);
  const brandCSS = buildBrandCSS(options.brand);
  const fontLinks = buildFontLinks(options.brand);

  // Render each block to HTML
  const blocksHtml = options.blocks
    .map((block) => renderBlock(block))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${fontLinks}
  <style>
${themeCSS}
${brandCSS}
  </style>
</head>
<body>
  <div class="document">
${blocksHtml}
  </div>
</body>
</html>`;
}
