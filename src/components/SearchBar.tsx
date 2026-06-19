import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { LoaderCircle, MapPin, Search } from 'lucide-react';
import type { GeocodingResult } from '../types';

interface Props {
  onGeocode: (result: GeocodingResult) => void;
}

interface Suggestion {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  address?: {
    country?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
}

export default function SearchBar({ onGeocode }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (nextQuery: string) => {
    if (nextQuery.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nextQuery)}&format=json&limit=6&addressdetails=1&accept-language=en`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
      });
      const data: Suggestion[] = await response.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
    } catch {
      // silently ignore network errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => fetchSuggestions(value), 350);
  };

  const handleSelect = (suggestion: Suggestion) => {
    const cityName =
      suggestion.address?.city ||
      suggestion.address?.town ||
      suggestion.address?.village ||
      suggestion.address?.municipality ||
      suggestion.name;
    const country = suggestion.address?.country ?? '';

    onGeocode({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      cityName,
      country,
      displayName: suggestion.display_name,
    });
    setQuery(cityName);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl" ref={wrapperRef}>
      <div className="flex h-10 items-center gap-2 rounded-2xl border border-input bg-background/80 px-3 shadow-sm transition focus-within:ring-2 focus-within:ring-ring">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          placeholder="Search for a city…"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          role="listbox"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.place_id} role="option">
              <button
                type="button"
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-accent"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(suggestion);
                }}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm leading-5 text-foreground/90">{suggestion.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
