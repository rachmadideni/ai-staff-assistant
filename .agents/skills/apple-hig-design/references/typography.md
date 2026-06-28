# Typography — Apple HIG

## Font Stack

### Primary (System Font)
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;
```

### Monospace
```css
font-family: "SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace;
```

### Why System Font?
- **Performance** — no external loading
- **Consistency** — matches OS aesthetic
- **Legibility** — optimized for screens
- **Accessibility** — familiar to users

---

## Type Scale

### iOS Scale
| Name | Size | Weight | Line Height | Tracking |
|------|------|--------|-------------|----------|
| Large Title | 34px | 700 | 41px | 0.37px |
| Title 1 | 28px | 700 | 34px | 0.36px |
| Title 2 | 22px | 700 | 28px | 0.35px |
| Title 3 | 20px | 600 | 25px | 0.38px |
| Headline | 17px | 600 | 22px | -0.41px |
| Body | 17px | 400 | 22px | -0.41px |
| Callout | 16px | 400 | 21px | -0.32px |
| Subhead | 15px | 400 | 20px | -0.24px |
| Footnote | 13px | 400 | 18px | -0.08px |
| Caption 1 | 12px | 400 | 16px | 0px |
| Caption 2 | 11px | 400 | 13px | 0.07px |

### Web Adaptation
| Context | Size | Weight | Usage |
|---------|------|--------|-------|
| Page Title | 28-34px | 700 | H1, main heading |
| Section Title | 22px | 700 | H2, section heading |
| Card Title | 17px | 600 | H3, card heading |
| Body | 17px | 400 | Primary text |
| Secondary | 15px | 400 | Supporting text |
| Caption | 13px | 400 | Metadata, labels |

---

## Rules

### Hierarchy
1. **Weight first** — use 400, 600, 700 for hierarchy
2. **Size second** — only vary size for major sections
3. **Color third** — use opacity for tertiary text

### Spacing
- **Line height:** 1.2-1.5x font size
- **Paragraph spacing:** Equal to line height
- **Letter spacing:** Negative for large text, positive for small text

### Alignment
- **Left-aligned** for body text (never justified)
- **Centered** for short headlines only
- **Never center** paragraphs or long text

### Line Length
- **Optimal:** 45-75 characters per line
- **Maximum:** 85 characters
- **Minimum:** 40 characters

---

## Responsive Type

### Clamp Function
```css
h1 {
  font-size: clamp(28px, 5vw, 34px);
}

body {
  font-size: clamp(15px, 2.5vw, 17px);
}
```

### Breakpoints
| Breakpoint | Title | Body |
|------------|-------|------|
| Mobile (< 640px) | 28px | 16px |
| Tablet (640-1024px) | 30px | 17px |
| Desktop (> 1024px) | 34px | 17px |

---

## Font Weight Usage

| Weight | CSS Value | Usage |
|--------|-----------|-------|
| Regular | 400 | Body text, secondary text |
| Medium | 500 | Labels, navigation items |
| Semibold | 600 | Headlines, card titles |
| Bold | 700 | Page titles, emphasis |

### Rules
- **Never use light (300)** — too thin for screens
- **Never use black (900)** — too heavy
- **Maximum 2 weights** per screen
- **Bold for emphasis only** — not decoration

---

## Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Too many sizes | Confusing hierarchy | Max 2-3 sizes |
| Centered paragraphs | Hard to read | Left-align |
| Thin fonts | Illegible | Use Regular (400) |
| Justified text | Uneven spacing | Left-align |
| All caps | Shouting, hard to read | Use weight instead |
| Tight line height | Cramped | Use 1.4-1.5 |
