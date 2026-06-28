# Animation — Apple HIG

## Principles

1. **Purposeful** — every animation must have a reason
2. **Responsive** — immediate feedback to user input
3. **Connected** — motion links cause and effect

---

## Timing

### Duration
```css
:root {
  /* Fast: micro-interactions */
  --duration-fast: 0.15s;
  
  /* Normal: state changes */
  --duration-normal: 0.3s;
  
  /* Slow: page transitions */
  --duration-slow: 0.5s;
}
```

### Easing Curves
```css
:root {
  /* Default: smooth deceleration */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  
  /* Spring: bouncy, playful */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Decelerate: fast start, slow end */
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  
  /* Accelerate: slow start, fast end */
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
}
```

---

## Allowed Animations

### Page Transitions
```css
/* Slide in from right */
.page-enter {
  animation: slideInRight var(--duration-normal) var(--ease-default);
}

@keyframes slideInRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Fade in */
.page-enter {
  animation: fadeIn var(--duration-normal) var(--ease-default);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### State Changes
```css
/* Button press */
.button:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* Toggle switch */
.toggle {
  transition: background-color var(--duration-normal) var(--ease-default);
}

/* Expand/collapse */
.content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-normal) var(--ease-default);
}

.content.expanded {
  max-height: 500px;
}
```

### Hover States
```css
/* Subtle opacity change */
.element:hover {
  opacity: 0.8;
  transition: opacity var(--duration-fast) ease;
}

/* Color shift */
.link:hover {
  color: var(--accent-hover);
  transition: color var(--duration-fast) ease;
}
```

---

## Loading States

### Skeleton Screens (Preferred)
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Why Skeletons Over Spinners?
- **Feels faster** — content appears gradually
- **Reduces perceived wait time**
- **Shows structure** — user knows what's coming
- **No distraction** — subtle, not attention-grabbing

---

## Interaction Feedback

### Button States
```css
.btn {
  transition: all var(--duration-fast) ease;
}

/* Hover */
.btn:hover {
  opacity: 0.8;
}

/* Active (pressed) */
.btn:active {
  transform: scale(0.98);
}

/* Disabled */
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### List Item Selection
```css
.list-item {
  transition: background-color var(--duration-fast) ease;
}

.list-item:hover {
  background: var(--bg-secondary);
}

.list-item:active {
  background: var(--bg-tertiary);
}
```

### Focus States
```css
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
  transition: all var(--duration-fast) ease;
}
```

---

## Forbidden Animations

### Never Use
- ❌ **Bouncing elements** — feels childish
- ❌ **Continuous rotation** — distracting
- ❌ **Parallax scrolling** — overused, performance issues
- ❌ **Text typing effects** — slow, frustrating
- ❌ **Gradient animations** — AI slop aesthetic
- ❌ **Loading spinners** — use skeletons instead
- ❌ **3D transforms** — gimmicky
- ❌ **Elastic easing** — too bouncy for professional UI

### Why These Are Bad
| Animation | Problem |
|-----------|---------|
| Bouncing | Distracting, unprofessional |
| Continuous rotation | Grabs attention unnecessarily |
| Parallax | Performance issues, motion sickness |
| Typing effect | Slow, user can't skip |
| Gradient | AI slop, no purpose |
| Spinner | Shows system is busy, not progress |

---

## Reduced Motion

### Always Respect User Preference
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Why?
- **Accessibility** — some users have vestibular disorders
- **Performance** — battery life on mobile
- **User preference** — some people simply don't like motion

---

## Animation Checklist

Before adding any animation:

- [ ] **Purposeful?** Does it serve a function?
- [ ] **Responsive?** Is it triggered by user action?
- [ ] **Connected?** Does it link cause and effect?
- [ ] **Fast?** Under 500ms duration?
- [ ] **Subtle?** Does it distract from content?
- [ ] **Respects reduced motion?**
- [ ] **Performance?** No layout thrashing?

---

## Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Animating everything | Visual noise | Only animate purposeful changes |
| Slow animations (> 500ms) | Feels sluggish | Keep under 300ms |
| No easing | Robotic feel | Use ease-out for entrances |
| Layout animation | Janky | Only animate transform/opacity |
| Ignoring reduced motion | Accessibility violation | Always use @media query |
