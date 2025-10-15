import axios from 'axios';
import { WeatherData, Location, SourceWeatherData, CacheEntry, WeatherAlert } from '../types/weather.types';
import { aggregateCurrentWeather, aggregateHourlyForecasts, aggregateDailyForecasts } from '../utils/dataAggregation';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

class WeatherService {
  private cache = new Map<string, CacheEntry<any>>();

  private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
    });
  }

  async searchLocation(query: string): Promise<Location[]> {
    try {
      // Use OpenWeatherMap geocoding API
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=demo`
      );
      
      return response.data.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
      }));
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  async getCurrentLocation(): Promise<{ lat: number; lon: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        }
      );
    });
  }

  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = this.getCacheKey('weather', { lat, lon });
    const cached = this.getFromCache<WeatherData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Fetch weather data from API
      const response = await axios.get(`${API_BASE}/weather`, {
        params: { lat, lon },
      });

      const sources: SourceWeatherData[] = response.data.sources;

      // Get location name (reverse geocoding)
      let location: Location = { name: 'Unknown Location', lat, lon };
      try {
        const geoResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=demo`
        );
        if (geoResponse.data.length > 0) {
          const place = geoResponse.data[0];
          location = {
            name: place.name,
            lat,
            lon,
            country: place.country,
            state: place.state,
          };
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }

      // Aggregate data from all sources
      const aggregatedCurrent = aggregateCurrentWeather(sources);
      const aggregatedHourly = aggregateHourlyForecasts(sources);
      const aggregatedDaily = aggregateDailyForecasts(sources);

      // Fetch alerts
      let alerts: WeatherAlert[] = [];
      try {
        const alertsResponse = await axios.get(`${API_BASE}/alerts`, {
          params: { lat, lon },
        });
        alerts = alertsResponse.data.alerts || [];
      } catch (error) {
        console.error('Alerts fetch error:', error);
      }

      const weatherData: WeatherData = {
        location,
        sources,
        aggregated: {
          current: aggregatedCurrent,
          hourly: aggregatedHourly,
          daily: aggregatedDaily,
          alerts,
        },
        successfulSources: sources.filter(s => s.success).length,
        totalSources: sources.length,
        lastUpdated: Date.now(),
      };

      this.setCache(cacheKey, weatherData);
      return weatherData;
    } catch (error: any) {
      console.error('Weather fetch error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default new WeatherService();

