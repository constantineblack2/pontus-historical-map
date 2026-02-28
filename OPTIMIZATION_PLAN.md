# Performance Optimization Plan

## 1. Respect `prefers-reduced-motion` (Accessibility)

### Issue
Users with motion sensitivity have animations enabled. Can cause vestibular discomfort.

### Implementation
**Create custom hook:**
```javascript
// src/hooks/useReducedMotion.js
import { useState, useEffect } from 'react';

export const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Check on mount
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    // Listen for changes
    const handler = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
};
```

**Usage in App.jsx:**
```javascript
const prefersReduced = useReducedMotion();

// In sidebar animation:
<motion.div
  transition={{
    duration: prefersReduced ? 0 : ANIMATION.SIDEBAR_DURATION,
    ease: ANIMATION.SIDEBAR_EASING
  }}
>
```

**Or create animation helper:**
```javascript
// src/utils/animationUtils.js
export const getDuration = (baseDuration, prefersReduced) => {
  return prefersReduced ? 0 : baseDuration;
};

// In component:
<motion.div
  transition={{
    duration: getDuration(ANIMATION.SIDEBAR_DURATION, prefersReduced)
  }}
>
```

### Changes Needed
1. Create `src/hooks/useReducedMotion.js`
2. Add to App.jsx: `const prefersReduced = useReducedMotion();`
3. Update all motion.div transitions with conditional duration
4. Test: Browser DevTools → More Tools → Rendering → Emulate CSS media feature prefers-reduced-motion

### Impact
- ✓ Better accessibility (WCAG compliance)
- ✓ No performance cost (just conditional logic)
- ✓ Minimal code changes

---

## 2. Lazy Load Images

### Issue
All images load immediately, even if not visible:
- Users scroll to see "more images" but they're already loading
- Wastes bandwidth for users who don't scroll
- Slows initial page load

### Implementation

**Option A: HTML `loading="lazy"` attribute (Simplest)**
```javascript
// In App.jsx city-images section:
<img
  src={img}
  loading="lazy"  // ← Add this
  alt={`${selectedCity.name} - view ${index + 1}`}
/>
```

**Browser support:** Chrome 76+, Firefox 75+, Safari 15.1+

**Option B: Intersection Observer (More control)**
```javascript
// src/hooks/useImageLazyLoad.js
import { useEffect, useRef, useState } from 'react';

export const useImageLazyLoad = () => {
  const imageRef = useRef(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSrc(imageRef.current?.dataset.src);
        observer.unobserve(imageRef.current);
      }
    }, { rootMargin: '50px' });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return [imageRef, src];
};

// Usage:
const [imageRef, src] = useImageLazyLoad();
<img
  ref={imageRef}
  data-src={img}
  src={src || 'placeholder.png'}
  alt={...}
/>
```

### Recommendation
Use **Option A** (HTML attribute) — simplest, browser-native, no code changes.

### Changes Needed
1. Add `loading="lazy"` to 3 img locations in App.jsx:
   - Line ~230: Primary images in city-images
   - Line ~267: More images grid
   - (Already has placeholder logic with onError)

### Impact
- ✓ Images only load when entering viewport
- ✓ ~20-30% faster initial load (depending on user)
- ✓ One-line changes, zero dependencies

---

## 3. Memoize Marker Icons

### Issue
Marker icons created on every render:
```javascript
// Current: Bad
const ponticIcon = new L.DivIcon({ ... });  // Created every render!

function App() {
  // ponticIcon recreated on every state change
}
```

### Implementation

**Create icons as constants outside component:**
```javascript
// src/components/markers.js (new file)
import L from 'leaflet';

const createPonticIcon = (isDark = false) => {
  if (isDark) {
    return new L.DivIcon({
      className: 'custom-pontic-marker-dark',
      html: `
        <div class="marker-container-dark">
          <div class="marker-dot-dark"></div>
          <div class="marker-ring-dark"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  }

  return new L.DivIcon({
    className: 'custom-pontic-marker',
    html: `
      <div class="marker-container">
        <div class="marker-dot"></div>
        <div class="marker-ring"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

export { createPonticIcon };
```

**Use in App.jsx with useMemo:**
```javascript
import { useMemo } from 'react';
import { createPonticIcon } from './components/markers';

function App() {
  const { isDark } = useThemeContext();

  // Memoize: only recreate when darkMode changes
  const markerIcon = useMemo(() => createPonticIcon(isDark), [isDark]);

  // In JSX:
  <Marker
    icon={markerIcon}
    // ... rest
  />
}
```

### Alternative: Create as module-level (even better)
```javascript
// src/components/markers.js
const ponticIconLight = new L.DivIcon({...});
const ponticIconDark = new L.DivIcon({...});

export { ponticIconLight, ponticIconDark };

// In App.jsx:
import { ponticIconLight, ponticIconDark } from './components/markers';

<Marker icon={darkMode ? ponticIconDark : ponticIconLight} />
```

### Changes Needed
1. Create `src/components/markers.js` with icon definitions
2. Delete hardcoded icon creation from App.jsx (lines 11-35)
3. Import icons in App.jsx
4. Update Marker component to use imported icon

### Impact
- ✓ Icons created once, reused forever (or only when theme changes)
- ✓ Eliminates unnecessary object allocation per render
- ✓ Tiny performance gain (~1-2ms per render)
- ✓ Code more organized

---

## Implementation Order

### Phase 1: Quick wins (5 min each)
1. **Lazy load images** — Add `loading="lazy"` (3 lines)
2. **Extract marker icons** — Move to constants (organize code)

### Phase 2: Accessibility (10 min)
3. **Respect prefers-reduced-motion** — Update animations (add hook, update transitions)

### Estimated Total Time
- **Lazy load:** 2 minutes
- **Memoize icons:** 10 minutes
- **Reduce motion:** 15 minutes
- **Testing:** 5 minutes
- **Total:** ~30 minutes

### Bundle Size Impact
- Lazy load: -0 KB (native feature)
- Memoize icons: -0 KB (just reorganization)
- Reduce motion: +0.2 KB (small hook)
- **Net: neutral or slightly smaller**

---

## Testing

### prefers-reduced-motion
```javascript
// In browser DevTools console:
window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Should return: true (if enabled)

// Or use DevTools:
F12 → More tools → Rendering → Emulate CSS media feature prefers-reduced-motion: reduce
```

### Lazy load images
```bash
# DevTools Network tab, filter by images
# Before: All images load immediately
# After: Images load only when scrolling into view
```

### Memoize icons
```bash
# DevTools Performance profiler
# Before: Icon creation on every render
# After: Icon creation only when theme changes
```

---

## Rollback Plan

Each change is independent:
- Remove `loading="lazy"` → back to eager loading
- Revert marker.js → inline icons again
- Remove useReducedMotion → animations always on

No breaking changes. Safe to implement incrementally.
