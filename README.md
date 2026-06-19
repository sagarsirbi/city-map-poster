# City Map Poster

A web application to create beautiful city map posters optimised for every major social media format.

## Features

- **City search** — type any city name; powered by OpenStreetMap Nominatim geocoding with live suggestions
- **Interactive map** — drag to reposition, zoom with the controls or scroll wheel
- **4 map styles** — Dark, Light, Classic (OSM), and Modern (Voyager)
- **25+ social media dimensions** including:
  - Instagram Story / Highlight / Post (square, portrait, landscape)
  - Facebook Story / Post / Cover / Event Cover
  - LinkedIn Cover / Post / Story
  - YouTube Thumbnail / Channel Banner
  - Twitter/X Post / Header
  - TikTok Video
  - Pinterest Pin / Square
  - Snapchat Story
  - Standard print sizes (A4 portrait & landscape)
  - Square HD and Widescreen HD
- **Label overlays** — toggle city name, country, and GPS coordinates; edit text inline
- **Download in JPG, PNG, or WebP** — image scaled to exact target dimensions

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** + TypeScript via Vite
- **Leaflet** / react-leaflet for interactive maps
- **CARTO & OpenStreetMap** tile layers (no API key required)
- **html-to-image** for poster capture and download
- **Nominatim** (OpenStreetMap) for geocoding
