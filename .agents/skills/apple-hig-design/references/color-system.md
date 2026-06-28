# Color System — Apple HIG

## Principles

1. **Use system colors** — they adapt to user preferences
2. **Limit palette** — maximum 3 colors per screen
3. **Semantic meaning** — colors have purpose
4. **Accessibility first** — contrast ratios matter

---

## Light Mode Palette

### Backgrounds
```css
:root {
  /* Primary background */
  --bg-primary: #FFFFFF;
  
  /* Secondary background (grouped content) */
  --bg-secondary: #F2F2F7;
  
  /* Tertiary background (cards, elevated content) */
  --bg-tertiary: #FFFFFF;
  
  /* Quaternary (sidebar, popover) */
  --bg-quaternary: #F2F2F7;
}
```

### Text
```css
:root {
  /* Primary text */
  --text-primary: #000000;
  
  /* Secondary text */
  --text-secondary: #3C3C43;
  
  /* Tertiary text (placeholders, captions) */
  --text-tertiary: #3C3C4399;
  
  /* Quaternary text (disabled) */
  --text-quaternary: #3C3C434D;
}
```

### Separators
```css
:root {
  /* Thin separator (0.5px) */
  --separator: #3C3C4349;
  
  /* Opaque separator (1px) */
  --separator-opaque: #C6C6C8;
}
```

---

## Dark Mode Palette

### Backgrounds
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --bg-secondary: #1C1C1E;
    --bg-tertiary: #2C2C2E;
    --bg-quaternary: #3A3A3C;
  }
}
```

### Text
```css
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #FFFFFF;
    --text-secondary: #EBEBF5;
    --text-tertiary: #EBEBF599;
    --text-quaternary: #EBEBF54D;
  }
}
```

### Separators
```css
@media (prefers-color-scheme: dark) {
  :root {
    --separator: #54545899;
    --separator-opaque: #38383A;
  }
}
```

---

## Accent Colors

### System Blue (Primary)
```css
:root {
  --accent: #007AFF;
  --accent-hover: #0056CC;
  --accent-active: #004099;
}

@media (prefers-color-scheme: dark) {
  :root {
    --accent: #0A84FF;
    --accent-hover: #409CFF;
    --accent-active: #66B5FF;
  }
}
```

### Status Colors
```css
:root {
  /* Success */
  --success: #34C759;
  --success-bg: #34C7591A;
  
  /* Warning */
  --warning: #FF9500;
  --warning-bg: #FF95001A;
  
  /* Error */
  --error: #FF3B30;
  --error-bg: #FF3B301A;
  
  /* Info */
  --info: #5AC8FA;
  --info-bg: #5AC8FA1A;
}
```

---

## Color Usage Rules

### Background Rules
- **White/light gray** for primary content
- **Gray (#F2F2F7)** for grouped/background
- **Never pure black** for backgrounds (except OLED)
- **Max 2 background colors** per screen

### Text Rules
- **Black/white** for primary text
- **Gray** for secondary text
- **Lighter gray** for tertiary/captions
- **Never colored text** for body (only accents)

### Accent Rules
- **One accent color** per screen
- **Blue** for interactive elements
- **Green** for success/confirmation
- **Red** for destructive/error
- **Never mix** accent colors

---

## Contrast Requirements

### WCAG Compliance
| Element | Minimum Ratio | Target |
|---------|---------------|--------|
| Normal text (< 18px) | 4.5:1 | 7:1 |
| Large text (≥ 18px) | 3:1 | 4.5:1 |
| UI components | 3:1 | 4.5:1 |

### Testing
```css
/* Check contrast */
.element {
  color: var(--text-primary);
  background: var(--bg-primary);
}
/* Must pass: 4.5:1 for body text */
```

---

## Dark Mode Implementation

### Method 1: CSS Variables (Recommended)
```css
:root {
  --bg: #FFFFFF;
  --text: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --text: #FFFFFF;
  }
}
```

### Method 2: Class Toggle
```css
:root {
  --bg: #FFFFFF;
  --text: #000000;
}

[data-theme="dark"] {
  --bg: #000000;
  --text: #FFFFFF;
}
```

### Rules
- **Always support both modes** — no exceptions
- **Test both modes** — design breaks happen
- **Use semantic variables** — never hardcode colors
- **Respect system preference** — auto-detect by default

---

## Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Too many colors | Visual noise | Max 3 colors |
| Pure black text | Harsh contrast | Use #000000 only for titles |
| Colored body text | Hard to read | Use gray for body |
| No dark mode | Alienates users | Always support both |
| Low contrast | Illegible | Check 4.5:1 ratio |
| Gradient backgrounds | AI slop aesthetic | Use solid colors |
