import React, { useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { format } from 'date-fns';
import { celsiusToFahrenheit, degreesToCardinal } from '../utils/unitConversion';
import SourceComparison from './SourceComparison';

const CurrentWeather: React.FC = () => {
  const { weatherData } = useWeather();
  const [showSources, setShowSources] = useState(false);
  const [useFahrenheit, setUseFahrenheit] = useState(true);

  if (!weatherData?.aggregated.current) {
    return null;
  }

  const { current } = weatherData.aggregated;
  const temp = useFahrenheit 
    ? celsiusToFahrenheit(current.temperature.value)
    : current.temperature.value;
  const feelsLike = useFahrenheit
    ? celsiusToFahrenheit(current.feelsLike.value)
    : current.feelsLike.value;

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 85) return 'text-green-500';
    if (confidence >= 70) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 85) return 'High Confidence';
    if (confidence >= 70) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const getWeatherIcon = (condition: string): string => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    if (lower.includes('fog') || lower.includes('mist')) return '🌫️';
    if (lower.includes('wind')) return '💨';
    return '🌤️';
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {weatherData.location.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {format(current.timestamp, 'EEEE, MMMM d, yyyy • h:mm a')}
          </p>
        </div>
        <button
          onClick={() => setUseFahrenheit(!useFahrenheit)}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          °{useFahrenheit ? 'F' : 'C'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-8xl">{getWeatherIcon(current.condition)}</div>
          <div>
            <div className="text-6xl font-bold text-gray-900 dark:text-white">
              {Math.round(temp)}°
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-300 mt-1">
              Feels like {Math.round(feelsLike)}°
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {current.condition}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`font-medium ${getConfidenceColor(current.conditionConfidence)}`}>
              {getConfidenceLabel(current.conditionConfidence)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ({current.temperature.sourceCount} sources)
            </span>
          </div>
          <button
            onClick={() => setShowSources(!showSources)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-left flex items-center gap-2"
          >
            <span>{showSources ? 'Hide' : 'View'} Source Data</span>
            <svg
              className={`w-4 h-4 transition-transform ${showSources ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {showSources && (
        <div className="mb-6 animate-fade-in">
          <SourceComparison sources={weatherData.sources} useFahrenheit={useFahrenheit} />
        </div>
      )}

      <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Aggregated from {weatherData.successfulSources} of {weatherData.totalSources} sources
        </p>
        {weatherData.successfulSources < 3 && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            ⚠️ Limited data available. Results may be less accurate.
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;

