import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { Location } from '../types/weather.types';

const LocationSearch: React.FC = () => {
  const { searchLocation, fetchWeather, useCurrentLocation, loading } = useWeather();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Debounced search
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const locations = await searchLocation(query);
      setResults(locations);
      setSearching(false);
      setShowDropdown(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchLocation]);

  const handleSelectLocation = async (location: Location) => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    await fetchWeather(location.lat, location.lon);
  };

  const handleUseCurrentLocation = async () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    await useCurrentLocation();
  };

  const formatLocationName = (location: Location): string => {
    const parts = [location.name];
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 pl-12 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={loading}
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        <button
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium transition-colors flex items-center gap-2"
          title="Use current location"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>

      {showDropdown && (results.length > 0 || recentSearches.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div>
              <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                Search Results
              </div>
              {results.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{formatLocationName(location)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  Recent Searches
                </div>
                {recentSearches.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{formatLocationName(location)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;

