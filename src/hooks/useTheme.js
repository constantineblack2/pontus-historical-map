import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

/**
 * Custom hook for managing theme state with localStorage persistence
 * Handles: loading from localStorage, persisting changes, updating DOM
 */
export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved ? JSON.parse(saved) : false;
  });

  // Effect: Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
  }, [isDark]);

  // Effect: Update DOM data attribute
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
