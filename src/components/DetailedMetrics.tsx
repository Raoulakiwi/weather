import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { mpsToMph, hpaToInHg, metersToMiles, degreesToCardinal, celsiusToFahrenheit } from '../utils/unitConversion';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  range?: string;
  confidence?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, range, confidence }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      {range && (
        <div className="text-xs text-gray-500 dark:text-gray-400">Range: {range}</div>
      )}
      {confidence !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                confidence >= 85
                  ? 'bg-green-500'
                  : confidence >= 70
                  ? 'bg-yellow-500'
                  : 'bg-orange-500'
              }`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailedMetrics: React.FC = () => {
  const { weatherData } = useWeather();

  if (!weatherData?.aggregated.current) {
    return null;
  }

  const { current } = weatherData.aggregated;

  const metrics = [
    {
      icon: '💧',
      label: 'Humidity',
      value: `${Math.round(current.humidity.value)}%`,
      range: `${Math.round(current.humidity.min)}-${Math.round(current.humidity.max)}%`,
      confidence: current.humidity.confidence,
    },
    {
      icon: '🌡️',
      label: 'Pressure',
      value: `${hpaToInHg(current.pressure.value).toFixed(2)} inHg`,
      range: `${hpaToInHg(current.pressure.min).toFixed(2)}-${hpaToInHg(current.pressure.max).toFixed(2)}`,
      confidence: current.pressure.confidence,
    },
    {
      icon: '💨',
      label: 'Wind Speed',
      value: `${Math.round(mpsToMph(current.windSpeed.value))} mph`,
      range: `${Math.round(mpsToMph(current.windSpeed.min))}-${Math.round(mpsToMph(current.windSpeed.max))}`,
      confidence: current.windSpeed.confidence,
    },
    {
      icon: '🧭',
      label: 'Wind Direction',
      value: degreesToCardinal(current.windDegree.value),
      range: `${Math.round(current.windDegree.value)}°`,
      confidence: current.windDegree.confidence,
    },
    {
      icon: '👁️',
      label: 'Visibility',
      value: `${metersToMiles(current.visibility.value).toFixed(1)} mi`,
      range: `${metersToMiles(current.visibility.min).toFixed(1)}-${metersToMiles(current.visibility.max).toFixed(1)}`,
      confidence: current.visibility.confidence,
    },
    {
      icon: '☀️',
      label: 'UV Index',
      value: Math.round(current.uvIndex.value).toString(),
      range: `${Math.round(current.uvIndex.min)}-${Math.round(current.uvIndex.max)}`,
      confidence: current.uvIndex.confidence,
    },
    {
      icon: '☁️',
      label: 'Cloud Cover',
      value: `${Math.round(current.cloudCover.value)}%`,
      range: `${Math.round(current.cloudCover.min)}-${Math.round(current.cloudCover.max)}%`,
      confidence: current.cloudCover.confidence,
    },
  ];

  if (current.dewPoint && current.dewPoint.value !== 0) {
    metrics.push({
      icon: '💦',
      label: 'Dew Point',
      value: `${Math.round(celsiusToFahrenheit(current.dewPoint.value))}°F`,
      range: `${Math.round(celsiusToFahrenheit(current.dewPoint.min))}-${Math.round(celsiusToFahrenheit(current.dewPoint.max))}°`,
      confidence: current.dewPoint.confidence,
    });
  }

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Detailed Metrics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default DetailedMetrics;

