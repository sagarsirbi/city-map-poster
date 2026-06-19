import { useCallback, useEffect, useState } from 'react';
import { MapPinned, MoonStar, SunMedium } from 'lucide-react';
import type {
  DownloadFormat,
  GeocodingResult,
  MapState,
  MapStyle,
  OverlayState,
} from './types';
import { DIMENSIONS, STYLE_CONFIGS } from './constants';
import SearchBar from './components/SearchBar';
import MapPoster from './components/MapPoster';
import ControlPanel from './components/ControlPanel';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';

const DEFAULT_DIMENSION = DIMENSIONS[0];

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const storedTheme = window.localStorage.getItem('city-map-poster-theme');
    return storedTheme ? storedTheme === 'dark' : true;
  });
  const [mapState, setMapState] = useState<MapState>({
    center: [48.8566, 2.3522],
    zoom: 13,
  });
  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');
  const [selectedDimensionId, setSelectedDimensionId] = useState(DEFAULT_DIMENSION.id);
  const selectedDimension =
    DIMENSIONS.find((dimension) => dimension.id === selectedDimensionId) ?? DEFAULT_DIMENSION;
  const [overlay, setOverlay] = useState<OverlayState>({
    showCityName: true,
    showCountry: true,
    showCoordinates: true,
    cityName: 'Paris',
    country: 'France',
  });
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('png');
  const [isDownloading, setIsDownloading] = useState(false);

  const styleConfig = STYLE_CONFIGS.find((style) => style.id === mapStyle) ?? STYLE_CONFIGS[0];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    window.localStorage.setItem('city-map-poster-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleGeocode = useCallback((result: GeocodingResult) => {
    setMapState((previous) => ({
      ...previous,
      center: [result.lat, result.lng],
    }));
    setOverlay((previous) => ({
      ...previous,
      cityName: result.cityName,
      country: result.country,
    }));
  }, []);

  const handleMapMove = useCallback((center: [number, number], zoom: number) => {
    setMapState({ center, zoom });
  }, []);

  const handleZoomIn = useCallback(() => {
    setMapState((previous) => ({ ...previous, zoom: Math.min(previous.zoom + 1, 19) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setMapState((previous) => ({ ...previous, zoom: Math.max(previous.zoom - 1, 3) }));
  }, []);

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <MapPinned className="h-4 w-4" />
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold tracking-tight">City Map Poster</p>
            <p className="truncate text-xs text-muted-foreground">
              Build clean social-ready map posters with a bento workspace.
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-2xl flex-1 justify-center">
          <SearchBar onGeocode={handleGeocode} />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-xl"
          onClick={() => setIsDark((previous) => !previous)}
          aria-label="Toggle theme"
        >
          {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </Button>
      </header>

      <main className="grid flex-1 gap-4 overflow-hidden p-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="min-h-0 overflow-hidden">
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
        </div>

        <section className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="flex min-h-0 flex-col rounded-[28px] border border-border bg-card/60 p-4 shadow-sm backdrop-blur">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Preview
                </p>
                <h2 className="text-lg font-semibold tracking-tight">Poster canvas</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{selectedDimension.label}</Badge>
                <Badge variant="outline" className="border-border/70 bg-background/60">
                  {selectedDimension.width} × {selectedDimension.height}
                </Badge>
                <Badge variant="outline" className="border-border/70 bg-background/60">
                  {styleConfig.label}
                </Badge>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-[24px] border border-dashed border-border/70 bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_60%)] p-6">
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
          </div>

          <div className="grid auto-rows-fr gap-4">
            <div className="rounded-[28px] border border-border bg-card/70 p-5 shadow-sm backdrop-blur">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Poster setup
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-3">
                  <span>Zoom</span>
                  <span className="font-medium text-foreground">{mapState.zoom}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Format</span>
                  <span className="font-medium uppercase text-foreground">{downloadFormat}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Overlay</span>
                  <span className="font-medium text-foreground">
                    {[overlay.showCityName, overlay.showCountry, overlay.showCoordinates].filter(Boolean).length} / 3
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-border bg-card/70 p-5 shadow-sm backdrop-blur">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Map center
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: styleConfig.accentColor }}
                  />
                  <span className="font-medium text-foreground">{styleConfig.label} palette active</span>
                </div>
                <p className="font-mono text-xs text-foreground/80">
                  {mapState.center[0].toFixed(4)}, {mapState.center[1].toFixed(4)}
                </p>
                <p className="text-xs leading-5">
                  Search for any city, drag the map, then export a high-resolution poster.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
