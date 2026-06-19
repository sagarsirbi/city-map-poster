import { useState, useCallback } from 'react';
import type { MapStyle, DownloadFormat, MapState, OverlayState, GeocodingResult } from './types';
import { DIMENSIONS, STYLE_CONFIGS } from './constants';
import SearchBar from './components/SearchBar';
import MapPoster from './components/MapPoster';
import ControlPanel from './components/ControlPanel';
import './App.css';

const DEFAULT_DIMENSION = DIMENSIONS[0]; // Instagram Story

export default function App() {
  const [mapState, setMapState] = useState<MapState>({
    center: [48.8566, 2.3522],
    zoom: 13,
  });

  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');

  const [selectedDimensionId, setSelectedDimensionId] = useState(DEFAULT_DIMENSION.id);
  const selectedDimension = DIMENSIONS.find((d) => d.id === selectedDimensionId) ?? DEFAULT_DIMENSION;

  const [overlay, setOverlay] = useState<OverlayState>({
    showCityName: true,
    showCountry: true,
    showCoordinates: true,
    cityName: 'Paris',
    country: 'France',
  });

  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('png');
  const [isDownloading, setIsDownloading] = useState(false);

  const styleConfig = STYLE_CONFIGS.find((s) => s.id === mapStyle) ?? STYLE_CONFIGS[0];

  const handleGeocode = useCallback((result: GeocodingResult) => {
    setMapState((prev) => ({
      ...prev,
      center: [result.lat, result.lng],
    }));
    setOverlay((prev) => ({
      ...prev,
      cityName: result.cityName,
      country: result.country,
    }));
  }, []);

  const handleMapMove = useCallback((center: [number, number], zoom: number) => {
    setMapState({ center, zoom });
  }, []);

  const handleZoomIn = useCallback(() => {
    setMapState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 1, 19) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setMapState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 1, 3) }));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-icon">🗺️</span>
          <span className="app-title">City Map Poster</span>
        </div>
        <SearchBar onGeocode={handleGeocode} />
      </header>

      <main className="app-main">
        <ControlPanel
          mapStyle={mapStyle}
          onMapStyleChange={setMapStyle}
          selectedDimensionId={selectedDimensionId}
          onDimensionChange={setSelectedDimensionId}
          overlay={overlay}
          onOverlayChange={setOverlay}
          zoom={mapState.zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          downloadFormat={downloadFormat}
          onDownloadFormatChange={setDownloadFormat}
          isDownloading={isDownloading}
          onDownloadStart={() => setIsDownloading(true)}
          onDownloadEnd={() => setIsDownloading(false)}
          styleConfig={styleConfig}
          selectedDimension={selectedDimension}
          mapState={mapState}
        />

        <div className="preview-area">
          <div className="preview-label">
            Preview — {selectedDimension.label} ({selectedDimension.width} × {selectedDimension.height}px)
          </div>
          <MapPoster
            mapState={mapState}
            onMapMove={handleMapMove}
            mapStyle={mapStyle}
            styleConfig={styleConfig}
            overlay={overlay}
            dimension={selectedDimension}
            downloadFormat={downloadFormat}
            isDownloading={isDownloading}
            onDownloadEnd={() => setIsDownloading(false)}
          />
        </div>
      </main>
    </div>
  );
}
