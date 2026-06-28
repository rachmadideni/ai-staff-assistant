---
name: apple-hig-design
description: 'Design web applications following Apple Human Interface Guidelines principles. Use when the user mentions "Apple design", "clean UI", "minimal design", "HIG", "Apple style", "iOS design", "macOS design", "elegant UI", "simple design", "no AI slop", or wants to create interfaces that feel native to Apple ecosystem. Also use when reviewing UI for clarity, deference, and depth.'
license: MIT
metadata:
  author: custom
  version: "1.0.0"
---

# Apple HIG Design for Web

Create interfaces that feel unmistakably Apple — clean, intentional, and effortless. Apple HIG is not about copying Apple's products; it's about adopting their design philosophy.

## Core Principles

### 1. Clarity
**Text must be legible at every size.** Icons should be precise and meaningful. Decorative elements should never interfere with content.

**Why it works:** Users should never have to think about the interface. Information hierarchy should be immediately obvious.

### 2. Deference
**The UI helps users focus on content, not chrome.** Minimize visual weight. Let content be the hero. Controls should recede until needed.

**Why it works:** When the UI steps back, content steps forward. Users feel in control, not overwhelmed by decoration.

### 3. Depth
**Visual hierarchy creates meaning.** Layering, motion, and translucency communicate relationships. The foreground is active; the background is context.

**Why it works:** Depth helps users understand what's important, what's related, and what's interactive.

---

## Anti-Patterns (AI Slop to Avoid)

| AI Slop | Apple HIG Alternative |
|---------|----------------------|
| Gradient backgrounds everywhere | Clean, solid backgrounds with purpose |
| Rounded corners on everything | Consistent corner radius (8-12px) |
| Shadows on every element | Subtle shadows only for elevation |
| Centered text blocks | Left-aligned, clear hierarchy |
| Too many colors | Limited palette with accent color |
| Icons with circles/badges | Simple, SF-style icons |
| Card overload | Strategic use of cards for grouping |
| "Modern" glassmorphism abuse | Purposeful translucency only |
| Animated everything | Meaningful motion only |
| Gradient buttons | Solid, clear CTAs |

---

## Typography

### Font Stack
```css
/* Primary: SF Pro (system font) */
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;

/* Monospace: SF Mono */
font-family: "SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace;
```

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Large Title | 34px | 700 | 41px |
| Title 1 | 28px | 700 | 34px |
| Title 2 | 22px | 700 | 28px |
| Title 3 | 20px | 600 | 25px |
| Headline | 17px | 600 | 22px |
| Body | 17px | 400 | 22px |
| Callout | 16px | 400 | 21px |
| Subhead | 15px | 400 | 20px |
| Footnote | 13px | 400 | 18px |
| Caption 1 | 12px | 400 | 16px |
| Caption 2 | 11px | 400 | 13px |

### Rules
- **Maximum 2 font sizes per screen** — hierarchy comes from weight and color, not size variation
- **Line height: 1.2-1.5x font size** — never tighter
- **Line length: 45-75 characters** — optimal readability
- **Avoid all caps** — use letter-spacing instead if needed

---

## Color

### Light Mode Palette
```css
:root {
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F2F2F7;
  --bg-tertiary: #FFFFFF;
  
  /* Text */
  --text-primary: #000000;
  --text-secondary: #3C3C43;
  --text-tertiary: #3C3C4399;
  
  /* Separators */
  --separator: #3C3C4349;
  --separator-opaque: #C6C6C8;
  
  /* Accent */
  --accent: #007AFF;
  --accent-hover: #0056CC;
  
  /* Status */
  --success: #34C759;
  --warning: #FF9500;
  --error: #FF3B30;
}
```

### Dark Mode Palette
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --bg-secondary: #1C1C1E;
    --bg-tertiary: #2C2C2E;
    
    --text-primary: #FFFFFF;
    --text-secondary: #EBEBF5;
    --text-tertiary: #EBEBF599;
    
    --separator: #54545899;
    --separator-opaque: #38383A;
    
    --accent: #0A84FF;
    --accent-hover: #409CFF;
  }
}
```

### Rules
- **Use system colors** — they adapt to user preferences
- **Maximum 3 colors** per screen (background, text, accent)
- **Semantic colors** for status (success, warning, error)
- **Never use color alone** to convey information
- **Contrast ratio: 4.5:1 minimum** for text

---

## Spacing & Layout

### Spacing Scale
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 20px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 40px;
  --space-4xl: 48px;
}
```

### Layout Rules
- **16px minimum padding** for content areas
- **8px grid system** — all spacing should be multiples of 8
- **Safe areas** — respect notch, home indicator
- **Content width: 680px max** for readability (text-heavy)
- **Full-width** for media and immersive content

### Margins & Padding
| Context | Value |
|---------|-------|
| Page margin (mobile) | 16px |
| Page margin (tablet) | 20px |
| Card padding | 16px |
| Section spacing | 24-32px |
| List item height | 44px (touch target) |

---

## Components

### Buttons
```css
/* Primary */
.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 600;
  min-height: 44px;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.8;
}

/* Secondary / Ghost */
.btn-secondary {
  background: transparent;
  color: var(--accent);
  border: none;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 400;
}

/* Destructive */
.btn-destructive {
  background: var(--error);
  color: white;
}
```

### Cards
```css
.card {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* No heavy shadows — use subtle elevation */
.card-elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
```

### Lists
```css
.list {
  background: var(--bg-tertiary);
  border-radius: 12px;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 12px 16px;
  border-bottom: 0.5px solid var(--separator);
}

.list-item:last-child {
  border-bottom: none;
}
```

### Navigation
```css
.nav {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 0.5px solid var(--separator);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  text-align: center;
}
```

---

## Icons

### SF Symbols Style
- **Stroke width:** 1.5px (consistent)
- **Size:** 20-24px for navigation, 17-20px for inline
- **Color:** Match text color or use accent
- **Style:** Outlined, not filled (unless active state)

### Icon Examples (Use Unicode or SVG)
```
← Back     ✓ Check    + Add    ⚙ Settings    🔍 Search
```

### Rules
- **Consistent stroke width** across all icons
- **Same visual weight** as adjacent text
- **No multi-color icons** — single color only
- **44x44px touch target** for interactive icons

---

## Animation

### Principles
1. **Purposeful** — animation must have a reason
2. **Responsive** — immediate feedback to user input
3. **Connected** — motion links cause and effect

### Timing
```css
:root {
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Allowed Animations
- **Page transitions** — slide or fade (not both)
- **State changes** — opacity, scale (subtle)
- **Loading** — skeleton screens, not spinners
- **Feedback** — button press, toggle switch

### Forbidden Animations
- Bouncing elements
- Continuous rotation
- Parallax scrolling
- Text typing effects
- Gradient animations
- Loading spinners (use skeletons)

---

## Spacing Checklist

Before finalizing any UI, verify:

- [ ] **Touch targets:** Minimum 44x44px
- [ ] **Text legibility:** Can read at arm's length
- [ ] **Color contrast:** 4.5:1 ratio minimum
- [ ] **Spacing consistency:** All multiples of 8px
- [ ] **Content width:** Max 680px for text
- [ ] **Padding:** 16px minimum on all sides
- [ ] **Hierarchy:** Obvious visual flow
- [ ] **Empty states:** Designed, not forgotten
- [ ] **Dark mode:** Supports system preference
- [ ] **Accessibility:** Works with screen readers

---

## Quick Diagnostic

| Question | If No | Action |
|----------|-------|--------|
| Can a user understand this in 3 seconds? | Too complex | Simplify hierarchy |
| Is there more than 1 font size variation? | Too many sizes | Limit to 2 sizes max |
| Are there more than 3 colors? | Too colorful | Reduce palette |
| Do all elements have purpose? | Decorative clutter | Remove non-essential |
| Is text left-aligned? | Centered blocks | Left-align for readability |
| Are animations meaningful? | Gratuitous motion | Remove or justify |
| Does it work in dark mode? | Light-only design | Test both modes |

---

## Reference Files

- [typography.md](references/typography.md): Detailed typography rules, font pairing, responsive type
- [color-system.md](references/color-system.md): Complete color palette, semantic colors, accessibility
- [layout-patterns.md](references/layout-patterns.md): Common layouts, spacing rules, responsive design
- [components.md](references/components.md): Button, card, list, navigation component specs
- [animation.md](references/animation.md): Motion principles, timing curves, interaction patterns

---

## Further Reading

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [Apple Design Resources](https://developer.apple.com/design/resources/)
- [iOS Design Patterns](https://www.raywenderlich.com/books/ios-design-patterns)

---

## About This Skill

This skill adapts Apple HIG principles for web applications. It focuses on:
- **Clarity** over decoration
- **Content** over chrome
- **Consistency** over novelty
- **Accessibility** over aesthetics

The goal is to create interfaces that feel inevitable — like they couldn't have been designed any other way.
