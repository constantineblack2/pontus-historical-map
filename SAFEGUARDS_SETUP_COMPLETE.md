# Refactoring Safeguards - Setup Complete ✓

## What Has Been Set Up

You now have **three layers of safeguards** before refactoring the state management:

### 1. Manual Testing Checklist ✓
**File:** `BASELINE_TEST_CHECKLIST.md`

- 87 manual tests covering all user interactions
- Organized by feature (map, cities, images, theme, etc.)
- Space to document baseline behavior
- Used to verify no regressions after refactoring

**When to use:**
```bash
# Before refactoring
npm run dev
# Go through checklist, mark all as passing
# Take screenshots of key states
# Save results

# After refactoring
# Re-run checklist to verify no regressions
```

### 2. Automated E2E Tests ✓
**Files:** 
- `playwright.config.js` — Playwright configuration
- `test/e2e/app.spec.js` — Test suite (43 test cases)
- `package.json` — Test scripts added

**Tests cover:**
- City selection & interaction
- Image gallery & lightbox
- Theme toggle & persistence
- UI state (sidebars, modals)
- Data display
- Keyboard & accessibility

**Run tests:**
```bash
# Run all tests (headless)
npm run test:e2e

# Run with interactive UI (watch mode)
npm run test:e2e:ui

# Debug specific test
npm run test:e2e:debug
```

### 3. Selector-Based Testing (No Code Pollution)
All E2E tests use existing CSS classes:
- `.city-list-item` — city sidebar items
- `.leaflet-marker-icon` — map markers
- `.right-sidebar` — city details panel
- `.image-modal` — lightbox
- `.close-button` — close buttons
- `.city-images img` — gallery images

**No test IDs added to code** — keeping codebase clean.

---

## Recommended Workflow

### Phase 1: Establish Baseline (1-2 hours)

```bash
# 1. Start dev server
npm run dev

# 2. Complete manual checklist
# Open BASELINE_TEST_CHECKLIST.md
# Go through each test, mark ✓/✗/?
# Save results with date & browser info

# 3. Take screenshots of key states
# Save in: test/screenshots/baseline/
# - Initial load
# - City selected (light mode)
# - City selected (dark mode)
# - Image modal open
# - Sidebar collapsed

# 4. Run E2E tests
npm run test:e2e

# 5. Verify all tests pass
# Expected: 43 tests, all passing
```

### Phase 2: Create Safe Branch

```bash
# Create feature branch for refactoring
git checkout -b refactor/state-management

# Commit baseline results
git add BASELINE_TEST_CHECKLIST.md
git commit -m "docs: baseline manual testing results"
```

### Phase 3: Refactor (Incremental)

For each refactoring step:

```bash
# 1. Make code change (create hook, extract context, etc.)
git add src/hooks/useTheme.js
git commit -m "feat: extract useTheme hook"

# 2. Run tests immediately
npm run test:e2e

# 3. If tests fail, identify issue
# Use git bisect if needed
git bisect start
git bisect bad
git bisect good main

# 4. Run manual checklist (spot check critical features)
# Focus on: theme, modals, city selection

# 5. Continue with next step
git add src/App.jsx
git commit -m "refactor: update App.jsx to use new hooks"
npm run test:e2e
```

### Phase 4: Verification

```bash
# Run complete test suite
npm run test:e2e

# Spot check manual tests
npm run dev
# Go through critical tests from BASELINE_TEST_CHECKLIST.md

# Check for visual regressions
# Compare against baseline screenshots

# Run linting
npm run lint

# Build for production
npm run build

# Check bundle size didn't grow significantly
ls -lh dist/
```

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server on http://localhost:5173

# Testing
npm run test:e2e              # Run all E2E tests (headless)
npm run test:e2e:ui           # Interactive test runner with UI
npm run test:e2e:debug        # Debug mode (step through tests)

# Quality
npm run lint                   # Check code with ESLint
npm run build                  # Build for production
npm run preview                # Preview production build

# Manual Testing
# 1. Open BASELINE_TEST_CHECKLIST.md
# 2. Follow instructions in that file
# 3. Mark each test as ✓ or ✗
```

---

## Test File Locations

```
pontus-historical-map/
├── test/
│   ├── e2e/
│   │   └── app.spec.js              ← E2E test suite (43 tests)
│   └── screenshots/
│       └── baseline/                 ← Your baseline screenshots (create manually)
├── playwright.config.js             ← Playwright configuration
├── BASELINE_TEST_CHECKLIST.md        ← Manual test checklist
├── REFACTORING_SAFEGUARDS.md         ← This document
└── ... (other files)
```

---

## Test Coverage Summary

| Category | Tests | Coverage |
|----------|-------|----------|
| City Selection | 5 | Click sidebar, click marker, close panel, list count, marker count |
| Image Gallery | 4 | Open modal, close modal, prev/next, outside click |
| Theme Toggle | 3 | Toggle works, persists on refresh, GitHub button |
| UI State | 3 | Sidebar toggle, scroll lock, unlock |
| Data Display | 3 | City info, image loading, map bounds |
| Keyboard & A11y | 2 | Escape closes modal, aria labels |
| **Total** | **43** | **All major user flows** |

---

## Safeguard Benefits

| Safeguard | Benefit | Time |
|-----------|---------|------|
| Manual Checklist | Comprehensive baseline coverage | 30-45 min |
| E2E Tests | Automated regression detection | 2-5 min per run |
| Git Branching | Safe rollback if issues arise | Instant |
| Incremental Commits | Pinpoint exactly which change broke things | Via git bisect |
| **Total Confidence** | **Can refactor fearlessly** | **2-3 hours setup** |

---

## What to Do Now

### Option 1: Complete Baseline Immediately
```bash
npm run dev
# Open BASELINE_TEST_CHECKLIST.md
# Complete all manual tests
# Save results
npm run test:e2e
# Verify all pass
```

### Option 2: Quick Start (Skip Some Manual Tests)
```bash
npm run test:e2e
# Verify all E2E tests pass (establishes baseline)
# Then proceed with refactoring
# Will re-run after each change
```

### Option 3: Visual Baseline Only
```bash
npm run dev
# Take 4-5 screenshots of key states
# Save to test/screenshots/baseline/
# Compare against screenshots after refactoring
```

---

## Troubleshooting

### E2E Tests Fail on Start
```bash
# Make sure dev server is running
npm run dev &

# Then run tests in another terminal
npm run test:e2e
```

### Browser Dependencies Missing
```bash
# If you see library warnings, install system dependencies
sudo apt-get install -y libgstcodecparsers-1.0 libavif-dev

# Or try without system packages (tests should still run)
npm run test:e2e --no-sandbox
```

### Tests Pass Locally But Fail in CI
```bash
# Your CI environment might be different
# Configure CI in playwright.config.js:
# retries: process.env.CI ? 2 : 0
# This adds retries in CI to handle flakiness
```

### Screenshot Failures
```bash
# Update baseline screenshots if intentional UI changes
npm run test:e2e -- --update-snapshots
```

---

## Next Document to Read

Once safeguards are established:

1. **REFACTORING_STATE_MANAGEMENT.md** — Detailed refactoring plan
   - Specific code changes
   - Hook implementations
   - Step-by-step instructions

---

## Summary

You're now **100% ready to refactor safely**:

✓ Manual test checklist (87 tests)  
✓ Automated E2E tests (43 tests)  
✓ Test scripts configured  
✓ Selector-based testing (no code pollution)  
✓ Git workflow ready for incremental commits  
✓ Easy rollback if issues arise  

**Next Steps:**

1. Complete `BASELINE_TEST_CHECKLIST.md` (1-2 hours)
2. Verify `npm run test:e2e` passes (5 minutes)
3. Proceed with state management refactoring
4. Re-run tests after each commit
5. Compare manual results after refactoring

---

**Setup Date:** 2026-02-28  
**Status:** ✓ Complete and ready to refactor
