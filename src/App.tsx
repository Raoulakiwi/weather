import React, { useState, useEffect } from 'react';
import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import LocationSearch from './components/LocationSearch';
import CurrentWeather from './components/CurrentWeather';
import DetailedMetrics from './components/DetailedMetrics';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherMap from './components/WeatherMap';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-2/3 mx-auto"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { weatherData, loading, error, clearError, refreshWeather } = useWeather();
  const [darkMode, setDarkMode] = useState(false);
  const [useFahrenheit] = useState(true);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getBackgroundGradient = (): string => {
    if (!weatherData?.aggregated.current) {
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    }

    const condition = weatherData.aggregated.current.condition.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;

    if (isNight) {
      return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900';
    }

    if (condition.includes('clear') || condition.includes('sunny')) {
      return 'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500';
    }
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'bg-gradient-to-br from-gray-600 via-gray-700 to-blue-800';
    }
    if (condition.includes('cloud')) {
      return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
    }
    if (condition.includes('snow')) {
      return 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300';
    }
    if (condition.includes('thunder') || condition.includes('storm')) {
      return 'bg-gradient-to-br from-gray-800 via-purple-900 to-gray-900';
    }

    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getBackgroundGradient()}`}>
      <div className="min-h-screen bg-black/10 dark:bg-black/30">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🌤️</span>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    Weather Aggregator
                  </h1>
                  <p className="text-sm text-white/80">Multi-source weather intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {weatherData && (
                  <button
                    onClick={refreshWeather}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-medium transition-colors flex items-center gap-2"
                    title="Refresh weather data"
                  >
                    <svg
                      className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <LocationSearch />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-semibold text-red-800 dark:text-red-200">Error</div>
                  <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && !weatherData && <LoadingSkeleton />}

          {/* Weather Data */}
          {weatherData && (
            <div className="space-y-6 animate-fade-in">
              <CurrentWeather />
              <DetailedMetrics />
              <WeatherAlerts />
              <HourlyForecast useFahrenheit={useFahrenheit} />
              <DailyForecast useFahrenheit={useFahrenheit} />
              <WeatherMap />
            </div>
          )}

          {/* Welcome Message */}
          {!loading && !weatherData && !error && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🌍</div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-4">
                Welcome to Weather Aggregator
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get accurate weather data aggregated from multiple trusted sources including
                OpenWeatherMap, WeatherAPI, Open-Meteo, and Weather.gov
              </p>
              <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                Search for a location or use your current location to get started
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-white/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 text-center text-white/80">
            <p className="mb-2">
              Data sources: OpenWeatherMap • WeatherAPI • Open-Meteo • Weather.gov
            </p>
            <p className="text-sm">
              Weather data is aggregated from multiple sources for improved accuracy
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
};

export default App;

