/**
 * Marker icon definitions for the map
 * Created once and reused to avoid recreation on render
 */
import L from 'leaflet';

/**
 * Light mode marker icon
 */
export const ponticIconLight = new L.DivIcon({
  className: 'custom-pontic-marker',
  html: `
    <div class="marker-container">
      <div class="marker-dot"></div>
      <div class="marker-ring"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

/**
 * Dark mode marker icon
 */
export const ponticIconDark = new L.DivIcon({
  className: 'custom-pontic-marker-dark',
  html: `
    <div class="marker-container-dark">
      <div class="marker-dot-dark"></div>
      <div class="marker-ring-dark"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});
