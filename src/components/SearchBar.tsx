import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeocodingResult } from '../types';
import './SearchBar.css';

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

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1&accept-language=en`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
      });
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
    } catch {
      // silently ignore network errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (s: Suggestion) => {
    const cityName =
      s.address?.city ||
      s.address?.town ||
      s.address?.village ||
      s.address?.municipality ||
      s.name;
    const country = s.address?.country ?? '';

    onGeocode({
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
      cityName,
      country,
      displayName: s.display_name,
    });
    setQuery(cityName);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-input-row">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city…"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && <span className="search-spinner" />}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="search-dropdown" role="listbox">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="search-option"
              role="option"
              onMouseDown={() => handleSelect(s)}
            >
              <span className="search-option-icon">📍</span>
              <span className="search-option-text">{s.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
