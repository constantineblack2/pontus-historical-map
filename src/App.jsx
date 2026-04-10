import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { useCitySelection } from './hooks/useCitySelection';
import { useImageModal } from './hooks/useImageModal';
import { useThemeContext } from './contexts/ThemeContext';
import MapComponent from './components/Map/MapComponent';
import LeftSidebar from './components/Sidebars/LeftSidebar';
import RightSidebar from './components/Sidebars/RightSidebar';
import ImageModal from './components/ImageModal/ImageModal';
import BottomBar from './components/BottomBar/BottomBar';
import MenuButton from './components/MenuButton/MenuButton';
import 'leaflet/dist/leaflet.css';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;

function App() {
  // Custom hooks (state management)
  const { isDark } = useThemeContext();
  const { selectedCity, flyToCoords, showMoreImages, selectCity, clearSelection, toggleMoreImages } = useCitySelection();
  const { isOpen: modalOpen, images: currentImages, currentIndex: currentImageIndex, cityName: currentCityName, currentImage, open: openImageModal, close: closeImageModal, nextImage, prevImage } = useImageModal();

  // Local UI state
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

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

  // Handlers
  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <MenuButton isOpen={leftSidebarOpen} onToggle={toggleLeftSidebar} />
      
      <LeftSidebar 
        isOpen={leftSidebarOpen}
        selectedCity={selectedCity}
        onCitySelect={selectCity}
      />

      <MapComponent
        flyToCoords={flyToCoords}
        onMarkerClick={selectCity}
      />

      <RightSidebar
        city={selectedCity}
        showMoreImages={showMoreImages}
        onClose={clearSelection}
        onToggleMoreImages={toggleMoreImages}
        onImageClick={openImageModal}
      />

      <ImageModal
        isOpen={modalOpen}
        images={currentImages}
        currentIndex={currentImageIndex}
        cityName={currentCityName}
        currentImage={currentImage}
        onClose={closeImageModal}
        onNext={nextImage}
        onPrev={prevImage}
      />

      <BottomBar />
    </div>
  );
}

export default App;
