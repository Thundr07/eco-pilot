# FormattedPolicy Component

A robust React component that transforms raw AI-generated text (from Gemini/GPT) into structured, scannable UI with automatic formatting.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `raw` | `string` | Yes | Raw text output from LLM (plain text, markdown, or JSON) |

## Features

### Automatic Detection & Formatting
- **Markdown Headings** (`#`, `##`, `###`) → Rendered as `<h2>`, `<h3>`, `<h4>`
- **Bullet Lists** (`-`, `*`, `•`) → Rendered as `<ul>` with proper indentation
- **Numbered Lists** (`1.`, `2.`) → Rendered as `<ol>` with proper indentation
- **Policy Blocks** (e.g., "POLICY 1:", "Policy 1 -") → Styled as titled cards with accent borders
- **Paragraphs** → Separated by blank lines, rendered in soft cards with `bg-card`

### Smart Highlighting
- **Numeric Tokens** (%, INR, Rs, ₹, tons, years, kWh, MW, etc.) → Highlighted with yellow/green badges
- Automatically detects and highlights units, percentages, and currency

### JSON Support
- If input starts with `{` or `[`, attempts JSON parsing
- Renders structured fields like `summary`, `policies[]`, `insights[]`
- Graceful fallback to plain formatting on parse errors

### UX Enhancements
- **Long Section Collapsing** → Sections >300 words collapse by default with "Read more" expander
- **Smooth Animations** → Collapsible transitions for better UX
- **Semantic HTML** → Proper heading hierarchy and accessibility
- **Keyboard Navigation** → All collapsibles are keyboard-accessible

## Usage

```tsx
import FormattedPolicy from '@/components/FormattedPolicy';

// In your component:
<FormattedPolicy raw={results.policyRecommendations} />
<FormattedPolicy raw={results.cityNarrative} />
<FormattedPolicy raw={selectedAssessment.recommendations?.analysis} />
```

## Integration Points

Currently used in:
- `IndustryResults.tsx` – AI Policy Advisor, City Narrative, Sustainability Recommendations
- `Dashboard.tsx` – AI Recommendations section

## Design System

- Uses Tailwind semantic tokens from `index.css`
- Consistent with green-blue theme
- All colors are HSL-based from design system
- Responsive and mobile-friendly

## Example Output

**Input (raw):**
```
## Cost-Benefit Analysis

POLICY 1: Solar Rooftop Installation
- Reduce emissions by 15%
- Cost: ₹2.5 lakh
- ROI: 5 years

Target: 50% renewable energy by 2030
```

**Output:**
- Heading rendered as `<h3>` with styling
- Policy block highlighted with accent border
- Numbers (15%, ₹2.5 lakh, 5 years, 50%, 2030) shown as badges
- List items properly indented

## Notes
- Does NOT modify backend or LLM calls
- Pure frontend transformation
- Handles malformed input gracefully
- No external dependencies beyond existing UI components
