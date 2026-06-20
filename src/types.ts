// Map style options
export type MapStyle = 'dark' | 'light' | 'classic' | 'modern' | 'midnight-blue' | 'terracotta' | 'neon' | 'coral' | 'heatwave';

// Download format options
export type DownloadFormat = 'png' | 'jpg' | 'webp';

// Social media dimension presets
export interface Dimension {
  id: string;
  label: string;
  width: number;
  height: number;
  category: string;
}

// Map center / zoom state
export interface MapState {
  center: [number, number];
  zoom: number;
}

// Overlay text options
export interface OverlayState {
  showCityName: boolean;
  showCountry: boolean;
  showCoordinates: boolean;
  cityName: string;
  country: string;
}

// Geocoding result from Nominatim
export interface GeocodingResult {
  lat: number;
  lng: number;
  cityName: string;
  country: string;
  displayName: string;
}

// Style configuration for each map style
export interface StyleConfig {
  id: MapStyle;
  label: string;
  description: string;
  /** Four CSS background values rendered as swatch blocks in the theme picker */
  swatchColors: [string, string, string, string];
  tileUrl: string;
  attribution: string;
  overlayBg: string;
  overlayText: string;
  posterBg: string;
  accentColor: string;
}
