// ---------------------------------------------------------------------------
// agentdoc – Input validation
// Zod schemas for every block type. Provides clear error messages when an
// AI agent passes malformed data.
// ---------------------------------------------------------------------------

import { z } from 'zod';
import type { Block, AgentDocOptions } from './types';

// ── Content block schemas ───────────────────────────────────────────────────

const coverSchema = z.object({
  type: z.literal('cover'),
  title: z.string().min(1, 'cover.title is required'),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  logo: z.string().optional(),
});

const sectionSchema = z.object({
  type: z.literal('section'),
  title: z.string().min(1, 'section.title is required'),
  content: z.string().min(1, 'section.content is required'),
});

const paragraphSchema = z.object({
  type: z.literal('paragraph'),
  content: z.string().min(1, 'paragraph.content is required'),
});

const calloutSchema = z.object({
  type: z.literal('callout'),
  style: z.enum(['info', 'warning', 'success', 'error']),
  title: z.string().optional(),
  content: z.string().optional(),
  items: z.array(z.string()).optional(),
});

const quoteSchema = z.object({
  type: z.literal('quote'),
  text: z.string().min(1, 'quote.text is required'),
  attribution: z.string().optional(),
});

// ── Data block schemas ──────────────────────────────────────────────────────

const metricItemSchema = z.object({
  label: z.string().min(1, 'metric item label is required'),
  value: z.string().min(1, 'metric item value is required'),
  unit: z.string().optional(),
  trend: z.enum(['up', 'down', 'neutral']).optional(),
});

const metricsSchema = z.object({
  type: z.literal('metrics'),
  items: z.array(metricItemSchema).min(1, 'metrics.items must have at least one item'),
});

const tableSchema = z.object({
  type: z.literal('table'),
  title: z.string().optional(),
  columns: z.array(z.string()).min(1, 'table.columns must have at least one column'),
  rows: z.array(z.array(z.string())),
  highlightFirst: z.boolean().optional(),
});

// ── Narrative block schemas ─────────────────────────────────────────────────

const timelineEventSchema = z.object({
  date: z.string().min(1, 'timeline event date is required'),
  icon: z.enum([
    'search', 'mail', 'phone', 'calendar',
    'check', 'alert', 'user', 'document', 'star',
  ]).optional(),
  text: z.string().min(1, 'timeline event text is required'),
  detail: z.string().optional(),
});

const timelineSchema = z.object({
  type: z.literal('timeline'),
  title: z.string().optional(),
  events: z.array(timelineEventSchema).min(1, 'timeline.events must have at least one event'),
});

// ── Layout block schemas ────────────────────────────────────────────────────

const dividerSchema = z.object({
  type: z.literal('divider'),
});

const spacerSchema = z.object({
  type: z.literal('spacer'),
  size: z.enum(['sm', 'md', 'lg']).optional(),
});

const pageBreakSchema = z.object({
  type: z.literal('page-break'),
});

// ── Utility block schemas ───────────────────────────────────────────────────

const footnoteSchema = z.object({
  type: z.literal('footnote'),
  text: z.string().min(1, 'footnote.text is required'),
});

// ── Combined block schema (discriminated union on `type`) ───────────────────

const blockSchema = z.discriminatedUnion('type', [
  coverSchema,
  sectionSchema,
  paragraphSchema,
  calloutSchema,
  quoteSchema,
  metricsSchema,
  tableSchema,
  timelineSchema,
  dividerSchema,
  spacerSchema,
  pageBreakSchema,
  footnoteSchema,
]);

// ── Top-level options schema ────────────────────────────────────────────────

const optionsSchema = z.object({
  theme: z.enum(['clean', 'modern-dark', 'corporate', 'minimal', 'bold']).optional(),
  brand: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    font: z.string().optional(),
    logo: z.string().optional(),
    companyName: z.string().optional(),
  }).optional(),
  pageSize: z.enum(['a4', 'letter']).optional(),
  blocks: z.array(blockSchema).min(1, 'At least one block is required'),
});

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Validate the full createPdf options object.
 * Throws a readable error if validation fails.
 */
export function validateOptions(input: unknown): AgentDocOptions {
  const result = optionsSchema.safeParse(input);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    throw new Error(`agentdoc validation error:\n${messages.join('\n')}`);
  }

  return result.data as AgentDocOptions;
}

/**
 * Validate a single block.
 * Useful for testing individual blocks in isolation.
 */
export function validateBlock(input: unknown): Block {
  const result = blockSchema.safeParse(input);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    throw new Error(`agentdoc block validation error:\n${messages.join('\n')}`);
  }

  return result.data as Block;
}
