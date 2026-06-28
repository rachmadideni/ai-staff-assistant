# Components — Apple HIG

## Buttons

### Primary Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 24px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.8;
}

.btn-primary:active {
  transform: scale(0.98);
}
```

### Secondary Button
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 24px;
  background: transparent;
  color: var(--accent);
  border: none;
  font-size: 17px;
  font-weight: 400;
  cursor: pointer;
}
```

### Destructive Button
```css
.btn-destructive {
  background: var(--error);
  color: white;
}
```

### Button Rules
- **One primary CTA** per screen
- **Minimum 44px height** for touch
- **Clear labels** — action verbs ("Save", "Delete", "Cancel")
- **No icons** unless necessary for clarity

---

## Cards

### Standard Card
```css
.card {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
```

### Elevated Card
```css
.card-elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
```

### Card with Image
```css
.card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}
```

### Card Rules
- **Use sparingly** — only for grouped content
- **Consistent padding** — 16px inside
- **Subtle shadows** — never heavy
- **No borders** — use shadow for elevation

---

## Lists

### Standard List
```css
.list {
  background: var(--bg-tertiary);
  border-radius: 12px;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  min-height: 44px;
  border-bottom: 0.5px solid var(--separator);
}

.list-item:last-child {
  border-bottom: none;
}
```

### List Item with Icon
```css
.list-icon {
  width: 24px;
  height: 24px;
  color: var(--accent);
  flex-shrink: 0;
}
```

### List Item with Accessory
```css
.list-accessory {
  margin-left: auto;
  color: var(--text-tertiary);
}
```

### List Rules
- **44px minimum height** for touch
- **Consistent spacing** between items
- **Clear visual separation** with separators
- **Icons on left**, accessories on right

---

## Navigation

### Top Navigation Bar
```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 0 16px;
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 0.5px solid var(--separator);
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  flex: 1;
}

.nav-action {
  font-size: 17px;
  color: var(--accent);
}
```

### Tab Bar
```css
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  min-height: 49px;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  border-top: 0.5px solid var(--separator);
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  color: var(--text-tertiary);
  font-size: 10px;
}

.tab.active {
  color: var(--accent);
}
```

### Navigation Rules
- **Sticky positioning** — always accessible
- **Blur effect** — content behind is visible
- **Clear hierarchy** — title centered, actions on sides
- **44px touch targets** for all interactive elements

---

## Forms

### Text Input
```css
.input {
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--separator-opaque);
  border-radius: 8px;
  font-size: 17px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: var(--accent);
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

### Select
```css
.select {
  appearance: none;
  width: 100%;
  min-height: 44px;
  padding: 12px 40px 12px 16px;
  background: var(--bg-tertiary) url("chevron.svg") no-repeat right 12px center;
  border: 1px solid var(--separator-opaque);
  border-radius: 8px;
  font-size: 17px;
  color: var(--text-primary);
  cursor: pointer;
}
```

### Form Rules
- **44px minimum height** for all inputs
- **Clear labels** above inputs
- **Helper text** below for guidance
- **Error states** with red border + message
- **No placeholder as label** — always visible labels

---

## Modals & Sheets

### Bottom Sheet (Mobile)
```css
.sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90vh;
  background: var(--bg-primary);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.sheet.open {
  transform: translateY(0);
}

.sheet-handle {
  width: 36px;
  height: 5px;
  margin: 8px auto;
  background: var(--separator-opaque);
  border-radius: 2.5px;
}
```

### Modal (Desktop)
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

### Modal Rules
- **Clear close action** — X button or swipe down
- **Dim background** — focus attention on modal
- **Escape to close** — keyboard accessibility
- **Single action** — one primary CTA per modal

---

## Toasts / Alerts

### Success Toast
```css
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.toast.show {
  opacity: 1;
}
```

### Toast Rules
- **Auto-dismiss** — 2-3 seconds
- **Non-blocking** — doesn't interrupt workflow
- **Single line** — brief message
- **Action optional** — "Undo" for reversible actions

---

## Component Checklist

Before shipping any component:

- [ ] **Touch target:** 44x44px minimum
- [ ] **State states:** Default, hover, active, disabled
- [ ] **Dark mode:** Supports both modes
- [ ] **Accessibility:** Keyboard navigation, screen reader
- [ ] **Loading state:** Skeleton or spinner
- [ ] **Empty state:** Designed, not blank
- [ ] **Error state:** Clear error message
- [ ] **Responsive:** Works on all screen sizes
