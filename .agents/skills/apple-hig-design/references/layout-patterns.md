# Layout Patterns — Apple HIG

## Grid System

### 8px Grid
All spacing must be multiples of 8px. This creates visual consistency and rhythm.

```css
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-8: 64px;
  --space-10: 80px;
}
```

### Exceptions
- **4px** — tiny gaps (icon to text)
- **12px** — inline spacing (rare)

---

## Page Layout

### Mobile (< 640px)
```css
.page {
  padding: 16px;
  min-height: 100dvh;
}

.page-header {
  margin-bottom: 24px;
}
```

### Tablet (640-1024px)
```css
.page {
  padding: 20px 24px;
  max-width: 1024px;
  margin: 0 auto;
}
```

### Desktop (> 1024px)
```css
.page {
  padding: 24px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Content-focused: max 680px */
.content {
  max-width: 680px;
}
```

---

## Content Width

### Text Content
```css
.text-content {
  max-width: 680px; /* Optimal reading width */
}

.text-content p {
  max-width: 65ch; /* Character-based limit */
}
```

### Why 680px?
- **45-75 characters** per line (optimal readability)
- **Prevents eye strain** — no scanning across wide screens
- **Maintains focus** — content feels contained

---

## Spacing Rules

### Between Sections
```css
section + section {
  margin-top: 32px;
}

/* Or using gap */
.container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
```

### Inside Cards
```css
.card {
  padding: 16px;
}

.card-header {
  margin-bottom: 12px;
}

.card-content {
  margin-bottom: 16px;
}

.card-footer {
  margin-top: 16px;
}
```

### List Items
```css
.list-item {
  padding: 12px 16px;
  min-height: 44px; /* Touch target */
}
```

---

## Common Layouts

### Single Column (Default)
```css
.layout-single {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 16px;
}
```

### Two Column (Sidebar)
```css
.layout-sidebar {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  min-height: 100dvh;
}

@media (max-width: 768px) {
  .layout-sidebar {
    grid-template-columns: 1fr;
  }
}
```

### Three Column (Dashboard)
```css
.layout-dashboard {
  display: grid;
  grid-template-columns: 240px 1fr 320px;
  gap: 24px;
}

@media (max-width: 1024px) {
  .layout-dashboard {
    grid-template-columns: 1fr;
  }
}
```

---

## Responsive Breakpoints

### Mobile First
```css
/* Base: Mobile */
.element {
  font-size: 16px;
  padding: 16px;
}

/* Tablet */
@media (min-width: 640px) {
  .element {
    font-size: 17px;
    padding: 20px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    padding: 24px;
  }
}
```

### Breakpoint Values
| Name | Width | Usage |
|------|-------|-------|
| Mobile | < 640px | Phones |
| Tablet | 640-1024px | iPads, small laptops |
| Desktop | > 1024px | Desktops, large screens |

---

## Safe Areas

### Mobile Notch/Home Indicator
```css
.page {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Why Safe Areas?
- Content not hidden behind notch
- Buttons not obscured by home indicator
- Proper spacing on all devices

---

## Touch Targets

### Minimum Size
```css
.interactive {
  min-height: 44px;
  min-width: 44px;
}

/* Or for inline elements */
.link, .button-inline {
  padding: 12px 0; /* Ensures 44px height */
}
```

### Why 44px?
- **Finger size** — average fingertip is 44-57px
- **Accessibility** — motor impairments need larger targets
- **Apple HIG requirement** — standard across all Apple platforms

---

## Content Hierarchy

### Primary → Secondary → Tertiary
```css
.primary-text {
  font-size: 17px;
  font-weight: 400;
  color: var(--text-primary);
}

.secondary-text {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-secondary);
}

.tertiary-text {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-tertiary);
}
```

### Visual Weight Rules
1. **Most important** — largest, boldest, darkest
2. **Supporting** — smaller, lighter
3. **Metadata** — smallest, lightest color

---

## Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Wide text columns | Hard to read | Max 680px |
| Inconsistent spacing | Visual chaos | Use 8px grid |
| No safe area padding | Content hidden | Use env(safe-area-inset-*) |
| Small touch targets | Frustrating | Min 44x44px |
| Centered paragraphs | Hard to read | Left-align |
| No responsive design | Broken on mobile | Mobile-first approach |
