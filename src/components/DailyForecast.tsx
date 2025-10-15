import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { format } from 'date-fns';
import { celsiusToFahrenheit } from '../utils/unitConversion';

interface DailyForecastProps {
  useFahrenheit?: boolean;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ useFahrenheit = true }) => {
  const { weatherData } = useWeather();

  if (!weatherData?.aggregated.daily || weatherData.aggregated.daily.length === 0) {
    return null;
  }

  const daily = weatherData.aggregated.daily;

  const getWeatherIcon = (condition: string): string => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    if (lower.includes('fog') || lower.includes('mist')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mt-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        7-Day Forecast
      </h3>

      <div className="space-y-3">
        {daily.map((day, index) => {
          const tempMax = useFahrenheit
            ? celsiusToFahrenheit(day.tempMax.value)
            : day.tempMax.value;
          const tempMin = useFahrenheit
            ? celsiusToFahrenheit(day.tempMin.value)
            : day.tempMin.value;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-20 font-semibold text-gray-900 dark:text-white">
                  {index === 0 ? 'Today' : format(day.date, 'EEE')}
                </div>
                <div className="text-3xl">{getWeatherIcon(day.condition)}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {day.condition}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    💧 {Math.round(day.precipitationChance.value)}% precipitation
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {Math.round(tempMax)}°
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(tempMin)}°
                  </div>
                </div>

                {/* Temperature Bar */}
                <div className="w-24 h-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full relative">
                  <div
                    className="absolute h-2 bg-gray-700 dark:bg-gray-300 rounded-full"
                    style={{
                      left: `${((tempMin - 0) / 100) * 100}%`,
                      width: `${((tempMax - tempMin) / 100) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Note:</span> Forecasts are aggregated from multiple
            weather services. Temperature ranges indicate variations between different sources.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyForecast;

