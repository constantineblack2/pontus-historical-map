import { useState, useEffect } from 'react';

/**
 * Custom hook to detect user's motion preference
 * Respects the prefers-reduced-motion media query for accessibility
 * Users with vestibular disorders, epilepsy, or motion sensitivity benefit from this
 */
export const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    // Check user's preference on initial render
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Listen for changes (e.g., user changes setting while page is open)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      setPrefersReduced(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
};
