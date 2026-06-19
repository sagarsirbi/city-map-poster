import { Download, Minus, Palette, Plus, Ruler, Type } from 'lucide-react';
import { DIMENSIONS, STYLE_CONFIGS } from '../constants';
import type {
  Dimension,
  DownloadFormat,
  MapState,
  MapStyle,
  OverlayState,
  StyleConfig,
} from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface Props {
  mapStyle: MapStyle;
  onMapStyleChange: (style: MapStyle) => void;
  selectedDimensionId: string;
  onDimensionChange: (id: string) => void;
  overlay: OverlayState;
  onOverlayChange: (overlayState: OverlayState) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  downloadFormat: DownloadFormat;
  onDownloadFormatChange: (format: DownloadFormat) => void;
  isDownloading: boolean;
  onDownloadStart: () => void;
  onDownloadEnd: () => void;
  styleConfig: StyleConfig;
  selectedDimension: Dimension;
  mapState: MapState;
}

const groupedDimensions = DIMENSIONS.reduce<Record<string, Dimension[]>>((groups, dimension) => {
  if (!groups[dimension.category]) {
    groups[dimension.category] = [];
  }
  groups[dimension.category].push(dimension);
  return groups;
}, {});

const DOWNLOAD_FORMATS: Array<{ id: DownloadFormat; label: string }> = [
  { id: 'png', label: 'PNG' },
  { id: 'jpg', label: 'JPG' },
  { id: 'webp', label: 'WebP' },
];

const fieldClassName =
  'h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

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
  mapState,
}: Props) {
  const setOverlayField = <Key extends keyof OverlayState>(
    key: Key,
    value: OverlayState[Key],
  ) => {
    onOverlayChange({ ...overlay, [key]: value });
  };

  const selectedButtonStyle = {
    borderColor: styleConfig.accentColor,
    color: styleConfig.accentColor,
    boxShadow: `inset 0 0 0 1px ${styleConfig.accentColor}33`,
  };

  return (
    <aside className="h-full overflow-y-auto pr-1">
      <div className="grid auto-rows-max gap-4 pb-1">
        <Card className="overflow-hidden border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Map Style</CardTitle>
              </div>
              <Badge variant="secondary">{STYLE_CONFIGS.length} themes</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {STYLE_CONFIGS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className="rounded-2xl border border-border/70 bg-background/70 p-3 text-left transition hover:border-border hover:bg-accent/50"
                  onClick={() => onMapStyleChange(style.id)}
                  style={mapStyle === style.id ? selectedButtonStyle : undefined}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span
                      className="block h-8 w-8 rounded-xl border border-white/10 shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${style.posterBg} 0%, ${style.accentColor} 100%)`,
                      }}
                    />
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: style.accentColor }}
                    />
                  </div>
                  <div className="text-sm font-medium text-foreground">{style.label}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Poster finish & overlay tone</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Dimensions & Zoom</CardTitle>
              </div>
              <Badge variant="outline" className="border-border/70 bg-background/60">
                {(selectedDimension.width / selectedDimension.height).toFixed(2)} ratio
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dimension-select">Canvas preset</Label>
              <select
                id="dimension-select"
                className={fieldClassName}
                value={selectedDimensionId}
                onChange={(event) => onDimensionChange(event.target.value)}
              >
                {Object.entries(groupedDimensions).map(([category, dimensions]) => (
                  <optgroup key={category} label={category}>
                    {dimensions.map((dimension) => (
                      <option key={dimension.id} value={dimension.id}>
                        {dimension.label} — {dimension.width}×{dimension.height}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {selectedDimension.width} × {selectedDimension.height} px
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <Label>Zoom level</Label>
                <span className="text-sm font-medium text-foreground">{zoom}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={onZoomOut}
                  disabled={zoom <= 3}
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${((zoom - 3) / (19 - 3)) * 100}%`,
                      backgroundColor: styleConfig.accentColor,
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={onZoomIn}
                  disabled={zoom >= 19}
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Drag the map to reposition your focal point.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Label Overlay</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-city">City name</Label>
                <Switch
                  id="show-city"
                  checked={overlay.showCityName}
                  onCheckedChange={(checked) => setOverlayField('showCityName', checked)}
                />
              </div>
              {overlay.showCityName && (
                <input
                  type="text"
                  className={fieldClassName}
                  value={overlay.cityName}
                  placeholder="City name"
                  onChange={(event) => setOverlayField('cityName', event.target.value)}
                />
              )}
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-country">Country</Label>
                <Switch
                  id="show-country"
                  checked={overlay.showCountry}
                  onCheckedChange={(checked) => setOverlayField('showCountry', checked)}
                />
              </div>
              {overlay.showCountry && (
                <input
                  type="text"
                  className={fieldClassName}
                  value={overlay.country}
                  placeholder="Country"
                  onChange={(event) => setOverlayField('country', event.target.value)}
                />
              )}
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="show-coordinates">GPS coordinates</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mapState.center[0].toFixed(4)}, {mapState.center[1].toFixed(4)}
                  </p>
                </div>
                <Switch
                  id="show-coordinates"
                  checked={overlay.showCoordinates}
                  onCheckedChange={(checked) => setOverlayField('showCoordinates', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Download</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {DOWNLOAD_FORMATS.map((format) => (
                <Button
                  key={format.id}
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => onDownloadFormatChange(format.id)}
                  style={downloadFormat === format.id ? selectedButtonStyle : undefined}
                >
                  {format.label}
                </Button>
              ))}
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground">
              Export a {selectedDimension.width} × {selectedDimension.height} poster in {downloadFormat.toUpperCase()} format.
            </div>
            <Button
              type="button"
              className="h-11 w-full rounded-xl text-sm font-semibold"
              style={{ backgroundColor: styleConfig.accentColor, color: '#ffffff' }}
              onClick={onDownloadStart}
              disabled={isDownloading}
            >
              {isDownloading ? 'Generating…' : `Download ${downloadFormat.toUpperCase()}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
