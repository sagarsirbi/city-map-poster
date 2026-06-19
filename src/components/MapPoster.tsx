import { useRef, useEffect, useCallback, useId } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { toPng } from 'html-to-image';
import type { MapState, StyleConfig, OverlayState, Dimension, DownloadFormat } from '../types';
import './MapPoster.css';

interface Props {
  mapState: MapState;
  onMapMove: (center: [number, number], zoom: number) => void;
  mapStyle: string;
  styleConfig: StyleConfig;
  overlay: OverlayState;
  dimension: Dimension;
  downloadFormat: DownloadFormat;
  isDownloading: boolean;
  onDownloadEnd: () => void;
}

// Syncs the map view when center/zoom props change (e.g. search, zoom buttons).
// Uses a small threshold so dragging the map doesn't fight the user.
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    const cur = map.getCenter();
    const latDiff = Math.abs(cur.lat - center[0]);
    const lngDiff = Math.abs(cur.lng - center[1]);
    const zoomChanged = map.getZoom() !== zoom;
    if (latDiff > 0.0001 || lngDiff > 0.0001 || zoomChanged) {
      map.setView(center, zoom, { animate: true });
    }
  }, [map, center, zoom]);
  return null;
}

// Fires a callback whenever the user moves or zooms the map.
function MapEventHandler({
  onMapMove,
}: {
  onMapMove: (center: [number, number], zoom: number) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMapMove([c.lat, c.lng], e.target.getZoom());
    },
  });
  return null;
}

const MAX_PREVIEW_HEIGHT = 480;
const MAX_PREVIEW_WIDTH = 600;

/** Convert a PNG data URL to the requested mime type using an off-screen canvas. */
async function convertToFormat(
  pngDataUrl: string,
  targetW: number,
  targetH: number,
  format: DownloadFormat,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No 2d context')); return; }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      resolve(canvas.toDataURL(mimeType, 0.92));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = pngDataUrl;
  });
}

export default function MapPoster({
  mapState,
  onMapMove,
  mapStyle,
  styleConfig,
  overlay,
  dimension,
  downloadFormat,
  isDownloading,
  onDownloadEnd,
}: Props) {
  const posterRef = useRef<HTMLDivElement>(null);
  const downloadingRef = useRef(false);
  const mapKey = useId(); // stable ID, never changes

  // Calculate preview dimensions preserving aspect ratio
  const aspectRatio = dimension.width / dimension.height;
  let previewH = MAX_PREVIEW_HEIGHT;
  let previewW = Math.round(previewH * aspectRatio);
  if (previewW > MAX_PREVIEW_WIDTH) {
    previewW = MAX_PREVIEW_WIDTH;
    previewH = Math.round(previewW / aspectRatio);
  }

  const formatCoords = (lat: number, lng: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}  ${Math.abs(lng).toFixed(4)}°${lngDir}`;
  };

  const doDownload = useCallback(async () => {
    const el = posterRef.current;
    if (!el) { onDownloadEnd(); return; }

    try {
      // 1. Capture poster as PNG at preview resolution
      const pngDataUrl = await toPng(el, {
        cacheBust: true,
        width: previewW,
        height: previewH,
      });

      // 2. Scale to exact target dimensions and convert format
      const finalUrl = await convertToFormat(
        pngDataUrl,
        dimension.width,
        dimension.height,
        downloadFormat,
      );

      const ext = downloadFormat === 'jpg' ? 'jpg' : downloadFormat;
      const a = document.createElement('a');
      a.download = `city-map-poster-${mapStyle}.${ext}`;
      a.href = finalUrl;
      a.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      onDownloadEnd();
    }
  }, [dimension, downloadFormat, mapStyle, onDownloadEnd, previewH, previewW]);

  // Trigger download when parent flips isDownloading to true.
  // Guard against re-entry with downloadingRef.
  useEffect(() => {
    if (isDownloading && !downloadingRef.current) {
      downloadingRef.current = true;
      doDownload().finally(() => { downloadingRef.current = false; });
    }
  }, [isDownloading, doDownload]);

  return (
    <div className="poster-wrapper" style={{ width: previewW, height: previewH }}>
      <div
        ref={posterRef}
        className="poster"
        style={{ width: previewW, height: previewH, background: styleConfig.posterBg }}
        data-mapstyle={mapStyle}
      >
        {/* Stable MapContainer key so position persists across style changes */}
        <MapContainer
          key={mapKey}
          center={mapState.center}
          zoom={mapState.zoom}
          className="poster-map"
          zoomControl={false}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          {/* key={mapStyle} forces TileLayer to remount on style change */}
          <TileLayer
            key={mapStyle}
            url={styleConfig.tileUrl}
            attribution={styleConfig.attribution}
            crossOrigin="anonymous"
          />
          <MapController center={mapState.center} zoom={mapState.zoom} />
          <MapEventHandler onMapMove={onMapMove} />
        </MapContainer>

        {/* Overlay */}
        {(overlay.showCityName || overlay.showCountry || overlay.showCoordinates) && (
          <div
            className="poster-overlay"
            style={{
              background: styleConfig.overlayBg,
              color: styleConfig.overlayText,
              borderTop: `2px solid ${styleConfig.accentColor}`,
            }}
          >
            <div className="overlay-left">
              {overlay.showCityName && (
                <span className="overlay-city" style={{ color: styleConfig.overlayText }}>
                  {overlay.cityName}
                </span>
              )}
              {overlay.showCountry && (
                <span className="overlay-country" style={{ color: styleConfig.accentColor }}>
                  {overlay.country}
                </span>
              )}
            </div>
            {overlay.showCoordinates && (
              <span
                className="overlay-coords"
                style={{ color: styleConfig.overlayText, opacity: 0.75 }}
              >
                {formatCoords(mapState.center[0], mapState.center[1])}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
