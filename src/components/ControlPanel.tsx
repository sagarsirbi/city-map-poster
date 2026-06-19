import type { MapStyle, DownloadFormat, OverlayState, StyleConfig, Dimension, MapState } from '../types';
import { DIMENSIONS, STYLE_CONFIGS } from '../constants';
import './ControlPanel.css';

interface Props {
  mapStyle: MapStyle;
  onMapStyleChange: (style: MapStyle) => void;
  selectedDimensionId: string;
  onDimensionChange: (id: string) => void;
  overlay: OverlayState;
  onOverlayChange: (o: OverlayState) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  downloadFormat: DownloadFormat;
  onDownloadFormatChange: (f: DownloadFormat) => void;
  isDownloading: boolean;
  onDownloadStart: () => void;
  onDownloadEnd: () => void;
  styleConfig: StyleConfig;
  selectedDimension: Dimension;
  mapState: MapState;
}

// Group dimensions by category
const grouped = DIMENSIONS.reduce<Record<string, Dimension[]>>((acc, d) => {
  if (!acc[d.category]) acc[d.category] = [];
  acc[d.category].push(d);
  return acc;
}, {});

const DOWNLOAD_FORMATS: { id: DownloadFormat; label: string }[] = [
  { id: 'png', label: 'PNG' },
  { id: 'jpg', label: 'JPG' },
  { id: 'webp', label: 'WebP' },
];

export default function ControlPanel({
  mapStyle,
  onMapStyleChange,
  selectedDimensionId,
  onDimensionChange,
  overlay,
  onOverlayChange,
  zoom,
  onZoomIn,
  onZoomOut,
  downloadFormat,
  onDownloadFormatChange,
  isDownloading,
  onDownloadStart,
  styleConfig,
  selectedDimension,
}: Props) {
  const setOverlayField = <K extends keyof OverlayState>(key: K, value: OverlayState[K]) => {
    onOverlayChange({ ...overlay, [key]: value });
  };

  return (
    <aside className="control-panel">
      {/* Map Style */}
      <section className="cp-section">
        <h3 className="cp-section-title">Map Style</h3>
        <div className="style-grid">
          {STYLE_CONFIGS.map((s) => (
            <button
              key={s.id}
              className={`style-btn${mapStyle === s.id ? ' style-btn--active' : ''}`}
              onClick={() => onMapStyleChange(s.id)}
              style={
                mapStyle === s.id
                  ? { borderColor: styleConfig.accentColor, color: styleConfig.accentColor }
                  : {}
              }
            >
              <span className="style-swatch" style={{ background: s.posterBg, borderColor: s.overlayText + '33' }} />
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Dimension */}
      <section className="cp-section">
        <h3 className="cp-section-title">Dimension</h3>
        <select
          className="cp-select"
          value={selectedDimensionId}
          onChange={(e) => onDimensionChange(e.target.value)}
        >
          {Object.entries(grouped).map(([cat, dims]) => (
            <optgroup key={cat} label={cat}>
              {dims.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} — {d.width}×{d.height}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="cp-hint">
          {selectedDimension.width} × {selectedDimension.height} px
          &nbsp;(ratio {(selectedDimension.width / selectedDimension.height).toFixed(2)})
        </p>
      </section>

      {/* Zoom */}
      <section className="cp-section">
        <h3 className="cp-section-title">Zoom Level — {zoom}</h3>
        <div className="zoom-row">
          <button className="zoom-btn" onClick={onZoomOut} aria-label="Zoom out">−</button>
          <div className="zoom-track">
            <div
              className="zoom-fill"
              style={{ width: `${((zoom - 3) / (19 - 3)) * 100}%`, background: styleConfig.accentColor }}
            />
          </div>
          <button className="zoom-btn" onClick={onZoomIn} aria-label="Zoom in">+</button>
        </div>
        <p className="cp-hint">Drag the map to reposition</p>
      </section>

      {/* Overlay toggles */}
      <section className="cp-section">
        <h3 className="cp-section-title">Label Overlay</h3>
        <div className="toggle-list">
          <label className="toggle-row">
            <span className="toggle-label">City Name</span>
            <input
              type="checkbox"
              className="toggle-input"
              checked={overlay.showCityName}
              onChange={(e) => setOverlayField('showCityName', e.target.checked)}
            />
            <span className="toggle-switch" style={overlay.showCityName ? { background: styleConfig.accentColor } : {}} />
          </label>
          {overlay.showCityName && (
            <input
              type="text"
              className="cp-text-input"
              value={overlay.cityName}
              placeholder="City name"
              onChange={(e) => setOverlayField('cityName', e.target.value)}
            />
          )}

          <label className="toggle-row">
            <span className="toggle-label">Country</span>
            <input
              type="checkbox"
              className="toggle-input"
              checked={overlay.showCountry}
              onChange={(e) => setOverlayField('showCountry', e.target.checked)}
            />
            <span className="toggle-switch" style={overlay.showCountry ? { background: styleConfig.accentColor } : {}} />
          </label>
          {overlay.showCountry && (
            <input
              type="text"
              className="cp-text-input"
              value={overlay.country}
              placeholder="Country"
              onChange={(e) => setOverlayField('country', e.target.value)}
            />
          )}

          <label className="toggle-row">
            <span className="toggle-label">GPS Coordinates</span>
            <input
              type="checkbox"
              className="toggle-input"
              checked={overlay.showCoordinates}
              onChange={(e) => setOverlayField('showCoordinates', e.target.checked)}
            />
            <span className="toggle-switch" style={overlay.showCoordinates ? { background: styleConfig.accentColor } : {}} />
          </label>
        </div>
      </section>

      {/* Download */}
      <section className="cp-section cp-section--download">
        <h3 className="cp-section-title">Download</h3>
        <div className="format-row">
          {DOWNLOAD_FORMATS.map((f) => (
            <button
              key={f.id}
              className={`format-btn${downloadFormat === f.id ? ' format-btn--active' : ''}`}
              onClick={() => onDownloadFormatChange(f.id)}
              style={downloadFormat === f.id ? { borderColor: styleConfig.accentColor, color: styleConfig.accentColor } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          className="download-btn"
          onClick={onDownloadStart}
          disabled={isDownloading}
          style={{ background: styleConfig.accentColor }}
        >
          {isDownloading ? (
            <><span className="dl-spinner" /> Generating…</>
          ) : (
            <><span className="dl-icon">⬇</span> Download {downloadFormat.toUpperCase()}</>
          )}
        </button>
      </section>
    </aside>
  );
}
