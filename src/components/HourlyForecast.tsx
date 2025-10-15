import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { format } from 'date-fns';
import { celsiusToFahrenheit } from '../utils/unitConversion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface HourlyForecastProps {
  useFahrenheit?: boolean;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ useFahrenheit = true }) => {
  const { weatherData } = useWeather();

  if (!weatherData?.aggregated.hourly || weatherData.aggregated.hourly.length === 0) {
    return null;
  }

  const hourly = weatherData.aggregated.hourly.slice(0, 24);

  const chartData = hourly.map((h) => ({
    time: format(h.time, 'ha'),
    temp: useFahrenheit ? celsiusToFahrenheit(h.temperature.value) : h.temperature.value,
    tempMin: useFahrenheit ? celsiusToFahrenheit(h.temperature.min) : h.temperature.min,
    tempMax: useFahrenheit ? celsiusToFahrenheit(h.temperature.max) : h.temperature.max,
    precip: h.precipitationChance.value,
  }));

  const getWeatherIcon = (condition: string): string => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mt-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        24-Hour Forecast
      </h3>

      {/* Temperature Chart */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          Temperature Trend
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => `${Math.round(value)}°${useFahrenheit ? 'F' : 'C'}`}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Precipitation Chart */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
          Precipitation Probability
        </h4>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => `${Math.round(value)}%`}
            />
            <Area
              type="monotone"
              dataKey="precip"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#precipGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Cards */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {hourly.map((hour, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-24 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {format(hour.time, 'ha')}
              </div>
              <div className="text-3xl mb-2">{getWeatherIcon(hour.condition)}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {Math.round(
                  useFahrenheit
                    ? celsiusToFahrenheit(hour.temperature.value)
                    : hour.temperature.value
                )}°
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400">
                💧 {Math.round(hour.precipitationChance.value)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;

