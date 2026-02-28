import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, AttributionControl } from 'react-leaflet';
import { cities } from '../../data/cities';
import { useThemeContext } from '../../contexts/ThemeContext';
import { MAP_CONFIG, TILE_URLS } from '../../constants';
import { ponticIconLight, ponticIconDark } from '../markers';
import FlyToCity from './FlyToCity';
import 'leaflet/dist/leaflet.css';

/**
 * MapComponent - Renders the Leaflet map with city markers
 * 
 * @param {[number, number]|null} flyToCoords - Coordinates to fly to
 * @param {Function} onMarkerClick - Callback when marker is clicked
 */
function MapComponent({ flyToCoords, onMarkerClick }) {
  const { isDark: darkMode } = useThemeContext();

  // Memoize markers to prevent re-rendering on parent updates
  const markers = useMemo(
    () =>
      cities.map((city) => (
        <Marker
          key={city.id}
          position={city.coordinates}
          icon={darkMode ? ponticIconDark : ponticIconLight}
          eventHandlers={{
            click: () => onMarkerClick(city),
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
      )),
    [darkMode, onMarkerClick]
  );

  return (
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

      {markers}
    </MapContainer>
  );
}

export default React.memo(MapComponent);
