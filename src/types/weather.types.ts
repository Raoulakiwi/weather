// Unified weather data types

export interface Location {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionCode?: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDegree: number;
  windDirection?: string;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  dewPoint?: number;
  precipitation?: number;
  timestamp: number;
}

export interface HourlyForecast {
  time: number;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionCode?: string;
  precipitationChance: number;
  precipitationAmount?: number;
  humidity: number;
  windSpeed: number;
  windDegree: number;
}

export interface DailyForecast {
  date: number;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionCode?: string;
  precipitationChance: number;
  precipitationAmount?: number;
  humidity: number;
  windSpeed: number;
  sunrise?: number;
  sunset?: number;
  uvIndex?: number;
}

export interface WeatherAlert {
  event: string;
  headline: string;
  description: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor' | 'unknown';
  start: number;
  end: number;
  source: string;
}

// Source-specific data with metadata
export interface SourceWeatherData {
  source: string;
  success: boolean;
  error?: string;
  timestamp: number;
  current?: CurrentWeather;
  hourly?: HourlyForecast[];
  daily?: DailyForecast[];
  alerts?: WeatherAlert[];
}

// Aggregated weather data with confidence scores
export interface AggregatedCurrent {
  temperature: MetricValue;
  feelsLike: MetricValue;
  condition: string;
  conditionConfidence: number;
  humidity: MetricValue;
  pressure: MetricValue;
  windSpeed: MetricValue;
  windDegree: MetricValue;
  cloudCover: MetricValue;
  visibility: MetricValue;
  uvIndex: MetricValue;
  dewPoint?: MetricValue;
  precipitation?: MetricValue;
  timestamp: number;
}

export interface MetricValue {
  value: number;
  min: number;
  max: number;
  confidence: number;
  sourceCount: number;
}

export interface AggregatedHourlyForecast {
  time: number;
  temperature: MetricValue;
  feelsLike: MetricValue;
  condition: string;
  precipitationChance: MetricValue;
  humidity: MetricValue;
  windSpeed: MetricValue;
}

export interface AggregatedDailyForecast {
  date: number;
  tempMax: MetricValue;
  tempMin: MetricValue;
  condition: string;
  precipitationChance: MetricValue;
  humidity: MetricValue;
  windSpeed: MetricValue;
  uvIndex?: MetricValue;
}

export interface WeatherData {
  location: Location;
  sources: SourceWeatherData[];
  aggregated: {
    current?: AggregatedCurrent;
    hourly?: AggregatedHourlyForecast[];
    daily?: AggregatedDailyForecast[];
    alerts?: WeatherAlert[];
  };
  successfulSources: number;
  totalSources: number;
  lastUpdated: number;
}

// API Response types
export interface WeatherAPIResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

// Cache entry
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Theme types
export type WeatherCondition = 
  | 'clear'
  | 'cloudy'
  | 'partly-cloudy'
  | 'rain'
  | 'snow'
  | 'storm'
  | 'fog'
  | 'wind';

export type TimeOfDay = 'day' | 'night';

