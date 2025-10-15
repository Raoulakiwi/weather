import React from 'react';
import { SourceWeatherData } from '../types/weather.types';
import { celsiusToFahrenheit } from '../utils/unitConversion';

interface SourceComparisonProps {
  sources: SourceWeatherData[];
  useFahrenheit: boolean;
}

const SourceComparison: React.FC<SourceComparisonProps> = ({ sources, useFahrenheit }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Individual Source Data
      </h3>
      <div className="grid gap-3">
        {sources.map((source, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              source.success
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {source.source}
                </span>
                {source.success ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    ✓ Active
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    ✗ Failed
                  </span>
                )}
              </div>
            </div>

            {source.success && source.current ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Temperature</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {Math.round(
                      useFahrenheit
                        ? celsiusToFahrenheit(source.current.temperature)
                        : source.current.temperature
                    )}°{useFahrenheit ? 'F' : 'C'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Condition</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {source.current.condition}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Humidity</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {Math.round(source.current.humidity)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Wind</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {Math.round(source.current.windSpeed * 2.237)} mph
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-600 dark:text-red-400">
                {source.error || 'Failed to fetch data from this source'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceComparison;

