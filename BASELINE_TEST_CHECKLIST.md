# Manual Testing Checklist - Current Behavior Baseline

**Date:** 2026-02-28  
**Tester:** [Your Name]  
**Node Version:** 22.14.0  
**Browser:** Chrome/Firefox  

---

## Testing Instructions

1. Start dev server: `npm run dev`
2. Open http://localhost:5173 in browser
3. Open DevTools (F12) to check console for errors
4. Go through each section below
5. Mark tests as: ✓ Works / ✗ Broken / ? Unclear / N/A Not Applicable

---

## Map Interactions

- [ ] Map loads with Europe centered view
- [ ] Mouse wheel scroll zooms map in/out
- [ ] Click-drag pans map horizontally and vertically
- [ ] Zoom controls (+ -) buttons visible and work
- [ ] Attribution shows in bottom-right corner
- [ ] Markers appear on map for all 7 cities
- [ ] Cannot zoom beyond min zoom (7)
- [ ] Cannot pan beyond max bounds
- [ ] Tile layer loads (visible map background)

**Issues found:**
```

```

---

## City Selection & Interaction

- [ ] Click city name in left sidebar → right panel opens
- [ ] Selected city list item shows as active (highlighted)
- [ ] Map smoothly flies/animates to selected city
- [ ] Right sidebar slides in from right with animation
- [ ] Selected city stays highlighted while panel open
- [ ] Click different city → panel updates with new city data
- [ ] City name in panel matches clicked city
- [ ] Region and establishment date display

**Issues found:**
```

```

---

## Marker Interactions

- [ ] Hover over marker → popup appears with city name
- [ ] Popup shows short description (Greek text)
- [ ] All 7 markers have correct positions on map
- [ ] Click marker → right panel opens
- [ ] Marker in panel matches clicked marker
- [ ] Popup closes when mouse leaves marker

**Issues found:**
```

```

---

## Right Panel (City Details)

- [ ] Panel slides in smoothly from right side
- [ ] Close button (×) visible in top-right
- [ ] City name displays correctly
- [ ] Region (e.g., "Ιωνία") displays
- [ ] Established date displays (e.g., "~3000 π.Χ.")
- [ ] 2 primary images load and display
- [ ] Images are clickable (cursor changes to pointer)
- [ ] If city has >2 images, "View more" button appears
- [ ] Long description text displays
- [ ] Population stat displays (e.g., "~300,000 (1922)")
- [ ] Greek characters render correctly (no mojibake)
- [ ] Panel doesn't overflow on smaller windows

**Issues found:**
```

```

---

## Image Gallery & Lightbox

- [ ] Click image in panel → lightbox modal opens
- [ ] Image scales to fit screen without overflow
- [ ] Close button (×) in modal works
- [ ] Click outside modal → modal closes
- [ ] Image counter shows position (e.g., "1 / 4")
- [ ] If only 1 image, prev/next buttons don't show (or disabled)
- [ ] If >1 image, prev/next buttons visible and work
- [ ] Prev button cycles backward through images
- [ ] Next button cycles forward through images
- [ ] Last image → next wraps to first image
- [ ] First image → prev wraps to last image
- [ ] Modal has proper backdrop/overlay

**Issues found:**
```

```

---

## View More Images Feature

- [ ] "View More" button appears for cities with >2 images
- [ ] Button text is Greek: "Δείτε περισσότερες εικόνες"
- [ ] Click expands grid of additional images below
- [ ] Images animate in with stagger effect
- [ ] Grid layout is responsive
- [ ] Click "View Less" collapses the grid
- [ ] Text updates to "Δείτε λιγότερες εικόνες"
- [ ] Expanded images are clickable (open in modal)
- [ ] Feature works independently per city
- [ ] Collapsing doesn't affect other cities

**Issues found:**
```

```

---

## Left Sidebar

- [ ] Title "Ιστορικός Χάρτης" displays
- [ ] Subtitle "του Πόντου" displays
- [ ] Subtitle "Επτά σημαντικές πόλεις" displays
- [ ] All 7 cities listed
- [ ] City names display correctly (Greek)
- [ ] Cities highlight/animate on hover
- [ ] Sidebar footer shows copyright "© 2026 • Giachasidis Project"
- [ ] Hamburger menu button visible
- [ ] Click hamburger → sidebar collapses smoothly
- [ ] Sidebar moves off-screen with animation
- [ ] Click hamburger again → sidebar expands
- [ ] Sidebar width appropriate on desktop

**Issues found:**
```

```

---

## Dark Mode / Theme

- [ ] Theme toggle button in bottom bar works
- [ ] Clicking button toggles between light/dark
- [ ] Map tiles switch (light theme → dark tiles, vice versa)
- [ ] UI backgrounds change (light/dark)
- [ ] Text colors change (contrast maintained)
- [ ] Markers change appearance (dark variant shows)
- [ ] Marker rings visible in both modes
- [ ] All UI elements readable in dark mode
- [ ] Popup styles adapt to theme
- [ ] Modal background adapts to theme
- [ ] Theme selection persists on page refresh (localStorage)
- [ ] Icon changes (sun ↔ moon)
- [ ] Button text updates ("Light Mode" / "Dark Mode")

**Issues found:**
```

```

---

## Bottom Bar Controls

- [ ] Bottom bar visible at bottom of screen
- [ ] Theme toggle button visible with icon
- [ ] GitHub button visible with icon
- [ ] GitHub button opens external link in new tab
- [ ] Both buttons animate in on page load
- [ ] Buttons remain visible when city panel open
- [ ] Buttons are accessible (good hit size)
- [ ] Icons clear and recognizable

**Issues found:**
```

```

---

## Page Performance

- [ ] Page loads without JavaScript errors (console clean)
- [ ] No warnings in console (or only expected ones)
- [ ] Map renders within 2-3 seconds
- [ ] Sidebar list items animate smoothly (no jank)
- [ ] City selection animation is smooth
- [ ] Image modal opens without lag
- [ ] Image switching is instant
- [ ] Dark mode toggle is instant
- [ ] No memory leaks (check DevTools memory over 2+ min)

**Issues found:**
```

```

---

## Edge Cases

- [ ] Select city → close panel → select same city → panel reopens
- [ ] Open image modal → close → open different city → correct images shown
- [ ] Toggle dark mode multiple times → no visual glitches
- [ ] Click marker while panel open → updates to new city
- [ ] Rapidly click different cities → panel updates correctly
- [ ] Resize window while modal open → modal stays centered
- [ ] Toggle sidebar while modal open → modal unaffected
- [ ] Zoom in/out while city selected → marker stays visible

**Issues found:**
```

```

---

## Responsive Design (if testing on different viewport sizes)

**Desktop (1920x1080):**
- [ ] Layout optimal
- [ ] All elements visible
- [ ] No overflow issues

**Tablet (768x1024):**
- [ ] Sidebar width appropriate
- [ ] Map controls visible
- [ ] Panel doesn't overlap map too much

**Mobile (375x667):**
- [ ] Hamburger menu necessary and works
- [ ] Sidebar toggleable
- [ ] Panel doesn't overflow screen
- [ ] Touch interactions work (if applicable)

**Issues found:**
```

```

---

## Browser Console

**Errors:** (Should be empty)
```

```

**Warnings:** (Note any unexpected ones)
```

```

**Network Issues:** (Image 404s, failed requests)
```

```

---

## Summary

**Total Tests:** 87  
**Passed:** ___  
**Failed:** ___  
**Issues:** ___  

---

## Critical Issues (Must Fix Before Refactoring)

List any issues that block refactoring:

1. 
2. 
3. 

---

## Non-Critical Issues (Can Address Later)

List any issues that can be addressed after refactoring:

1. 
2. 
3. 

---

## Sign Off

I confirm that I have tested the above checklist and documented all findings.

**Tester Name:** _________________  
**Date:** _________________  
**Time Spent:** _________________  

---

## Next Steps

Once this baseline is complete:

1. Commit this checklist to git with baseline results
2. Create branch for refactoring
3. Run E2E tests: `npm run test:e2e`
4. After refactoring, re-run this checklist
5. Compare results to ensure no regressions
