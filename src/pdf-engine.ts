// ---------------------------------------------------------------------------
// agentdoc – PDF Engine
// Manages a Puppeteer browser instance and converts HTML to PDF buffers.
// The browser is reused across calls for performance.
// ---------------------------------------------------------------------------

import puppeteer, { type Browser } from 'puppeteer';
import type { PageSize } from './types';

// Singleton browser instance — reused across calls
let browser: Browser | null = null;

/**
 * Get or create the shared Puppeteer browser instance.
 */
async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.connected) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  }
  return browser;
}

// Page dimensions in CSS pixels (96 DPI)
const PAGE_SIZES: Record<PageSize, { width: string; height: string }> = {
  a4: { width: '210mm', height: '297mm' },
  letter: { width: '8.5in', height: '11in' },
};

/**
 * Render an HTML string to a PDF buffer.
 */
export async function generatePdf(
  html: string,
  pageSize: PageSize = 'a4'
): Promise<Buffer> {
  const instance = await getBrowser();
  const page = await instance.newPage();

  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for all fonts to finish loading before rendering
    await page.evaluateHandle('document.fonts.ready');

    const size = PAGE_SIZES[pageSize];

    const pdf = await page.pdf({
      width: size.width,
      height: size.height,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      printBackground: true,
      preferCSSPageSize: false,
    });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

/**
 * Close the shared browser instance.
 * Call this when your application shuts down.
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
