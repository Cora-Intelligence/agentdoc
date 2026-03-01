#!/usr/bin/env node
// ---------------------------------------------------------------------------
// agentdoc – CLI
// Generate PDFs from JSON files on the command line.
//
// Usage:
//   npx agentdoc generate --input blocks.json --output report.pdf
//   npx agentdoc generate -i blocks.json -o report.pdf --theme clean
// ---------------------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import { createPdf } from './index';
import { closeBrowser } from './pdf-engine';

const HELP = `
agentdoc — Beautiful PDFs from AI agents.

Usage:
  agentdoc generate --input <file> [--output <file>] [--theme <name>]

Options:
  -i, --input   Path to JSON file with agentdoc options (required)
  -o, --output  Path for the output PDF (default: output.pdf)
  -t, --theme   Theme name: clean, modern-dark, corporate, minimal, bold
  -h, --help    Show this help message

Examples:
  agentdoc generate --input briefing.json --output briefing.pdf
  agentdoc generate -i report.json -o report.pdf --theme corporate
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    console.log(HELP);
    process.exit(0);
  }

  const command = args[0];

  if (command !== 'generate') {
    console.error(`Unknown command: ${command}\nRun "agentdoc --help" for usage.`);
    process.exit(1);
  }

  // Parse flags
  const inputPath = getFlag(args, '-i', '--input');
  const outputPath = getFlag(args, '-o', '--output') ?? 'output.pdf';
  const theme = getFlag(args, '-t', '--theme');

  if (!inputPath) {
    console.error('Error: --input is required.\nRun "agentdoc --help" for usage.');
    process.exit(1);
  }

  // Read and parse JSON
  const absoluteInput = path.resolve(inputPath);
  if (!fs.existsSync(absoluteInput)) {
    console.error(`Error: file not found: ${absoluteInput}`);
    process.exit(1);
  }

  let options: any;
  try {
    const raw = fs.readFileSync(absoluteInput, 'utf-8');
    options = JSON.parse(raw);
  } catch (err: any) {
    console.error(`Error: invalid JSON in ${inputPath}: ${err.message}`);
    process.exit(1);
  }

  // Apply CLI theme override
  if (theme) {
    options.theme = theme;
  }

  // Generate PDF
  try {
    console.log(`Generating PDF...`);
    const pdf = await createPdf(options);

    const absoluteOutput = path.resolve(outputPath);
    fs.writeFileSync(absoluteOutput, pdf);
    console.log(`PDF saved to ${absoluteOutput}`);
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  } finally {
    await closeBrowser();
  }
}

/**
 * Extract a flag value from the args array.
 * Supports both -short and --long forms.
 */
function getFlag(args: string[], short: string, long: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === short || args[i] === long) {
      return args[i + 1];
    }
  }
  return undefined;
}

main();
