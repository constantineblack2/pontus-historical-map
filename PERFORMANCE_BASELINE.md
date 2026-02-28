# Performance Baseline

**Date:** 2026-02-28  
**Commit:** Before optimizations  
**Run:** `npm run test:e2e -- test/e2e/performance.spec.js`

## Baseline Metrics

### 📊 Initial Page Load
- **DOM Content Loaded:** ~0.10ms
- **Load Complete:** ~0.00ms
- **Total Time:** ~500ms (varies: 435-501ms)

### 🖼️ Image Loading
- **Images in Panel:** 2
- **Image Load Time:** N/A (imgur external, varies by network)
- **Total Pixel Data:** 0 pixels (external service)

### 📍 Marker Rendering
- **Markers on Map:** 7
- **Render Time:** ~590ms (varies: 579-635ms)

### ⚡ Animation Frame Rate
- **FPS:** ~24 FPS (headless mode, actual browser: ~60 FPS)

### 💾 DOM & Memory
- **DOM Nodes:** 144
- **Document Size:** 50.42 KB

---

## Key Observations

1. **Page loads in ~500ms** — Good baseline
2. **Markers render at ~590ms** — Icons created on render, potential for memoization
3. **7 markers for 7 cities** — Fixed count, no scaling issue
4. **50KB document** — Reasonable size for interactive app
5. **Images external (imgur)** — Lazy loading will help if users have many images

---

## Optimizations to Measure

After implementing these optimizations, re-run and compare:

1. ✅ **Lazy load images** — Should reduce initial image loading
2. ✅ **Memoize marker icons** — Should reduce marker render time
3. ✅ **Respect prefers-reduced-motion** — No performance impact (just conditional logic)

---

## How to Compare

```bash
# Run baseline again (you are here)
npm run test:e2e -- test/e2e/performance.spec.js

# After optimization #1:
git add -A && git commit -m "perf: lazy load images"
npm run test:e2e -- test/e2e/performance.spec.js
# Compare: Image load times should improve

# After optimization #2:
git add -A && git commit -m "perf: memoize marker icons"
npm run test:e2e -- test/e2e/performance.spec.js
# Compare: Marker render time should improve

# After optimization #3:
git add -A && git commit -m "perf: respect prefers-reduced-motion"
npm run test:e2e -- test/e2e/performance.spec.js
# Compare: No change expected (just a11y improvement)
```

Then review git log to see improvements in commit history.
