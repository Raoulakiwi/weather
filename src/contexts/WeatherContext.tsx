import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WeatherData, Location } from '../types/weather.types';
import weatherService from '../services/weatherService';

interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  currentLocation: Location | null;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  searchLocation: (query: string) => Promise<Location[]>;
  useCurrentLocation: () => Promise<void>;
  refreshWeather: () => Promise<void>;
  clearError: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getWeatherData(lat, lon);
      setWeatherData(data);
      setCurrentLocation(data.location);
      
      // Save to recent searches
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const newSearch = { ...data.location, timestamp: Date.now() };
      const filtered = recentSearches.filter(
        (s: any) => !(s.lat === lat && s.lon === lon)
      );
      filtered.unshift(newSearch);
      localStorage.setItem('recentSearches', JSON.stringify(filtered.slice(0, 5)));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLocation = useCallback(async (query: string): Promise<Location[]> => {
    try {
      return await weatherService.searchLocation(query);
    } catch (err) {
      console.error('Location search error:', err);
      return [];
    }
  }, []);

  const useCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await weatherService.getCurrentLocation();
      if (coords) {
        await fetchWeather(coords.lat, coords.lon);
      } else {
        setError('Unable to get your location. Please enable location services.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  }, [fetchWeather]);

  const refreshWeather = useCallback(async () => {
    if (currentLocation) {
      weatherService.clearCache();
      await fetchWeather(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation, fetchWeather]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: WeatherContextType = {
    weatherData,
    loading,
    error,
    currentLocation,
    fetchWeather,
    searchLocation,
    useCurrentLocation,
    refreshWeather,
    clearError,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

