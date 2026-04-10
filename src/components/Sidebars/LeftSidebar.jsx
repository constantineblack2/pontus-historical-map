import React, { useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { cities } from '../../data/cities';
import { useThemeContext } from '../../contexts/ThemeContext';
import { ANIMATION } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useFuzzySearch } from '../../hooks/useFuzzySearch';

/**
 * LeftSidebar - Displays city list and app title
 * 
 * @param {boolean} isOpen - Whether sidebar is open
 * @param {Object|null} selectedCity - Currently selected city
 * @param {Function} onCitySelect - Callback when city is selected
 */
function LeftSidebar({ isOpen, selectedCity, onCitySelect }) {
  const { isDark: darkMode } = useThemeContext();
  const prefersReducedMotion = useReducedMotion();
  const getCitySearchText = useCallback((city) => `${city.name} ${city.region}`, []);
  const { searchTerm, setSearchTerm, results: filteredCities } = useFuzzySearch(cities, getCitySearchText);

  const getAnimationDuration = (baseDuration) => {
    return prefersReducedMotion ? 0 : baseDuration;
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Motion.div 
          className={`sidebar left-sidebar ${darkMode ? 'dark' : ''}`}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: getAnimationDuration(ANIMATION.SIDEBAR_DURATION), ease: ANIMATION.SIDEBAR_EASING }}
        >
          <div className="sidebar-header">
            <h1>Ιστορικός Χάρτης</h1>
            <h1 className="subtitle-main">του Πόντου</h1>
            <p className="subtitle">Επτά σημαντικές πόλεις</p>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Αναζητήστε πόλη..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`city-search ${darkMode ? 'dark' : ''}`}
            />
            {searchTerm && (
              <span className="search-results-count">
                {filteredCities.length} {filteredCities.length === 1 ? 'αποτέλεσμα' : 'αποτελέσματα'}
              </span>
            )}
          </div>

          <div className="city-list">
            {filteredCities.map((city, index) => (
              <Motion.div
                key={city.id}
                className={`city-list-item ${selectedCity?.id === city.id ? 'active' : ''} ${darkMode ? 'dark' : ''}`}
                onClick={() => onCitySelect(city)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * ANIMATION.CITY_LIST_STAGGER_DELAY }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="city-name">{city.name}</span>
                <span className="city-region">{city.region}</span>
              </Motion.div>
            ))}
          </div>
          <div className="sidebar-footer">
            <p>© 2026 • Giachasidis Project</p>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(LeftSidebar);
