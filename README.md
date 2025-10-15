# Weather Aggregator

A modern, beautiful weather application that aggregates real-time weather data from multiple trusted sources to provide the most accurate and comprehensive weather information.

![Weather Aggregator](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue)

## 🌟 Features

- **Multi-Source Data Aggregation**: Combines weather data from 5-7 different APIs including:
  - OpenWeatherMap
  - WeatherAPI.com
  - Open-Meteo (no API key required)
  - Weather.gov / National Weather Service (US only, no API key required)
  - And more...

- **Intelligent Data Processing**:
  - Median-based temperature aggregation for accuracy
  - Confidence scores based on source agreement
  - Graceful handling of API failures
  - Smart caching to reduce API calls

- **Comprehensive Weather Information**:
  - Current conditions with aggregated metrics
  - 24-hour hourly forecasts with charts
  - 7-day daily forecasts
  - Detailed metrics (humidity, pressure, wind, UV index, etc.)
  - Weather alerts and warnings
  - Interactive weather maps with multiple layers

- **Beautiful User Interface**:
  - Modern, responsive design
  - Dynamic backgrounds based on weather conditions
  - Dark/light mode support
  - Smooth animations and transitions
  - Mobile-friendly

- **Smart Location Features**:
  - Search locations worldwide
  - Geolocation support
  - Recent searches saved locally

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- API keys (optional, some sources work without keys)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
OPENWEATHER_API_KEY=your_key_here
WEATHERAPI_KEY=your_key_here
TOMORROW_API_KEY=your_key_here
VISUAL_CROSSING_API_KEY=your_key_here
WEATHERBIT_API_KEY=your_key_here
```

**Note**: The app will work with partial API keys. Open-Meteo and Weather.gov don't require API keys.

### Getting API Keys

1. **OpenWeatherMap**: https://openweathermap.org/api
   - Sign up for free account
   - Get API key from dashboard
   - Free tier: 1,000 calls/day

2. **WeatherAPI.com**: https://www.weatherapi.com/
   - Sign up for free account
   - Free tier: 1,000,000 calls/month

3. **Tomorrow.io**: https://www.tomorrow.io/
   - Sign up for free account
   - Free tier: 500 calls/day

4. **Visual Crossing**: https://www.visualcrossing.com/
   - Sign up for free account
   - Free tier: 1,000 records/day

5. **Weatherbit**: https://www.weatherbit.io/
   - Sign up for free account
   - Free tier: 500 calls/day

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📦 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all API keys as environment variables

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

## 🏗️ Project Structure

```
weather/
├── src/
│   ├── components/          # React components
│   │   ├── LocationSearch.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── DetailedMetrics.tsx
│   │   ├── WeatherMap.tsx
│   │   ├── WeatherAlerts.tsx
│   │   └── SourceComparison.tsx
│   ├── contexts/            # React contexts
│   │   └── WeatherContext.tsx
│   ├── services/            # API services
│   │   └── weatherService.ts
│   ├── types/               # TypeScript types
│   │   └── weather.types.ts
│   ├── utils/               # Utility functions
│   │   ├── dataAggregation.ts
│   │   └── unitConversion.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── api/                     # Serverless functions
│   ├── weather.ts           # Fetch weather data
│   └── alerts.ts            # Fetch weather alerts
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── vercel.json              # Vercel configuration
```

## 🔧 Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet / React Leaflet
- **Charts**: Recharts
- **API Layer**: Vercel Serverless Functions
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📊 Data Aggregation Algorithm

The app uses sophisticated algorithms to aggregate data from multiple sources:

1. **Median-based aggregation**: Uses median instead of mean to reduce impact of outliers
2. **Confidence scoring**: Calculates confidence based on:
   - Agreement between sources (lower variation = higher confidence)
   - Number of successful sources (more sources = higher confidence)
3. **Graceful degradation**: Works with any number of sources (1-7)
4. **Error handling**: Individual API failures don't break the entire app

## 🌈 Features Showcase

### Aggregated Weather Data
View weather information from multiple sources combined into a single, accurate reading with confidence scores.

### Source Comparison
See individual data from each source side-by-side to understand variations and reliability.

### Interactive Maps
Visualize weather patterns with toggleable layers for temperature, precipitation, clouds, and wind.

### Weather Alerts
Get notified about severe weather conditions with detailed information from multiple alert systems.

### Smart Caching
Reduce API calls and improve performance with intelligent caching (10-minute default).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Weather data provided by OpenWeatherMap, WeatherAPI, Open-Meteo, Weather.gov, and others
- Map tiles from OpenStreetMap
- Icons and UI inspiration from various weather apps

## 📮 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ and ☁️ by the Weather Aggregator team

