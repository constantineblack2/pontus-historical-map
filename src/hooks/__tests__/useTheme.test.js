import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTheme } from '../useTheme';
import { STORAGE_KEYS } from '../../constants';

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes with false (light mode) when no theme is saved', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.isDark).toBe(false);
  });

  it('loads saved theme from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(true));
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.isDark).toBe(true);
  });

  it('toggles dark mode state', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.isDark).toBe(false);
  });

  it('persists theme to localStorage when toggled', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleDarkMode();
    });

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME));
    expect(saved).toBe(true);

    act(() => {
      result.current.toggleDarkMode();
    });

    const saved2 = JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME));
    expect(saved2).toBe(false);
  });

  it('updates DOM data attribute when theme changes', () => {
    const { result } = renderHook(() => useTheme());

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('sets DOM attribute on mount if theme is dark', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(true));

    renderHook(() => useTheme());

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
