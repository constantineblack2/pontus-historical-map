import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../contexts/ThemeContext';
import { ANIMATION } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * RightSidebar - Displays selected city details and image gallery
 * 
 * @param {Object|null} city - Selected city data
 * @param {boolean} showMoreImages - Whether additional images are visible
 * @param {Function} onClose - Callback to close sidebar
 * @param {Function} onToggleMoreImages - Callback to toggle more images
 * @param {Function} onImageClick - Callback when image is clicked
 */
function RightSidebar({
  city,
  showMoreImages,
  onClose,
  onToggleMoreImages,
  onImageClick
}) {
  const { isDark: darkMode } = useThemeContext();
  const prefersReducedMotion = useReducedMotion();

  const getAnimationDuration = (baseDuration) => {
    return prefersReducedMotion ? 0 : baseDuration;
  };

  return (
    <AnimatePresence mode="wait">
      {city && (
        <Motion.div
          key={city.id}
          className={`sidebar right-sidebar ${darkMode ? 'dark' : ''}`}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: getAnimationDuration(ANIMATION.SIDEBAR_DURATION), ease: ANIMATION.SIDEBAR_EASING }}
        >
          <button className="close-button" onClick={onClose}>×</button>
          <div className="city-details">
            <h2>{city.name}</h2>
            <p className="city-meta">
              <span className="region">{city.region}</span>
              <span className="established">{city.established}</span>
            </p>
            
            <div className="city-images">
              {city.images.slice(0, 2).map((img, index) => (
                <Motion.img
                  key={index}
                  src={img}
                  loading="lazy"
                  alt={`${city.name} - view ${index + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * ANIMATION.IMAGE_STAGGER_DELAY }}
                  onClick={() => onImageClick(city.images, index, city.name)}
                  style={{ cursor: 'pointer' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Ιστορική+Εικόνα';
                  }}
                />
              ))}
            </div>

            {city.images.length > 2 && (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: ANIMATION.PANEL_INITIAL_DELAY }}
              >
                <button className="more-images-button" onClick={onToggleMoreImages}>
                  {showMoreImages ? 'Δείτε λιγότερες εικόνες' : 'Δείτε περισσότερες εικόνες'}
                </button>
                
                <AnimatePresence>
                  {showMoreImages && (
                    <Motion.div 
                      className="more-images-grid"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: getAnimationDuration(ANIMATION.MORE_IMAGES_GRID_DURATION) }}
                    >
                      {city.images.slice(2).map((img, index) => (
                        <Motion.img
                          key={index + 2}
                          src={img}
                          loading="lazy"
                          alt={`${city.name} - view ${index + 3}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * ANIMATION.MORE_IMAGES_ITEM_DELAY }}
                          onClick={() => onImageClick(city.images, index + 2, city.name)}
                          style={{ cursor: 'pointer' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Ιστορική+Εικόνα';
                          }}
                        />
                      ))}
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Motion.div>
            )}

            <Motion.div
              className="city-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: ANIMATION.PANEL_DESC_DELAY }}
            >
              <p className="short-desc">{city.description}</p>
              <p className="long-desc">{city.longDescription}</p>
            </Motion.div>

            <Motion.div
              className="city-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: ANIMATION.PANEL_STATS_DELAY }}
            >
              <div className="stat">
                <span className="stat-label">Πληθυσμός:</span>
                <span className="stat-value">{city.population}</span>
              </div>
            </Motion.div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(RightSidebar);
