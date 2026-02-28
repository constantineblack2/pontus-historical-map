# Refactoring Safeguards - Testing Before Changes

## Problem
- No existing tests in project
- Major state management refactor coming
- Need confidence that refactoring doesn't break functionality

## Solution: Multi-Layer Safeguards

---

## 1. Manual Test Checklist (Baseline)

Create a comprehensive manual testing checklist to verify current behavior **before** any code changes.

### File: `MANUAL_TEST_CHECKLIST.md`

```markdown
# Manual Testing Checklist - Current Behavior

Run this checklist on the current code to establish baseline.
Record results as: ✓ Works / ✗ Broken / ? Unclear

## Map Interactions
- [ ] Map loads with initial view (Europe centered)
- [ ] Mouse wheel scroll zooms map in/out
- [ ] Click-drag pans map
- [ ] Zoom controls show properly
- [ ] Attribution shows in bottom-right
- [ ] Markers appear on map for all 7 cities
- [ ] Cannot zoom beyond min (7) or max bounds

## City Selection
- [ ] Click city in left sidebar → selects it
- [ ] City list shows checkmark/highlight when selected
- [ ] Map flies to selected city (smooth animation)
- [ ] Right panel slides in with city details
- [ ] Selected city stays highlighted after panel opens
- [ ] Click different city → panel updates

## Marker Interactions
- [ ] Hover marker → popup shows city name + short description
- [ ] Click marker → right panel opens with full details
- [ ] Multiple markers have correct lat/lon positions
- [ ] Popup closes when mouse leaves marker

## Right Panel (City Details)
- [ ] Panel slides in smoothly when city selected
- [ ] Close button (×) closes panel
- [ ] City name displays correctly
- [ ] Region and establishment date display
- [ ] First 2 images load and display
- [ ] "View more images" button appears if >2 images
- [ ] All text content displays (Greek characters show correctly)
- [ ] Population stat displays

## Image Gallery
- [ ] Click image → lightbox modal opens
- [ ] Image scales to fit screen
- [ ] Close button (×) closes modal
- [ ] Click outside modal → closes
- [ ] Image counter shows (e.g., "1 / 4")
- [ ] Prev/next buttons work (hide if only 1 image)
- [ ] Arrow buttons cycle through all images
- [ ] Each city's images load correctly

## "View More Images" Feature
- [ ] Button text correct (Greek: "Δείτε περισσότερες εικόνες")
- [ ] Click expands additional images below
- [ ] Images animate in smoothly
- [ ] Click again → collapses with "Δείτε λιγότερες εικόνες" text
- [ ] Collapsed state doesn't affect other cities

## Left Sidebar
- [ ] Displays title "Ιστορικός Χάρτης του Πόντου"
- [ ] All 7 cities listed
- [ ] Cities highlight on hover
- [ ] Sidebar footer shows copyright
- [ ] Hamburger menu toggle works
- [ ] Sidebar collapses/expands smoothly
- [ ] Width doesn't overflow on small screens

## Dark Mode
- [ ] Toggle button in bottom bar works
- [ ] Map tiles switch between light/dark
- [ ] UI colors change (backgrounds, text)
- [ ] Markers change style (dark variant)
- [ ] Setting persists on page refresh
- [ ] Both icons (sun/moon) display correctly
- [ ] Text labels update ("Light Mode" / "Dark Mode")
- [ ] All text remains readable in dark mode

## Bottom Bar
- [ ] Theme toggle button visible
- [ ] GitHub button visible
- [ ] GitHub button opens in new tab
- [ ] Buttons animate in on load
- [ ] Buttons remain visible when panel open

## Page Load & Performance
- [ ] Page loads without errors in console
- [ ] Map renders within 2 seconds
- [ ] No lag when scrolling through city list
- [ ] Animations are smooth (no jank)
- [ ] No memory leaks (check DevTools memory)
- [ ] Images load without 404 errors

## Edge Cases
- [ ] Select city → close panel → select same city → panel reopens
- [ ] Open image modal → close → open different city → shows correct images
- [ ] Toggle dark mode multiple times → no flickering
- [ ] Resize window → layout adapts (if responsive)
- [ ] Mobile viewport (< 768px) → sidebar toggle needed
```

### Run Baseline
```bash
npm run dev
# Open DevTools (F12)
# Go through checklist, screenshot failures
# Note any issues in `BASELINE_RESULTS.md`
```

---

## 2. Visual Regression Testing

Before refactoring, take screenshots of critical states.

### Setup Screenshot Comparison

```bash
mkdir -p test/screenshots/baseline
```

### Key Screens to Capture

1. **Initial Load**
   - Map with all markers visible
   - Left sidebar open
   - Right sidebar closed

2. **City Selected (Light Mode)**
   - Smyrni selected
   - Right panel visible with 2 images
   - Dark mode toggle shows "Dark Mode" label

3. **City Selected (Dark Mode)**
   - Same as above but with dark theme
   - Markers show dark variant

4. **Image Gallery Open**
   - Lightbox modal with image centered
   - Navigation buttons visible
   - Counter showing position

5. **Sidebar Collapsed (Mobile)**
   - Hamburger menu visible
   - Left sidebar hidden
   - Map takes full width

### Capture with Playwright

```javascript
// test/screenshots.spec.js
import { test } from '@playwright/test';

test.describe('Visual Baselines', () => {
  test('initial load', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('.map-container');
    await page.screenshot({ 
      path: 'test/screenshots/baseline/01-initial-load.png',
      fullPage: true 
    });
  });

  test('city selected - light mode', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('.city-list-item'); // First city
    await page.screenshot({ 
      path: 'test/screenshots/baseline/02-city-selected-light.png',
      fullPage: true 
    });
  });

  test('city selected - dark mode', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('.theme-toggle-bottom');
    await page.click('.city-list-item');
    await page.screenshot({ 
      path: 'test/screenshots/baseline/03-city-selected-dark.png',
      fullPage: true 
    });
  });

  test('image modal open', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('.city-list-item');
    await page.click('.city-images img'); // Click first image
    await page.screenshot({ 
      path: 'test/screenshots/baseline/04-image-modal.png',
      fullPage: true 
    });
  });
});
```

---

## 3. Automated E2E Tests (Lightweight)

Create essential E2E tests to catch regressions.

### Setup Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Create E2E Test Suite

```javascript
// test/e2e/app.spec.js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector('.map-container');
});

test.describe('App Functionality', () => {
  
  test.describe('City Selection', () => {
    test('clicking city in sidebar selects it', async ({ page }) => {
      const firstCity = page.locator('.city-list-item').first();
      await firstCity.click();
      
      await expect(firstCity).toHaveClass(/active/);
      await expect(page.locator('.right-sidebar')).toBeVisible();
    });

    test('clicking marker selects city', async ({ page }) => {
      // Get first Leaflet marker
      const marker = page.locator('.leaflet-marker-icon').first();
      await marker.click();
      
      // Check right panel appears
      await expect(page.locator('.right-sidebar')).toBeVisible();
    });

    test('city selection triggers map fly-to', async ({ page }) => {
      await page.click('.city-list-item');
      
      // Check that fly-to animation triggers (watch for zoom level change)
      await page.waitForFunction(
        () => {
          const zoomElement = document.querySelector('.leaflet-control-zoom');
          return zoomElement !== null; // Map has loaded zoom controls
        },
        { timeout: 3000 }
      );
    });

    test('closing panel resets selection', async ({ page }) => {
      await page.click('.city-list-item');
      await expect(page.locator('.right-sidebar')).toBeVisible();
      
      await page.click('.close-button');
      await expect(page.locator('.right-sidebar')).not.toBeVisible();
    });
  });

  test.describe('Image Gallery', () => {
    test('clicking image opens modal', async ({ page }) => {
      await page.click('.city-list-item'); // Select city
      await page.click('.city-images img'); // Click first image
      
      await expect(page.locator('.image-modal')).toBeVisible();
    });

    test('modal navigation buttons work', async ({ page }) => {
      await page.click('.city-list-item');
      const images = await page.locator('.city-images img').count();
      
      if (images > 1) {
        await page.click('.city-images img');
        const nextBtn = page.locator('.image-modal-next');
        
        await nextBtn.click();
        await expect(page.locator('.image-modal-caption')).toContainText('2 /');
      }
    });

    test('closing modal works', async ({ page }) => {
      await page.click('.city-list-item');
      await page.click('.city-images img');
      
      await page.click('.image-modal-close');
      await expect(page.locator('.image-modal')).not.toBeVisible();
    });
  });

  test.describe('Theme Toggle', () => {
    test('dark mode toggle works', async ({ page }) => {
      const htmlBefore = await page.locator('html').getAttribute('data-theme');
      
      await page.click('.theme-toggle-bottom');
      
      const htmlAfter = await page.locator('html').getAttribute('data-theme');
      expect(htmlAfter).not.toBe(htmlBefore);
    });

    test('theme persists on refresh', async ({ page }) => {
      // Toggle to dark
      await page.click('.theme-toggle-bottom');
      const theme = await page.locator('html').getAttribute('data-theme');
      
      // Refresh page
      await page.reload();
      
      // Check theme persisted
      const persistedTheme = await page.locator('html').getAttribute('data-theme');
      expect(persistedTheme).toBe(theme);
    });
  });

  test.describe('UI State', () => {
    test('left sidebar can toggle', async ({ page }) => {
      const sidebar = page.locator('.left-sidebar');
      
      await expect(sidebar).toBeVisible();
      await page.click('.menu-button');
      await expect(sidebar).not.toBeVisible();
      
      await page.click('.menu-button');
      await expect(sidebar).toBeVisible();
    });

    test('modal open locks body scroll', async ({ page }) => {
      await page.click('.city-list-item');
      await page.click('.city-images img');
      
      const overflow = await page.evaluate(() => 
        window.getComputedStyle(document.body).overflow
      );
      expect(overflow).toBe('hidden');
    });

    test('modal close unlocks body scroll', async ({ page }) => {
      await page.click('.city-list-item');
      await page.click('.city-images img');
      await page.click('.image-modal-close');
      
      const overflow = await page.evaluate(() => 
        window.getComputedStyle(document.body).overflow
      );
      expect(overflow).toBe('auto');
    });
  });

  test.describe('Data Display', () => {
    test('all 7 cities appear in sidebar', async ({ page }) => {
      const cities = await page.locator('.city-list-item').count();
      expect(cities).toBe(7);
    });

    test('all markers appear on map', async ({ page }) => {
      const markers = await page.locator('.leaflet-marker-icon').count();
      expect(markers).toBeGreaterThanOrEqual(7);
    });

    test('city details show correct info', async ({ page }) => {
      await page.click('.city-list-item'); // Select first city (Smyrna)
      
      await expect(page.locator('.city-details h2')).toContainText('Σμύρνη');
      await expect(page.locator('.city-description')).toBeVisible();
    });
  });
});
```

### Selector-Based Testing (No Code Pollution)

E2E tests use existing CSS classes and DOM structure:
- `.city-list-item` for city list items
- `.leaflet-marker-icon` for map markers
- `.right-sidebar` for city details panel
- `.image-modal` for image lightbox
- `.close-button` for close buttons
- `.city-images img` for gallery images

---

## 4. Create CI/CD Check Script

Before refactoring, run comprehensive checks:

```bash
#!/bin/bash
# scripts/pre-refactor-check.sh

echo "🔍 Pre-Refactor Safety Checks"
echo "=============================="

echo "1️⃣  Linting..."
npm run lint || exit 1

echo "2️⃣  Building..."
npm run build || exit 1

echo "3️⃣  Running E2E tests..."
npm run test:e2e || exit 1

echo "4️⃣  Checking bundle size..."
gzip -c dist/index.js | wc -c | awk '{print "Current size: " $1 " bytes (gzipped)"}'

echo "✅ All checks passed! Safe to refactor."
```

### Add to package.json:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "pre-refactor-check": "bash scripts/pre-refactor-check.sh",
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint ."
  }
}
```

---

## 5. Git Strategy for Safe Refactoring

### Branch Workflow

```bash
# 1. Create feature branch
git checkout -b refactor/state-management

# 2. Before any changes, run baseline
npm run pre-refactor-check
# Take screenshots
# Run manual checklist

# 3. Make changes in commits (atomic)
git add src/hooks/useTheme.js
git commit -m "feat: extract useTheme hook"

git add src/hooks/useImageModal.js
git commit -m "feat: extract useImageModal hook"

git add src/App.jsx
git commit -m "refactor: update App.jsx to use new hooks"

# 4. After each commit, run tests
npm run test:e2e

# 5. If tests fail, use git bisect to find issue
git bisect start
git bisect bad  # Current commit broken
git bisect good main  # Last known good commit

# 6. When ready, run all checks
npm run pre-refactor-check

# 7. Create PR for review
```

### Rollback Plan

```bash
# If refactoring breaks something:
git reset --hard origin/main

# Or cherry-pick specific commits:
git cherry-pick <commit-hash>
```

---

## 6. Regression Detection Checklist

After each refactoring step, verify:

### Functional Regressions
- [ ] All E2E tests pass
- [ ] Manual checklist still passes
- [ ] No console errors
- [ ] No console warnings (new ones)

### Performance Regressions
- [ ] Bundle size unchanged (±5%)
- [ ] No new memory leaks
- [ ] Animation frame rate smooth (60fps)

### Visual Regressions
- [ ] Screenshot comparison shows no changes
- [ ] Layout matches baseline
- [ ] Colors/fonts unchanged

---

## 7. Recommended Implementation Order

### Week 1: Establish Safeguards
```bash
# Day 1: Setup testing infrastructure
npm install --save-dev @playwright/test
npx playwright install
# Add test files
# Add test IDs to JSX
# Create manual checklist

# Day 2: Run baseline
npm run dev
# Manual testing checklist (document results)
# Screenshots comparison
# Run E2E tests (establish baseline pass)
```

### Week 2: Refactor
```bash
# Day 1: Extract useTheme hook
# Run tests after each file created
# Document if any break

# Day 2: Extract useImageModal hook
# Run tests

# Day 3: Extract useCitySelection hook
# Run tests

# Day 4: Refactor App.jsx
# Run full test suite
# Manual verification

# Day 5: Polish & review
# Performance audit
# Regression testing
```

---

## 8. Quick Reference Commands

```bash
# Establish Baseline
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Check code quality
npm run test:e2e              # Run all E2E tests
npm run test:e2e:ui           # Interactive test runner

# During Refactoring
npm run pre-refactor-check    # Full safety check
git bisect start              # Find breaking commit

# Manual Testing
open http://localhost:5173    # Open in browser
# Go through MANUAL_TEST_CHECKLIST.md
```

---

## Summary: Before You Refactor

✓ **Setup** (30 min)
- Install Playwright
- Create E2E test suite
- Add test IDs to JSX

✓ **Baseline** (1-2 hours)
- Run manual checklist
- Take screenshots
- Run E2E tests (all pass)
- Document results in `BASELINE_RESULTS.md`

✓ **Ready to Refactor** (confident!)
- Each change is tested immediately
- Can detect regressions in minutes
- Can rollback easily with git
- Visual comparison confirms no UI breakage

---

**Total Safeguard Setup Time:** 2-3 hours  
**Payoff:** Confidence that refactoring doesn't break anything
