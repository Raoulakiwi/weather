# Weather Aggregator - Setup Guide

This guide will walk you through setting up and running the Weather Aggregator application.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js**: Version 16 or higher
- **npm**: Usually comes with Node.js
- A code editor (VS Code recommended)
- A terminal/command prompt

## Step-by-Step Setup

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Leaflet (maps)
- Recharts (charts)
- date-fns (date handling)
- And more...

### 2. Set Up Environment Variables

The application uses multiple weather APIs. While some work without API keys, you'll get the best experience with keys from all sources.

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` in your code editor

3. Get API keys from these services (all have free tiers):

#### Required/Recommended APIs:

**OpenWeatherMap** (Recommended)
- Visit: https://openweathermap.org/api
- Sign up for a free account
- Go to API Keys section
- Copy your API key
- Add to `.env`: `OPENWEATHER_API_KEY=your_key_here`
- Free tier: 1,000 calls/day, 60 calls/minute

**WeatherAPI.com** (Recommended)
- Visit: https://www.weatherapi.com/
- Sign up for a free account
- Copy API key from dashboard
- Add to `.env`: `WEATHERAPI_KEY=your_key_here`
- Free tier: 1,000,000 calls/month

#### Optional APIs (for more data sources):

**Tomorrow.io**
- Visit: https://www.tomorrow.io/
- Sign up
- Get API key
- Add to `.env`: `TOMORROW_API_KEY=your_key_here`

**Visual Crossing**
- Visit: https://www.visualcrossing.com/
- Sign up
- Get API key
- Add to `.env`: `VISUAL_CROSSING_API_KEY=your_key_here`

**Weatherbit**
- Visit: https://www.weatherbit.io/
- Sign up
- Get API key
- Add to `.env`: `WEATHERBIT_API_KEY=your_key_here`

#### No API Key Required:

**Open-Meteo**: Free, no registration needed
**Weather.gov (NWS)**: Free, US only, no registration needed

### 3. Start Development Server

Run the development server:

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 4. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Use Current Location" or search for a city
3. View aggregated weather data from multiple sources
4. Explore different features:
   - Current weather with confidence scores
   - View source comparison
   - Detailed metrics
   - Hourly forecast with charts
   - 7-day forecast
   - Interactive weather map
   - Weather alerts (if any)

## Common Issues and Solutions

### Issue: "Cannot find module" errors

**Solution**: Make sure you've run `npm install` to install all dependencies.

### Issue: API requests failing

**Solution**: 
1. Check your `.env` file has correct API keys
2. Verify API keys are valid (not expired)
3. Check if you've exceeded rate limits
4. The app will still work with partial API keys - it aggregates from available sources

### Issue: "Port 3000 is already in use"

**Solution**: Either:
- Stop the process using port 3000
- Or change the port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to any available port
}
```

### Issue: Maps not displaying

**Solution**: 
- Make sure you have an internet connection (maps load tiles from online)
- Check browser console for errors
- Clear browser cache and reload

### Issue: Dark mode not working

**Solution**: 
- Clear localStorage: Open browser console and run `localStorage.clear()`
- Reload the page

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant updates as you code. Just save your files and see changes immediately in the browser.

### TypeScript

The project uses TypeScript for type safety. If you see red squiggly lines in your editor:
- Make sure you have TypeScript language support installed
- VS Code users: Install "TypeScript and JavaScript Language Features"

### Tailwind CSS

The project uses Tailwind for styling. IntelliSense can help:
- VS Code: Install "Tailwind CSS IntelliSense" extension

### Debugging

Use browser DevTools:
1. Press F12 in your browser
2. Check Console tab for errors
3. Check Network tab to see API requests
4. Use React DevTools extension for component inspection

## Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

Test the production build locally:

```bash
npm run preview
```

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts to link your project

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Environment Variables section
   - Add all your API keys

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

4. Add environment variables in Netlify dashboard

## Project Structure Overview

```
weather/
├── api/                     # Serverless API functions
│   ├── weather.ts          # Fetches from all weather APIs
│   └── alerts.ts           # Fetches weather alerts
├── src/
│   ├── components/         # React components
│   ├── contexts/           # React context (state management)
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind config
├── vite.config.ts          # Vite config
└── vercel.json             # Vercel deployment config
```

## API Rate Limits

Be aware of rate limits for free tiers:

- **OpenWeatherMap**: 1,000 calls/day (≈42 calls/hour)
- **WeatherAPI**: 1,000,000 calls/month (very generous)
- **Open-Meteo**: Unlimited (free)
- **Weather.gov**: Unlimited (free, US only)

The app caches data for 10 minutes to reduce API calls.

## Need Help?

If you encounter issues:

1. Check this guide thoroughly
2. Check the main README.md
3. Look for error messages in browser console
4. Verify all dependencies are installed
5. Make sure Node.js version is 16+

## Next Steps

Once you have the app running:

1. Explore the codebase
2. Customize the UI colors in `tailwind.config.js`
3. Add more weather data sources
4. Adjust caching duration in `weatherService.ts`
5. Customize aggregation algorithms in `dataAggregation.ts`

Happy coding! 🌤️

