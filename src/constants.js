/**
 * Application Constants
 * Centralized configuration for map, animations, and URLs
 */

// Map Configuration
export const MAP_CONFIG = {
  CENTER: [39.5, 33.0],
  DEFAULT_ZOOM: 6,
  MIN_ZOOM: 7,
  MAX_BOUNDS: [[30, 20], [50, 50]],
  FLY_TO_ZOOM: 10,
  FLY_TO_DURATION: 1.5,
  FLY_TO_EASING: 0.25,
  ZOOM_BUFFER: 5,
  MAX_NATIVE_ZOOM: 19,
};

// Tile Layer URLs
export const TILE_URLS = {
  LIGHT: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  DARK: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};

// Animation Timings (seconds)
export const ANIMATION = {
  SIDEBAR_DURATION: 0.3,
  SIDEBAR_EASING: 'easeOut',
  CITY_LIST_STAGGER_DELAY: 0.1,
  IMAGE_STAGGER_DELAY: 0.2,
  IMAGE_MODAL_DURATION: 0.3,
  MORE_IMAGES_GRID_DURATION: 0.3,
  PANEL_INITIAL_DELAY: 0.25,
  PANEL_DESC_DELAY: 0.3,
  PANEL_STATS_DELAY: 0.5,
  BOTTOM_BAR_DELAY: 0.3,
  MORE_IMAGES_ITEM_DELAY: 0.1,
};

// External Links
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/KaloudasDev/pontus-historical-map',
};

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'pontus-theme',
};

// DOM Selectors (for reference, not to be used in JSX)
export const SELECTORS = {
  MAP_CONTAINER: '.map-container',
  SIDEBAR: '.sidebar',
  LEFT_SIDEBAR: '.left-sidebar',
  RIGHT_SIDEBAR: '.right-sidebar',
  IMAGE_MODAL: '.image-modal',
  CITY_LIST_ITEM: '.city-list-item',
  CITY_DETAILS: '.city-details',
};
