import { createPdf, closeBrowser } from './src/index';
import type { ThemeName, Block } from './src/types';
import * as fs from 'fs';

const themes: ThemeName[] = ['clean', 'modern-dark', 'corporate', 'minimal', 'bold'];

const blocks: Block[] = [
  // ── Cover page ──
  {
    type: 'cover',
    title: 'Q1 2026 Product Review',
    subtitle: 'Clinical AI Platform — Performance, Adoption & Roadmap',
    date: 'January – March 2026',
  },

  // ── Metrics: 4 columns ──
  {
    type: 'metrics',
    items: [
      { label: 'Active Hospitals', value: '47', trend: 'up' },
      { label: 'Scans Processed', value: '1.2M', trend: 'up' },
      { label: 'Avg Accuracy', value: '98.3', unit: '%', trend: 'up' },
      { label: 'Churn Rate', value: '2.1', unit: '%', trend: 'down' },
    ],
  },

  // ── Section with rich markdown ──
  {
    type: 'section',
    title: 'Executive Summary',
    content:
      'Q1 delivered **record growth** across all key metrics. Hospital onboarding accelerated following our **SOC 2 Type II** certification in January, removing the final procurement barrier for large health systems.\n\nNotable wins include a 12-hospital deal with **HCA Healthcare** and expansion into the EU market via a partnership with Charité Berlin. Revenue grew **34% QoQ** to €8.7M ARR.\n\nThe platform processed over **1.2 million diagnostic scans** this quarter with a sustained accuracy rate above 98%, validating our approach to federated model training.',
  },

  // ── Table: many rows ──
  {
    type: 'table',
    title: 'Top Accounts by Revenue',
    columns: ['Customer', 'Region', 'ARR', 'Contract End', 'Health'],
    rows: [
      ['HCA Healthcare', 'US South', '€1.8M', 'Dec 2027', 'Expanding'],
      ['Charité Berlin', 'DACH', '€940K', 'Mar 2028', 'New'],
      ['NHS Cambridge Trust', 'UK', '€720K', 'Sep 2026', 'Stable'],
      ['Mayo Clinic', 'US Midwest', '€680K', 'Jun 2027', 'At Risk'],
      ['Karolinska Institute', 'Nordics', '€510K', 'Nov 2027', 'Stable'],
      ['Cleveland Clinic', 'US East', '€490K', 'Aug 2026', 'Expanding'],
    ],
    highlightFirst: true,
  },

  // ── Info callout with title + items ──
  {
    type: 'callout',
    style: 'info',
    title: 'Key Product Launches',
    items: [
      'v3.2 — **Multi-organ CT analysis** now GA across all tiers',
      'v3.3 — Real-time **DICOM streaming** reduces latency by 60%',
      'v3.4 — New **explainability dashboard** for radiologist review',
      'SDK v2.0 — Public API for third-party integration partners',
    ],
  },

  // ── Warning callout with title + items ──
  {
    type: 'callout',
    style: 'warning',
    title: 'Open Risks',
    items: [
      'Mayo Clinic evaluating competitor (Aidoc) — QBR scheduled April 3',
      'EU AI Act compliance deadline moved to **June 2026** — legal review in progress',
      'GPU supply constraints may delay new region launch by 4–6 weeks',
    ],
  },

  // ── Callout WITHOUT title (tests Bug 5 fix) ──
  {
    type: 'callout',
    style: 'info',
    content: 'All metrics in this report reflect data as of **March 31, 2026**. Pipeline figures are based on CRM snapshots and may differ from final audited numbers.',
  },

  // ── Page break ──
  { type: 'page-break' },

  // ── Timeline with many events + details ──
  {
    type: 'timeline',
    title: 'Q1 Milestones',
    events: [
      { date: 'Jan 8', icon: 'check', text: 'SOC 2 Type II certification awarded', detail: 'After 6-month audit by Deloitte' },
      { date: 'Jan 15', icon: 'user', text: 'Hired VP of Engineering (ex-Google Health)' },
      { date: 'Jan 22', icon: 'document', text: 'Published federated learning whitepaper — 3,400 downloads in first week' },
      { date: 'Feb 3', icon: 'star', text: 'HCA Healthcare signed — largest deal in company history', detail: '12 hospitals, 3-year commitment, €1.8M ARR' },
      { date: 'Feb 14', icon: 'mail', text: 'EU partnership announcement with Charité Berlin' },
      { date: 'Feb 28', icon: 'calendar', text: 'Board meeting — Series C discussion initiated' },
      { date: 'Mar 5', icon: 'search', text: 'Competitive intel: Aidoc raised $60M — increased sales pressure' },
      { date: 'Mar 15', icon: 'phone', text: 'Mayo Clinic escalation call — retention plan activated' },
      { date: 'Mar 28', icon: 'check', text: '1 millionth scan processed on the platform' },
    ],
  },

  // ── Success callout ──
  {
    type: 'callout',
    style: 'success',
    title: 'Wins to Celebrate',
    items: [
      'Zero production incidents for 47 consecutive days',
      'NPS score improved from 62 to **71** (industry avg: 44)',
      'Engineering velocity up 22% after migration to trunk-based development',
    ],
  },

  // ── Error callout ──
  {
    type: 'callout',
    style: 'error',
    title: 'Action Required',
    items: [
      'Renew AWS Enterprise Support before April 15 (auto-downgrades otherwise)',
      'Resolve open GDPR data subject requests — 3 overdue by >10 days',
    ],
  },

  // ── Quote ──
  {
    type: 'quote',
    text: 'The accuracy improvements in v3.3 changed how our radiologists work. They now trust the AI to flag urgent cases, which has reduced our critical-finding turnaround from 4 hours to 22 minutes.',
    attribution: 'Dr. Sarah Chen, Chief of Radiology, HCA Healthcare',
  },

  // ── Second section ──
  {
    type: 'section',
    title: 'Q2 Priorities',
    content:
      'The team will focus on three pillars: **retention** (Mayo Clinic, NHS), **expansion** (EU market, APAC exploration), and **platform** (AI Act compliance, multi-cloud support).\n\nEngineering will allocate 30% of sprint capacity to tech debt reduction, specifically migrating from the legacy monolith to the new microservices architecture. Target: 80% of traffic on new stack by end of Q2.',
  },

  // ── Smaller metrics row: 3 columns ──
  {
    type: 'metrics',
    items: [
      { label: 'Q2 Revenue Target', value: '€11.2M', trend: 'up' },
      { label: 'Headcount Plan', value: '148', unit: 'FTE', trend: 'neutral' },
      { label: 'Runway', value: '18', unit: 'months', trend: 'neutral' },
    ],
  },

  // ── Another table ──
  {
    type: 'table',
    title: 'Q2 OKR Summary',
    columns: ['Objective', 'Key Result', 'Owner'],
    rows: [
      ['Retain 100% of enterprise accounts', 'Mayo Clinic renewal signed by May 31', 'Sales'],
      ['Launch EU region', 'Frankfurt cluster live with <50ms latency', 'Platform'],
      ['AI Act readiness', 'Pass internal compliance audit', 'Legal + Eng'],
      ['Reach €11.2M ARR', 'Close 8 new mid-market deals', 'Sales'],
      ['Improve developer experience', 'SDK adoption by 5+ integration partners', 'Product'],
    ],
    highlightFirst: true,
  },

  // ── Second quote ──
  {
    type: 'quote',
    text: 'We need to treat the Mayo situation as a company-level priority. Losing a lighthouse account of that caliber would set back our US expansion by a year.',
    attribution: 'Internal — CEO weekly sync, March 18',
  },

  // ── Paragraph ──
  {
    type: 'paragraph',
    content: 'This document is confidential and intended for internal leadership distribution only. For questions about the data or methodology, contact the **Strategy & Operations** team.',
  },

  { type: 'divider' },

  {
    type: 'footnote',
    text: 'Generated by Vantage AI Analytics Agent — Data as of 2026-03-31 — Confidential',
  },
];

async function main() {
  for (const theme of themes) {
    console.log(`Generating ${theme} theme...`);
    const pdf = await createPdf({
      theme,
      brand: {
        primaryColor: theme === 'clean' ? '#6366f1' : undefined,
        companyName: 'Vantage Health AI',
      },
      blocks,
    });

    const filename = `test-output-${theme}.pdf`;
    fs.writeFileSync(filename, pdf);
    console.log(`  ✓ ${filename} (${(pdf.length / 1024).toFixed(0)} KB)`);
  }

  await closeBrowser();
  console.log('Done! All theme PDFs generated.');
}

main().catch(console.error);
