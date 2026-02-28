/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { cities } from './data/cities';
import { useThemeContext } from './contexts/ThemeContext';
import { useCitySelection } from './hooks/useCitySelection';
import { useImageModal } from './hooks/useImageModal';
import { useReducedMotion } from './hooks/useReducedMotion';
import { MAP_CONFIG, ANIMATION, TILE_URLS, EXTERNAL_LINKS } from './constants';
import { ponticIconLight, ponticIconDark } from './components/markers';
import 'leaflet/dist/leaflet.css';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;

function FlyToCity({ coordinates }) {
  const map = useMap();
  React.useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, MAP_CONFIG.FLY_TO_ZOOM, {
        duration: MAP_CONFIG.FLY_TO_DURATION,
        easeLinearity: MAP_CONFIG.FLY_TO_EASING
      });
    }
  }, [coordinates, map]);
  return null;
}

function App() {
  // Custom hooks (state management)
  const { isDark: darkMode, toggleDarkMode } = useThemeContext();
  const { selectedCity, flyToCoords, showMoreImages, selectCity, clearSelection, toggleMoreImages } = useCitySelection();
  const { isOpen: modalOpen, images: currentImages, currentIndex: currentImageIndex, cityName: currentCityName, currentImage, open: openImageModal, close: closeImageModal, nextImage, prevImage } = useImageModal();
  const prefersReducedMotion = useReducedMotion();
  
  // Local UI state
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  // Helper: Reduce animation duration if user prefers reduced motion
  const getAnimationDuration = (baseDuration) => {
    return prefersReducedMotion ? 0 : baseDuration;
  };

  // Effect: Lock body scroll when modal is open
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

  // Handlers using custom hooks
  const handleCitySelect = (city) => {
    selectCity(city);
  };

  const handleMarkerClick = (city) => {
    selectCity(city);
  };

  const handleClose = () => {
    clearSelection();
  };

  const openGitHub = () => {
    window.open(EXTERNAL_LINKS.GITHUB, '_blank');
  };

  const handleOpenImageModal = (images, index, cityName) => {
    openImageModal(images, index, cityName);
  };

  const handleImageNext = (e) => {
    e.stopPropagation();
    nextImage();
  };

  const handleImagePrev = (e) => {
    e.stopPropagation();
    prevImage();
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <button 
        className={`menu-button ${darkMode ? 'dark' : ''} ${!leftSidebarOpen ? 'menu-button-closed' : ''}`}
        onClick={toggleLeftSidebar}
        aria-label="Toggle menu"
      >
        <span className="menu-icon"></span>
        <span className="menu-icon"></span>
        <span className="menu-icon"></span>
      </button>

      <AnimatePresence mode="wait">
        {leftSidebarOpen && (
          <motion.div 
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
            <div className="city-list">
              {cities.map((city, index) => (
                <motion.div
                  key={city.id}
                  className={`city-list-item ${selectedCity?.id === city.id ? 'active' : ''} ${darkMode ? 'dark' : ''}`}
                  onClick={() => handleCitySelect(city)}
                  initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * ANIMATION.CITY_LIST_STAGGER_DELAY }}
                  whileHover={{ scale: 1.02, backgroundColor: darkMode ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.1)' }}
                >
                  <span className="city-name">{city.name}</span>
                  <span className="city-region">{city.region}</span>
                </motion.div>
              ))}
            </div>
            <div className="sidebar-footer">
              <p>© 2026 • Giachasidis Project</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainer
        center={MAP_CONFIG.CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        className="map-container"
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxBounds={MAP_CONFIG.MAX_BOUNDS}
        attributionControl={false}
        zoomControl={false}
        preferCanvas={true}
        updateWhenZooming={false}
        updateWhenIdle={true}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          attribution=''
          url={darkMode ? TILE_URLS.DARK : TILE_URLS.LIGHT}
          keepBuffer={MAP_CONFIG.ZOOM_BUFFER}
          maxNativeZoom={MAP_CONFIG.MAX_NATIVE_ZOOM}
        />
        
        <FlyToCity coordinates={flyToCoords} />

        {cities.map((city) => (
          <Marker
            key={city.id}
            position={city.coordinates}
            icon={darkMode ? ponticIconDark : ponticIconLight}
            eventHandlers={{
              click: () => handleMarkerClick(city),
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              }
            }}
          >
            <Popup>
              <div className={`custom-popup ${darkMode ? 'dark' : ''}`}>
                <h3>{city.name}</h3>
                <p>{city.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <AnimatePresence mode="wait">
        {selectedCity && (
          <motion.div
            key={selectedCity.id}
            className={`sidebar right-sidebar ${darkMode ? 'dark' : ''}`}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: getAnimationDuration(ANIMATION.SIDEBAR_DURATION), ease: ANIMATION.SIDEBAR_EASING }}
          >
            <button className="close-button" onClick={handleClose}>×</button>
            <div className="city-details">
              <h2>{selectedCity.name}</h2>
              <p className="city-meta">
                <span className="region">{selectedCity.region}</span>
                <span className="established">{selectedCity.established}</span>
              </p>
              
              <div className="city-images">
                {selectedCity.images.slice(0, 2).map((img, index) => (
                  <motion.img
                     key={index}
                     src={img}
                     loading="lazy"
                     alt={`${selectedCity.name} - view ${index + 1}`}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: index * ANIMATION.IMAGE_STAGGER_DELAY }}
                     onClick={() => handleOpenImageModal(selectedCity.images, index, selectedCity.name)}
                     style={{ cursor: 'pointer' }}
                     onError={(e) => {
                       e.target.onerror = null;
                       e.target.src = 'https://via.placeholder.com/300x200?text=Ιστορική+Εικόνα';
                     }}
                   />
                ))}
              </div>

              {selectedCity.images.length > 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: ANIMATION.PANEL_INITIAL_DELAY }}
                >
                  <button className="more-images-button" onClick={toggleMoreImages}>
                    {showMoreImages ? 'Δείτε λιγότερες εικόνες' : 'Δείτε περισσότερες εικόνες'}
                  </button>
                  
                  <AnimatePresence>
                    {showMoreImages && (
                      <motion.div 
                         className="more-images-grid"
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: getAnimationDuration(ANIMATION.MORE_IMAGES_GRID_DURATION) }}
                      >
                        {selectedCity.images.slice(2).map((img, index) => (
                          <motion.img
                             key={index + 2}
                             src={img}
                             loading="lazy"
                             alt={`${selectedCity.name} - view ${index + 3}`}
                             initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * ANIMATION.MORE_IMAGES_ITEM_DELAY }}
                             onClick={() => handleOpenImageModal(selectedCity.images, index + 2, selectedCity.name)}
                             style={{ cursor: 'pointer' }}
                             onError={(e) => {
                               e.target.onerror = null;
                               e.target.src = 'https://via.placeholder.com/300x200?text=Ιστορική+Εικόνα';
                             }}
                           />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              <motion.div
                 className="city-description"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: ANIMATION.PANEL_DESC_DELAY }}
              >
                <p className="short-desc">{selectedCity.description}</p>
                <p className="long-desc">{selectedCity.longDescription}</p>
              </motion.div>

              <motion.div
                 className="city-stats"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: ANIMATION.PANEL_STATS_DELAY }}
              >
                <div className="stat">
                  <span className="stat-label">Πληθυσμός:</span>
                  <span className="stat-value">{selectedCity.population}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="image-modal-close" onClick={closeImageModal}>×</button>
              
              {currentImages.length > 1 && (
                <>
                   <button className="image-modal-nav image-modal-prev" onClick={handleImagePrev}>‹</button>
                   <button className="image-modal-nav image-modal-next" onClick={handleImageNext}>›</button>
                 </>
                )}
              
              <motion.img 
                 key={currentImage}
                 src={currentImage}
                 loading="lazy"
                 alt={`${currentCityName} - enlarged view`}
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ duration: getAnimationDuration(ANIMATION.IMAGE_MODAL_DURATION) }}
              />
              
              {currentImages.length > 1 && (
                <div className="image-modal-caption">
                  {currentCityName} - {currentImageIndex + 1} / {currentImages.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
         className="bottom-bar"
         initial={{ y: 100, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 0.5, delay: ANIMATION.BOTTOM_BAR_DELAY }}
      >
        <button 
          className="bottom-bar-button theme-toggle-bottom"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          <span className="theme-icon">
            <span className={`moon-icon ${darkMode ? 'hidden' : ''}`}></span>
            <span className={`sun-icon ${darkMode ? '' : 'hidden'}`}></span>
          </span>
          <span className="button-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button 
          className="bottom-bar-button github-button"
          onClick={openGitHub}
          aria-label="GitHub Profile"
        >
          <span className="github-icon"></span>
          <span className="button-text">GitHub</span>
        </button>
      </motion.div>
    </div>
  );
}

export default App;
