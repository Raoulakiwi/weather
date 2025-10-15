import React, { useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { format } from 'date-fns';

const WeatherAlerts: React.FC = () => {
  const { weatherData } = useWeather();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!weatherData?.aggregated.alerts || weatherData.aggregated.alerts.length === 0) {
    return null;
  }

  const alerts = weatherData.aggregated.alerts;

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-700';
      case 'severe':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 dark:border-orange-700';
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-700';
      case 'minor':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 border-gray-500 dark:border-gray-700';
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'extreme':
        return '🚨';
      case 'severe':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'minor':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getSeverityLabel = (severity: string): string => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mt-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span>⚠️</span>
        Weather Alerts ({alerts.length})
      </h3>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {alert.headline}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-white/50 dark:bg-black/20 text-gray-700 dark:text-gray-300">
                    {getSeverityLabel(alert.severity)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-4">
                  <span>📅 {format(alert.start, 'MMM d, h:mm a')}</span>
                  <span>→</span>
                  <span>{format(alert.end, 'MMM d, h:mm a')}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Source: {alert.source}
                </div>
              </div>
              <button className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {expandedIndex === index && (
              <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {alert.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;

