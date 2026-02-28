import React from 'react';
import { useMap } from 'react-leaflet';
import { MAP_CONFIG } from '../../constants';

/**
 * FlyToCity - Animates map flyover to selected city coordinates
 * 
 * @param {[number, number]|null} coordinates - [lat, lng] to fly to
 */
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

export default FlyToCity;
