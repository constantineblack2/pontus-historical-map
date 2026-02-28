import { useState, useCallback } from 'react';

/**
 * Custom hook for managing city selection state
 * Consolidates: selectedCity, flyToCoords, showMoreImages
 * Provides methods: selectCity, clearSelection, toggleMoreImages
 * Replaces: version state (no longer needed)
 */
export const useCitySelection = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [showMoreImages, setShowMoreImages] = useState(false);

  /**
   * Atomically select a city and update related state
   * Prevents race conditions from multiple state updates
   */
  const selectCity = useCallback((city) => {
    setSelectedCity(city);
    setFlyToCoords(city.coordinates);
    setShowMoreImages(false);
  }, []);

  /**
   * Atomically clear city selection
   */
  const clearSelection = useCallback(() => {
    setSelectedCity(null);
    setShowMoreImages(false);
  }, []);

  /**
   * Toggle "show more images" state
   */
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
