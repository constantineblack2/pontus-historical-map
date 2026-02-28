# State Management Refactoring Proposal

## Current State Problems

### 1. State Fragmentation (11 useState calls)
```javascript
// ❌ Current - scattered and hard to manage
const [selectedCity, setSelectedCity] = useState(null);
const [flyToCoords, setFlyToCoords] = useState(null);
const [version, setVersion] = useState(0);                    // ⚠️ UNNECESSARY
const [darkMode, setDarkMode] = useState(() => {...});
const [modalOpen, setModalOpen] = useState(false);
const [currentImage, setCurrentImage] = useState('');
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [currentImages, setCurrentImages] = useState([]);
const [currentCityName, setCurrentCityName] = useState('');
const [showMoreImages, setShowMoreImages] = useState(false);
const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
```

**Issues:**
1. **5 related image modal states** (lines 58-62) should be a single object
2. **3 city-related states** (selectedCity, flyToCoords, version) need coordination
3. **2 sidebar states** could be grouped
4. **version state is anti-pattern** — React keys handle re-renders automatically
5. **Synchronization bugs** — if one state update fails, others can get out of sync

### 2. Tight Coupling: State Updates Scattered
```javascript
// ❌ Problem: City selection triggers 4 state updates
const handleCitySelect = (city) => {
  setSelectedCity(city);      // 1. City
  setFlyToCoords(city.coordinates);  // 2. Map
  setVersion(v => v + 1);     // 3. Force re-render (bad pattern)
  setShowMoreImages(false);   // 4. Image view state
};

// ❌ Similar code in handleMarkerClick (DRY violation)
const handleMarkerClick = (city) => {
  setSelectedCity(city);
  setVersion(v => v + 1);
  setShowMoreImages(false);
};
```

**Issues:**
- State updates are not atomic — can cause race conditions
- Same logic duplicated in two places
- Difficult to trace side effects

### 3. Theme/Persistence Logic Spread Across useEffect
```javascript
// ❌ Current: Two separate concerns
useEffect(() => {
  localStorage.setItem('pontus-theme', JSON.stringify(darkMode));
  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}, [darkMode]);  // Runs on EVERY darkMode change
```

**Issues:**
- Manual DOM manipulation (not React-idiomatic)
- Persists to localStorage on every toggle (inefficient)
- Global style pollution (class on body)

### 4. No Global Context for Theme
```javascript
// ❌ Current: Dark mode prop drilling if we add child components
<App>
  <LeftSidebar darkMode={darkMode} />
  <RightSidebar darkMode={darkMode} />
  <BottomBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
</App>
```

---

## Proposed Refactoring Strategy

### Phase 1: Create Custom Hooks

#### 1.1 `useTheme` Hook
```javascript
// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('pontus-theme');
    return saved ? JSON.parse(saved) : false;
  });

  // Single effect: persist to localStorage
  useEffect(() => {
    localStorage.setItem('pontus-theme', JSON.stringify(isDark));
  }, [isDark]);

  // Single effect: update DOM class
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return { isDark, toggleDarkMode };
};
```

**Benefits:**
- ✓ Encapsulates theme logic
- ✓ Reusable across components
- ✓ Cleaner than class manipulation
- ✓ Supports CSS `[data-theme="dark"]` selector

#### 1.2 `useImageModal` Hook
```javascript
// src/hooks/useImageModal.js
import { useState } from 'react';

const initialState = {
  isOpen: false,
  images: [],
  currentIndex: 0,
  cityName: '',
};

export const useImageModal = () => {
  const [modal, setModal] = useState(initialState);

  const open = (images, startIndex = 0, cityName = '') => {
    setModal({
      isOpen: true,
      images,
      currentIndex: startIndex,
      cityName,
    });
  };

  const close = () => setModal(initialState);

  const nextImage = () => {
    setModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  const prevImage = () => {
    setModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
    }));
  };

  return {
    ...modal,
    open,
    close,
    nextImage,
    prevImage,
  };
};
```

**Benefits:**
- ✓ Consolidates 5 related states into 1
- ✓ Provides clear API (open/close/next/prev)
- ✓ Prevents invalid state combinations
- ✓ Self-contained logic

#### 1.3 `useCitySelection` Hook
```javascript
// src/hooks/useCitySelection.js
import { useState, useCallback } from 'react';

export const useCitySelection = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [showMoreImages, setShowMoreImages] = useState(false);

  const selectCity = useCallback((city) => {
    setSelectedCity(city);
    setFlyToCoords(city.coordinates);
    setShowMoreImages(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCity(null);
    setShowMoreImages(false);
  }, []);

  const toggleMoreImages = useCallback(() => {
    setShowMoreImages(prev => !prev);
  }, []);

  return {
    selectedCity,
    flyToCoords,
    showMoreImages,
    selectCity,
    clearSelection,
    toggleMoreImages,
  };
};
```

**Benefits:**
- ✓ Eliminates `version` state anti-pattern
- ✓ Atomic city selection (all related state updates together)
- ✓ DRY — no duplicate logic between select & marker click
- ✓ Memoized callbacks (prevents child re-renders)

### Phase 2: Create Context for Global State

#### 2.1 `ThemeContext`
```javascript
// src/contexts/ThemeContext.jsx
import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const theme = useTheme();
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};
```

**Benefits:**
- ✓ Eliminates prop drilling
- ✓ Provides context to any child component
- ✓ Clean separation of concerns

### Phase 3: Refactor App.jsx

#### Before: 11 useState + 2 useEffect
```javascript
// ❌ Current App.jsx (lines 50-85)
function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [version, setVersion] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pontus-theme');
    return saved ? JSON.parse(saved) : false;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentCityName, setCurrentCityName] = useState('');
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('pontus-theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen]);

  // ... 11 handler functions
}
```

#### After: 3 custom hooks + 1 useEffect
```javascript
// ✓ Refactored App.jsx
function App() {
  // Global theme (from context)
  const { isDark: darkMode } = useThemeContext();

  // Custom hooks
  const { selectedCity, flyToCoords, showMoreImages, selectCity, clearSelection, toggleMoreImages } = useCitySelection();
  const { isOpen: modalOpen, images: currentImages, currentIndex: currentImageIndex, cityName: currentCityName, open: openImageModal, close: closeImageModal, nextImage, prevImage } = useImageModal();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  // Single effect: body scroll locking
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen]);

  // Clean handler functions
  const handleCitySelect = (city) => {
    selectCity(city);
  };

  const handleMarkerClick = (city) => {
    selectCity(city);  // ✓ Same logic, one call
  };

  const handleClose = () => {
    clearSelection();
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(prev => !prev);
  };

  // ... JSX remains the same
}
```

---

## Implementation Roadmap

### Step 1: Create Hooks Directory
```bash
mkdir -p src/hooks
```

### Step 2: Create useTheme Hook
```bash
# Create src/hooks/useTheme.js
# File: REFACTORING_STEP_2.md (see below)
```

### Step 3: Create useImageModal Hook
```bash
# Create src/hooks/useImageModal.js
```

### Step 4: Create useCitySelection Hook
```bash
# Create src/hooks/useCitySelection.js
```

### Step 5: Create ThemeContext
```bash
# Create src/contexts/ThemeContext.jsx
```

### Step 6: Update main.jsx
```javascript
// Add ThemeProvider wrapper
import { ThemeProvider } from './contexts/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
```

### Step 7: Refactor App.jsx
Remove:
- All theme state & useEffect (moved to hook)
- All modal state & useEffect (moved to hook)
- All city selection state (moved to hook)
- `version` state (removed entirely)
- Duplicate handlers

Keep:
- `leftSidebarOpen` state (UI-only, local)
- Modal scroll-lock effect (single effect)

---

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **State Variables** | 11 | 3 |
| **useEffect Hooks** | 2 | 1 |
| **App.jsx Lines** | ~419 | ~250 |
| **State Cohesion** | Fragmented | Grouped |
| **Code Duplication** | Yes (handlers) | No |
| **Reusability** | Hard | Easy (hooks) |
| **Testing** | Difficult | Easy (hooks isolated) |
| **Prop Drilling** | Yes (darkMode) | No (context) |
| **Race Conditions** | Possible | Prevented |
| **DOM Manipulation** | Manual class | CSS selector |

---

## Testing Strategy

### Unit Tests for Hooks
```javascript
// src/hooks/__tests__/useTheme.test.js
describe('useTheme', () => {
  it('loads theme from localStorage', () => {
    localStorage.setItem('pontus-theme', 'true');
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
  });

  it('toggles theme', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleDarkMode());
    expect(result.current.isDark).toBe(true);
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleDarkMode());
    expect(JSON.parse(localStorage.getItem('pontus-theme'))).toBe(true);
  });
});
```

### Integration Tests
```javascript
// Test that theme context works end-to-end
describe('ThemeContext Integration', () => {
  it('provides theme to consuming components', () => {
    const wrapper = ({ children }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(result.current.isDark).toBeDefined();
  });
});
```

---

## Rollback Plan

If issues arise:
1. All old code commented out (not deleted)
2. Can quickly revert by removing hook imports
3. No breaking changes to App component API
4. Incremental adoption possible

---

## Open Questions

1. **CSS Variables vs. Classes?**
   - Proposal: Use `[data-theme="dark"]` selector in CSS
   - Alternative: Keep `.dark-mode` class (less CSS changes)
   - Recommendation: Data attributes (cleaner semantic HTML)

2. **Should leftSidebarOpen be UI context?**
   - Current: Local state (fine for single component)
   - Alternative: Move to context for mobile-responsive state management
   - Recommendation: Keep local (not needed across components)

3. **Should selectedCity be persisted?**
   - Current: Lost on page refresh
   - Alternative: Store in URL params or localStorage
   - Recommendation: Keep current (session-specific data)

---

## Next Steps

1. **Review & approve** this refactoring strategy
2. **Create PR** with hooks implementation (Step 2-5)
3. **Test hooks** with unit tests
4. **Refactor App.jsx** (Step 6-7)
5. **Verify no regressions** with E2E tests

---

**Estimated Effort:** 2-3 hours  
**Risk Level:** Low (incremental, reversible)  
**Testing Effort:** 1 hour (unit + integration tests)
