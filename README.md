# agentdoc

**Beautiful PDFs from AI agents. Block-based. Zero design required.**

agentdoc is an open-source TypeScript library that lets AI agents generate professional PDF documents by composing simple JSON blocks. No CSS, no HTML, no layout code. The agent picks blocks, fills in content, and agentdoc handles all the design.

Think SwiftUI — but for documents.

---

## Why agentdoc?

Every AI agent framework out there — LangChain, LangGraph, CrewAI, AutoGen, OpenAI Agents SDK — has agents that need to produce documents. Reports, proposals, briefings, invoices. And right now, they all hack it together with raw HTML strings, ugly pdfkit coordinate code, or expensive closed-source APIs.

The problem is simple: AI agents are great at structured data, terrible at design. Current PDF libraries force agents to make visual decisions they shouldn't be making — fonts, margins, pixel coordinates, CSS. The result is either ugly documents or wasted tokens on layout code.

agentdoc fixes this. Give your agent blocks. Get beautiful PDFs.

## Origin

agentdoc was built by [Cora Intelligence](https://cora-intelligence.com), where we're building an AI workforce platform for B2B sales. Cora Intelligence — needs to produce professional documents every day: meeting briefings before sales calls, pipeline reports, company profiles, proposals.

We needed a way for our agents to generate beautiful PDFs without any design knowledge. Nothing like it existed. Every option was either too low-level (write layout code) or too rigid (pre-made templates that can't adapt).

So we built agentdoc and open-sourced it for the entire AI agent community.

---

## Quick Start

### Install

```bash
npm install agentdoc
```

### Generate a PDF

```typescript
import { createPdf } from 'agentdoc';
import { writeFileSync } from 'fs';

const pdf = await createPdf({
  theme: 'clean',
  blocks: [
    {
      type: 'cover',
      title: 'Meeting Briefing',
      subtitle: 'Dr. Stefan Weber — Charité Berlin',
      date: 'February 19, 2026'
    },
    {
      type: 'metrics',
      items: [
        { label: 'Lead Score', value: '92', unit: '/100', trend: 'up' },
        { label: 'Emails Opened', value: '4/4', trend: 'up' },
        { label: 'Deal Size', value: '€240K', trend: 'up' }
      ]
    },
    {
      type: 'section',
      title: 'Company Overview',
      content: 'Charité Berlin is Europe\'s largest university hospital with over 3,000 beds across 4 campuses. Strong interest in AI-powered diagnostics for their radiology department.'
    },
    {
      type: 'table',
      title: 'Key Contacts',
      columns: ['Name', 'Role', 'Relevance'],
      rows: [
        ['Dr. Stefan Weber', 'CMO', 'Decision maker — budget authority'],
        ['Lisa Neumann', 'Head of IT', 'Technical evaluator'],
        ['Prof. Klaus Fischer', 'Radiology Director', 'End user champion']
      ]
    },
    {
      type: 'callout',
      style: 'warning',
      title: 'Talking Points',
      items: [
        'Ask about current radiology AI tools',
        'Emphasize GDPR compliance and EU data residency',
        'Propose 3-month pilot with radiology department'
      ]
    }
  ]
});

writeFileSync('briefing.pdf', pdf);
```

That's it. Five blocks. One beautiful PDF. The agent never touches a single line of CSS.

### CLI

```bash
npx agentdoc generate --input blocks.json --theme clean --output report.pdf
```

Works from any language. Your Python agent writes JSON, runs the command, gets a PDF.

### Docker (HTTP Service)

```bash
docker run -p 3100:3100 cora-intelligence/agentdoc
```

```bash
curl -X POST http://localhost:3100/generate \
  -H "Content-Type: application/json" \
  -d @blocks.json \
  --output report.pdf
```

One endpoint. Send blocks, get PDF. Perfect for Python/Go/Java backends.

---

## Blocks

agentdoc gives your agent 22 block types. Each one is designed to always look good, no matter how they're combined.

### Content

| Block | What it does | Agent provides |
|-------|-------------|----------------|
| `cover` | Title page | title, subtitle, date |
| `section` | Text with heading | title, content (supports markdown) |
| `paragraph` | Plain text | content |
| `callout` | Highlighted box | style (info/warning/success/error), title, content or items |
| `quote` | Pull quote | text, attribution |

### Data

| Block | What it does | Agent provides |
|-------|-------------|----------------|
| `metrics` | KPI cards in a row | items: [{label, value, unit, trend}] |
| `table` | Data table | columns, rows |
| `chart` | Bar/line/pie chart | type, labels, datasets |
| `progress` | Progress bars | items: [{label, value, max}] |
| `comparison` | Side-by-side boxes | left: {title, items}, right: {title, items} |

### Narrative

| Block | What it does | Agent provides |
|-------|-------------|----------------|
| `timeline` | Vertical event timeline | events: [{date, icon, text}] |
| `steps` | Numbered steps | items: [{title, description}] |
| `checklist` | To-do list | items: [{text, checked}] |
| `pros-cons` | Two columns | pros: [], cons: [] |

### Layout

| Block | What it does | Agent provides |
|-------|-------------|----------------|
| `divider` | Horizontal line | — |
| `spacer` | Vertical space | size (sm/md/lg) |
| `columns` | Multi-column | columns: [blocks[], blocks[]] |
| `page-break` | New page | — |
| `header` | Repeating page header | left, center, right |
| `footer` | Page footer with page numbers | left, center, right |
| `footnote` | Small text at bottom | text |

### Media

| Block | What it does | Agent provides |
|-------|-------------|----------------|
| `image` | Embedded image | src, caption, size |
| `logo-row` | Row of logos | items: [{src, label}] |
| `signature` | Signature block | name, role, company, date |

---

## Themes

Pick a theme. Everything looks cohesive. The agent just passes a string.

| Theme | Style |
|-------|-------|
| `clean` | White, blue accents, Inter font. Professional and versatile. **(default)** |
| `modern-dark` | Dark background, vibrant accents. Tech-forward. |
| `corporate` | Navy/gold, Georgia headings. Enterprise-ready. |
| `minimal` | Maximum whitespace, thin lines. Elegant and understated. |
| `bold` | Large type, high contrast, red accents. Attention-grabbing. |

### Custom Branding

Override any theme with your brand:

```typescript
const pdf = await createPdf({
  theme: 'clean',
  brand: {
    primaryColor: '#3b82f6',
    font: 'Poppins',              // auto-loaded from Google Fonts
    logo: './your-logo.png',
    companyName: 'Your Company'
  },
  blocks: [...]
});
```

---

## Smart Defaults

Every block has built-in intelligence so the output always looks good:

- **metrics**: 1-2 items → full width. 3-4 → row. 5+ → auto-wraps to 2 rows.
- **table**: Column widths auto-calculated from content. Long text wraps cleanly.
- **timeline**: 10+ events → automatic page break. Lines connect across pages.
- **chart**: Auto-scales. Colors assigned from theme palette if not specified.
- **cover**: With logo → centered above title. Without → title gets more vertical space.
- **All blocks**: Consistent spacing. No manual margin tweaking.

---

## Agent Integration

### LangGraph / LangChain (Python)

```python
@tool
def generate_pdf(blocks: list, theme: str = "clean") -> str:
    """Generate a beautiful PDF from block components.

    Available blocks: cover, section, metrics, table, timeline,
    callout, chart, checklist, steps, comparison, pros-cons,
    quote, progress, signature, and more.

    Available themes: clean, modern-dark, corporate, minimal, bold.
    """
    response = requests.post("http://agentdoc:3100/generate", json={
        "theme": theme,
        "blocks": blocks
    })
    path = f"/docs/report_{uuid4().hex[:8]}.pdf"
    with open(path, "wb") as f:
        f.write(response.content)
    return path
```

### CrewAI

```python
from crewai_tools import tool

@tool("PDF Generator")
def generate_pdf(blocks: list, theme: str = "clean") -> str:
    """Generate a professional PDF document from block components."""
    response = requests.post("http://agentdoc:3100/generate", json={
        "theme": theme, "blocks": blocks
    })
    path = f"/output/document.pdf"
    with open(path, "wb") as f:
        f.write(response.content)
    return f"PDF saved to {path}"
```

### OpenAI Function Calling

```json
{
  "name": "generate_pdf",
  "description": "Generate a PDF from block components. Blocks: cover, section, metrics, table, timeline, callout, chart, checklist, steps, pros-cons, signature.",
  "parameters": {
    "type": "object",
    "properties": {
      "theme": { "type": "string", "enum": ["clean", "modern-dark", "corporate", "minimal", "bold"] },
      "blocks": { "type": "array", "items": { "type": "object" } }
    },
    "required": ["blocks"]
  }
}
```

### Claude Tool Use

```json
{
  "name": "generate_pdf",
  "description": "Generate a beautiful PDF document by composing block components. Available blocks: cover, section, paragraph, callout, quote, metrics, table, chart, progress, comparison, timeline, steps, checklist, pros-cons, divider, columns, image, signature, footnote. Available themes: clean, modern-dark, corporate, minimal, bold.",
  "input_schema": {
    "type": "object",
    "properties": {
      "theme": { "type": "string", "default": "clean" },
      "blocks": { "type": "array", "items": { "type": "object" } }
    },
    "required": ["blocks"]
  }
}
```

### CLI (Any Language)

```bash
# Write blocks to JSON, run CLI, get PDF
echo '{"theme":"clean","blocks":[{"type":"cover","title":"Report"}]}' > input.json
npx agentdoc generate -i input.json -o report.pdf
```

---

## Examples

The `examples/` folder includes complete JSON files for common document types:

- **meeting-briefing.json** — Pre-call briefing with contact info, metrics, timeline, talking points
- **sales-proposal.json** — Multi-page proposal with problem/solution, pricing table, implementation steps
- **pipeline-report.json** — Weekly sales report with KPIs, charts, lead table, insights
- **invoice.json** — Clean invoice with line items, totals, payment terms
- **company-profile.json** — Research dossier with overview, contacts, opportunities/risks

---

## How It Works Under the Hood

```
JSON blocks → HTML assembly → Puppeteer → PDF
```

1. Your agent passes blocks as JSON
2. Zod validates every block (clear error messages if data is wrong)
3. Each block renders to an HTML fragment
4. Theme CSS + brand overrides are applied
5. Puppeteer renders the full page in headless Chrome
6. PDF is generated with proper page size, margins, and breaks
7. Buffer returned (sub-second for simple documents)

### Why Puppeteer?

HTML/CSS is the best layout engine on the planet. It handles typography, tables, flexbox, page breaks, and text wrapping out of the box. Rather than reinventing layout algorithms (like pdfkit), we render beautiful HTML and let Chrome do what Chrome does best.

---

## Contributing

We welcome contributions! Here's how to help:

**Add a new block type:**
1. Create `src/blocks/your-block.ts` — export a function that takes block data and returns an HTML string
2. Add TypeScript types in `src/types.ts`
3. Add Zod validation in `src/validator.ts`
4. Style it in each theme CSS file
5. Add an example to the README
6. Open a PR

**Add a new theme:**
1. Create `src/themes/your-theme.css`
2. Style all existing block CSS classes
3. Add a preview screenshot
4. Open a PR

**Report bugs or request features:**
Open an issue at [github.com/cora-intelligence/agentdoc/issues](https://github.com/cora-intelligence/agentdoc/issues)

---

## License

MIT — use it anywhere, modify it freely, no restrictions.

---

Built with care by [Cora Intelligence](https://cora-intelligence.com)
