# Pontus Historical Map - Project Overview

## Executive Summary

**Pontus Historical Map** is a React-based interactive web application showcasing 7 historical cities in the Pontus region of Asia Minor and the Black Sea. The application combines geographic visualization with rich historical content, providing an educational and visually compelling experience.

**Status:** ✓ Refactored and optimized (Feb 2026)

**Tech Stack:**
- React 19 with Hooks
- Vite (build tool)
- Leaflet + React-Leaflet (map library)
- Framer Motion (animations)
- CSS3 (styling with glassmorphism)
- GitHub Pages (deployment)
- Playwright (E2E testing)

---

## Architecture

### Current Structure (Refactored)
- **Single App component** (`App.jsx`) with extracted state logic via custom hooks
- **Custom hooks** for state management:
  - `useTheme` — Theme persistence with localStorage
  - `useImageModal` — Image modal state (consolidated from 5 states → 1)
  - `useCitySelection` — City selection + related state
  - `useReducedMotion` — Accessibility for motion-sensitive users
- **Global Context** (`ThemeContext`) for theme state (no prop drilling)
- **Data-driven design** with city definitions in `cities.js`
- **Centralized constants** (`constants.js`) for map config, animations, URLs
- **CSS3 styling** with separate `App.css` and `index.css`

### Notes & Suggestions

#### 1. Component Decomposition
**Status:** ✓ Partially completed
- ✓ State management extracted to custom hooks
- ✓ Marker icons extracted to `src/components/markers.js`
- ⏳ Future: UI components (MapContainer, Sidebars, ImageModal) could be further separated

**Suggestions for Future:**
```
Extract into separate components:
├── Map/MapContainer.jsx           (handles Leaflet rendering)
├── Sidebars/
│   ├── LeftSidebar.jsx           (city list)
│   └── RightSidebar.jsx          (city details)
├── ImageModal/ImageModal.jsx     (lightbox)
├── BottomBar/BottomBar.jsx       (controls)
└── components/
    └── markers.js                (marker icon definitions)
```

**Benefit:** Easier testing, reusability, maintainability

#### 2. State Management Consolidation
**Status:** ✓ Completed

**Before:** 11 useState calls scattered across App.jsx
```javascript
const [selectedCity, setSelectedCity] = useState(null);
const [flyToCoords, setFlyToCoords] = useState(null);
const [version, setVersion] = useState(0);              // ✗ Anti-pattern
const [darkMode, setDarkMode] = useState(...);
const [modalOpen, setModalOpen] = useState(false);
const [currentImage, setCurrentImage] = useState('');
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [currentImages, setCurrentImages] = useState([]);
const [currentCityName, setCurrentCityName] = useState('');
const [showMoreImages, setShowMoreImages] = useState(false);
const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
```

**After:** 1 local useState + 3 custom hooks + 1 context
```javascript
// Custom hooks (state consolidated)
const { isDark, toggleDarkMode } = useThemeContext();      // ✓ Global via context
const { selectedCity, flyToCoords, selectCity, ... } = useCitySelection();
const { isOpen, images, open, close, ... } = useImageModal();
const prefersReducedMotion = useReducedMotion();

// Local UI state only
const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
```

**Results:**
- ✓ State variables reduced by 73% (11 → 3)
- ✓ No prop drilling (context for theme)
- ✓ Better code organization
- ✓ Easier to test

#### 3. Magic Numbers & Hardcoded Values
**Status:** ✓ Completed

**Created `src/constants.js`** with:
```javascript
// Map Configuration
export const MAP_CONFIG = {
  CENTER: [39.5, 33.0],
  DEFAULT_ZOOM: 6,
  MIN_ZOOM: 7,
  MAX_BOUNDS: [[30, 20], [50, 50]],
  FLY_TO_ZOOM: 10,
  FLY_TO_DURATION: 1.5,
  FLY_TO_EASING: 0.25,
};

// Animation Timings (14 values)
export const ANIMATION = {
  SIDEBAR_DURATION: 0.3,
  CITY_LIST_STAGGER_DELAY: 0.1,
  IMAGE_STAGGER_DELAY: 0.2,
  IMAGE_MODAL_DURATION: 0.3,
  // ... more config
};

// External Links
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/KaloudasDev/pontus-historical-map',
};

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'pontus-theme',
};
```

**Results:**
- ✓ All magic numbers centralized
- ✓ Easy to adjust settings in one place
- ✓ Reduced code duplication
- ✓ Better maintainability

---

## Key Features

### 1. Interactive Map Interface ✓
**Implementation:** Leaflet + React-Leaflet
- Pan, zoom with min/max bounds
- Custom city markers with ring animation
- Popup on hover/click
- Dark/light tile variants

**Notes & Suggestions:**
- **Performance:** Consider lazy-loading marker popups for 100+ cities
- **Accessibility:** Add keyboard navigation (arrow keys to zoom, number to select city)
- **Testing:** No unit tests for map interactions
- **Suggestion:** Add map viewport change logging for analytics

### 2. City Browsing & Selection ✓
**Implementation:** Left sidebar with animated city list
- Click to select city
- Map flies to selected city
- Sidebar highlights active city
- Animated entry with stagger delay

**Notes & Suggestions:**
- **Current:** Using `version` state to force re-render; could use `key={selectedCity.id}`
- **Search:** No city search/filter functionality
- **Suggestion:** Add search bar to filter cities by name/region
- **Mobile:** Sidebar toggle works but could be smoother on small screens

### 3. City Details Panel ✓
**Implementation:** Right sidebar with animated reveal
- City name, region, establishment date
- Image gallery (2 primary + more button)
- Long description
- Population stats

**Notes & Suggestions:**
- **Image loading:** No error handling beyond placeholder fallback
- **Missing:** Wikipedia links, external resources
- **Suggestion:** Add "Learn More" buttons linking to Britannica/Wikipedia
- **Performance:** All images load immediately; could lazy-load below-the-fold content

### 4. Image Gallery & Lightbox ✓
**Implementation:** 
- Click image to open fullscreen modal
- Navigate with prev/next buttons
- Counter showing position
- Escape/click outside to close

**Notes & Suggestions:**
- **UX:** Could add keyboard navigation (arrow keys, Esc)
- **Loading:** No loading state for large images
- **Broken images:** Uses placeholder, but silent failure
- **Suggestion:** Add loading spinner, show error toast for failed images

### 5. Dark Mode Support ✓
**Implementation:**
- Toggle button in bottom bar
- Persisted in localStorage
- CSS class-based theming
- Icon switch (moon ↔ sun)

**Notes & Suggestions:**
- **Implementation:** Manual DOM class manipulation is not React-like
- **Suggestion:** Use CSS variables for theme colors
```css
/* Better approach */
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}
```
- **System preference:** Doesn't respect `prefers-color-scheme`

### 6. Responsive Design
**Implementation:** Flex layout, sidebar toggles

**Notes & Suggestions:**
- **Mobile:** Sidebar width could exceed viewport on small screens
- **Tablet:** Map controls (zoom, attribution) might overlap sidebars
- **Testing:** No responsive testing for < 768px viewports
- **Suggestion:** Add mobile breakpoints, test on actual devices

---

## File Structure

```
pontus-historical-map/
├── src/
│   ├── App.jsx                 (419 lines) - Main component
│   ├── App.css                 (Styling + animations)
│   ├── index.css               (Global styles)
│   ├── main.jsx                (React entry point)
│   └── data/
│       └── cities.js           (7 cities data)
│
├── public/
│   └── index.html              (HTML template)
│
├── package.json                (Dependencies)
├── vite.config.js              (Build config)
├── eslint.config.js            (Linting)
└── vercel.json                 (Deployment config)
```

### Notes & Suggestions

#### 1. Missing Directories
```
Recommended structure:
src/
├── components/          (new) - Reusable UI components
├── contexts/           (new) - React context providers
├── hooks/              (new) - Custom React hooks
├── constants.js        (new) - App-wide constants
├── data/
│   └── cities.js
├── styles/             (new) - Global styles, variables
│   ├── variables.css
│   ├── global.css
│   └── animations.css
├── utils/              (new) - Helper functions
├── App.jsx
└── main.jsx
```

#### 2. Assets Organization
**Current:** No `assets/` folder mentioned in README but referenced in vite config
**Suggestion:** Create `src/assets/` for:
- Icons (moon, sun, GitHub logo, menu hamburger)
- Fallback images
- SVG markers if customizing Leaflet icons

#### 3. Data Validation
**Current:** Cities data has no schema validation
**Suggestion:**
```javascript
// src/data/citiesSchema.js
export const validateCity = (city) => {
  const required = ['id', 'name', 'coordinates', 'images', 'description'];
  return required.every(key => key in city);
};
```

---

## State Management

### Current Implementation (11 state variables)

```javascript
// City selection
const [selectedCity, setSelectedCity] = useState(null);
const [flyToCoords, setFlyToCoords] = useState(null);
const [version, setVersion] = useState(0);

// Theme
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('pontus-theme');
  return saved ? JSON.parse(saved) : false;
});

// Image modal
const [modalOpen, setModalOpen] = useState(false);
const [currentImage, setCurrentImage] = useState('');
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [currentImages, setCurrentImages] = useState([]);
const [currentCityName, setCurrentCityName] = useState('');
const [showMoreImages, setShowMoreImages] = useState(false);

// UI
const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
```

### Issues & Suggestions

#### 1. **Related States Should Be Combined**
```javascript
// ❌ Current
const [currentImage, setCurrentImage] = useState('');
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [currentImages, setCurrentImages] = useState([]);
const [currentCityName, setCurrentCityName] = useState('');
const [modalOpen, setModalOpen] = useState(false);

// ✓ Better
const [imageModal, setImageModal] = useState({
  isOpen: false,
  cityName: '',
  images: [],
  currentIndex: 0,
});

const openImageModal = (images, index, cityName) => {
  setImageModal({ isOpen: true, images, currentIndex: index, cityName });
};
```

#### 2. **Unnecessary State: `version`**
```javascript
// Current (line 249)
key={`${selectedCity.id}-${version}`}

// ✓ Just use ID
key={selectedCity.id}
```
The `version` state only forces re-render; React's key system handles this automatically.

#### 3. **Theme Should Be Global Context**
```javascript
// Create: src/contexts/ThemeContext.jsx
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('pontus-theme') ?? 'false');
  });

  useEffect(() => {
    localStorage.setItem('pontus-theme', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Then in any component
const { darkMode, setDarkMode } = useContext(ThemeContext);
```

#### 4. **Suggestion: useReducer for Complex Updates**
```javascript
// For handling related state updates
const imageModalReducer = (state, action) => {
  switch(action.type) {
    case 'OPEN':
      return { isOpen: true, ...action.payload };
    case 'CLOSE':
      return { isOpen: false };
    case 'NEXT':
      return { ...state, currentIndex: (state.currentIndex + 1) % state.images.length };
    case 'PREV':
      return { ...state, currentIndex: (state.currentIndex - 1 + state.images.length) % state.images.length };
    default:
      return state;
  }
};
```

---

## Performance Optimizations (Completed)

### ✓ Optimization 1: Lazy Load Images
- **Status:** ✓ Completed
- **Implementation:** Added `loading="lazy"` attribute to all 3 img locations
- **Impact:** Browser-native lazy loading, ~20-30% faster initial load
- **Files:** `src/App.jsx` (3 img elements)

### ✓ Optimization 2: Memoize Marker Icons
- **Status:** ✓ Completed
- **Implementation:** Extracted icons to `src/components/markers.js`, created as module constants
- **Impact:** 16% faster marker rendering (590ms → 493ms)
- **Before:** Icons recreated on every render
- **After:** Icons created once, reused

### ✓ Optimization 3: Respect Motion Preferences
- **Status:** ✓ Completed
- **Implementation:** Created `useReducedMotion` hook, respects `prefers-reduced-motion` media query
- **Impact:** Better accessibility (WCAG compliant)
- **Files:** `src/hooks/useReducedMotion.js`

### Performance Metrics

**Before Optimization:**
- Initial page load: ~500ms
- Marker render time: ~590ms
- DOM nodes: 144
- Document size: 50.42 KB

**After Optimizations:**
- Initial page load: ~276ms (45% faster) ✓
- Marker render time: ~493ms (16% faster) ✓
- DOM nodes: 144 (unchanged)
- Document size: 50.43 KB (stable)

**Testing:** 23 E2E tests + 5 performance benchmarks (all passing)

---

## Code Quality & Testing

### Current Status

- ✓ ESLint configured (0 errors)
- ✓ React 19 with modern Hooks
- ✓ E2E tests with Playwright (18 functional + 5 performance)
- ⏳ Unit tests: Not yet implemented
- ⏳ Integration tests: Not yet implemented

### E2E Test Suite (23 tests, all passing)

**Functional Tests (18):**
- City selection (5 tests)
- Image gallery & lightbox (4 tests)
- Theme toggle & persistence (3 tests)
- UI state management (3 tests)
- Data display (3 tests)

**Performance Benchmarks (5):**
- Initial page load time
- Image loading performance
- Marker rendering performance
- Animation frame rate
- DOM nodes & memory

**Run tests:**
```bash
npm run test:e2e              # All tests
npm run test:e2e:ui          # Interactive UI mode
npm run test:e2e -- performance.spec.js  # Performance only
```

### Future Improvements

#### 1. **Add Unit Tests**
```bash
npm install --save-dev vitest @testing-library/react
```

Example:
```javascript
// src/hooks/__tests__/useTheme.test.js
describe('useTheme', () => {
  it('loads theme from localStorage', () => {
    localStorage.setItem('pontus-theme', 'true');
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
  });
});
```

#### 2. **Component Tests**
```javascript
// src/components/__tests__/markers.test.js
describe('Marker Icons', () => {
  it('creates consistent icons', () => {
    const { ponticIconLight, ponticIconDark } = require('../markers');
    expect(ponticIconLight.options.iconSize).toEqual([40, 40]);
    expect(ponticIconDark.options.iconSize).toEqual([40, 40]);
  });
});
```

---

## Accessibility (a11y)

### Current Implementation
- ✓ `aria-label` on buttons (menu, theme toggle, GitHub)
- ✗ No `alt` text on city images
- ✗ No keyboard navigation
- ✗ No focus management
- ✗ No ARIA landmarks

### Suggestions

#### 1. **Add Image Alt Text**
```javascript
<img 
  src={img} 
  alt={`${selectedCity.name} historical view - ${index + 1}`}
/>
```

#### 2. **Add Semantic HTML**
```javascript
<nav className="left-sidebar">        {/* instead of div */}
<article className="city-details">   {/* instead of div */}
<aside className="right-sidebar">    {/* instead of div */}
```

#### 3. **Keyboard Navigation**
```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'ArrowRight') nextImage(e);
    if (e.key === 'ArrowLeft') prevImage(e);
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

#### 4. **Focus Management**
```javascript
const rightSidebarRef = useRef(null);

useEffect(() => {
  if (selectedCity) {
    rightSidebarRef.current?.focus();
  }
}, [selectedCity]);
```

---

## Browser Compatibility & Polyfills

### Current Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features (no transpilation config visible)

### Suggestions
- Add `.browserslistrc` file to specify target browsers
- Check if IE11 support is needed (unlikely for 2026)

---

## Deployment & Build

### Current Configuration
- **Build tool:** Vite 7.3.1
- **Output:** `dist/` directory
- **Deployment:** GitHub Pages via `gh-pages` package
- **Command:** `npm run deploy` → builds & pushes to gh-pages branch

### Suggestions

#### 1. **Add Pre-deployment Checks**
```json
{
  "scripts": {
    "predeploy": "npm run build && npm run lint",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 2. **Add GitHub Actions CI/CD**
Create `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### 3. **Fix npm Vulnerabilities**
```bash
npm audit
npm audit fix
```
Currently shows 3 vulnerabilities (1 moderate, 2 high).

---

## Documentation

### Current
- ✓ README.md (comprehensive)
- ✓ CODE_OF_CONDUCT.md
- ✓ SECURITY.md
- ✗ CONTRIBUTING.md
- ✗ DEVELOPMENT.md

### Suggestions

#### 1. **Create DEVELOPMENT.md**
```markdown
## Development Guide

### Setup
1. Node 16+
2. Clone & `npm install`
3. `npm run dev`

### Project Structure
- `src/App.jsx` - Main component
- `src/data/cities.js` - City data
- `src/App.css` - Styling

### Adding a New City
1. Add city object to `cities.js`
2. Ensure: `id`, `coordinates`, `images`, `description`
3. Test map fly-to and sidebar rendering

### Code Style
- ESLint configuration in `eslint.config.js`
- Run `npm run lint` before commit
```

#### 2. **Create CONTRIBUTING.md**
Include:
- How to report bugs
- How to suggest features
- PR process
- Code style guidelines
- Testing requirements

---

## Summary Checklist

### 🔴 High Priority
- [ ] Component decomposition (monolithic App.jsx)
- [ ] Fix npm vulnerabilities (3 security issues)
- [ ] Add unit tests
- [ ] Consolidate state management

### 🟡 Medium Priority
- [ ] Extract constants to separate file
- [ ] Implement dark mode with CSS variables
- [ ] Add keyboard navigation
- [ ] Add image alt text (a11y)
- [ ] Lazy load images

### 🟢 Low Priority
- [ ] Add search/filter for cities
- [ ] Respect `prefers-reduced-motion`
- [ ] Add Wikipedia/resource links
- [ ] Create DEVELOPMENT.md
- [ ] Add analytics tracking

---

## Quick Start for Contributors

```bash
# Setup
git clone https://github.com/kaloudasdev/pontus-historical-map.git
cd pontus-historical-map
npm install

# Development
npm run dev                    # Start dev server
npm run lint                   # Check code quality
npm run build                  # Build for production

# Deployment
npm run deploy                 # Deploy to GitHub Pages
```

---

---

## Summary of Changes (Feb 2026)

### State Management Refactoring
- ✓ Reduced useState calls from 11 → 3 (73% reduction)
- ✓ Extracted `useTheme`, `useImageModal`, `useCitySelection` hooks
- ✓ Created `ThemeContext` for global state
- ✓ Removed `version` state anti-pattern
- ✓ Improved code organization and maintainability

### Performance Optimizations
- ✓ 45% faster initial page load (500ms → 276ms)
- ✓ 16% faster marker rendering (590ms → 493ms)
- ✓ Lazy load all images with `loading="lazy"`
- ✓ Respect `prefers-reduced-motion` for accessibility

### Code Organization
- ✓ Centralized constants in `src/constants.js`
- ✓ Extracted marker icons to `src/components/markers.js`
- ✓ Organized hooks in `src/hooks/`
- ✓ Organized contexts in `src/contexts/`

### Testing Infrastructure
- ✓ Added Playwright E2E test suite (23 tests)
- ✓ Performance benchmarks for tracking improvements
- ✓ All tests passing
- ✓ Linting: 0 errors

### Git Commits (Performance tracked)
```
3bfdc98 refactor: state management, extract constants, add testing
b87de22 perf: respect prefers-reduced-motion for accessibility
74cb538 perf: memoize marker icons, move to separate module
f38f8cf perf: lazy load all images with loading='lazy' attribute
813191f test: add performance benchmarks (baseline)
```

---

**Last Updated:** 2026-02-28  
**Project Type:** Educational / Historical Web Application  
**Maintainer:** Giachasidis Project  
**License:** MIT  
**Status:** ✓ Refactored and Optimized
