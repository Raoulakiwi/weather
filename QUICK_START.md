# Weather Aggregator - Quick Start

Get up and running in 5 minutes!

## ⚡ Quick Installation

### 1. Install Dependencies (2 minutes)

```bash
npm install
```

Wait for all packages to download and install.

### 2. Set Up API Keys (2 minutes)

**Minimum Required** (at least 1):

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add at least one API key:
# - OpenWeatherMap (recommended): https://openweathermap.org/api
# - WeatherAPI.com (recommended): https://www.weatherapi.com/
```

**Note**: Open-Meteo and Weather.gov work without API keys!

### 3. Start Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 🎉

## ✅ Quick Test

1. Click "Use Current Location" button
2. Or search for "New York"
3. You should see:
   - Current weather with temperature
   - Detailed metrics
   - Hourly forecast charts
   - 7-day forecast
   - Interactive map

## 🚀 Deploy in 5 Minutes

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted
```

That's it! Your app is live! 🌟

## 📚 Need More Help?

- **Full Setup**: See SETUP_GUIDE.md
- **Deployment**: See DEPLOYMENT_GUIDE.md
- **How It Works**: See AGGREGATION_EXPLAINED.md
- **Complete Docs**: See README.md

## 🆘 Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### API not working
- Check your `.env` file exists
- Verify API keys are correct
- Check you haven't exceeded rate limits

### Port 3000 in use
```bash
# Use different port
npm run dev -- --port 3001
```

## 🎯 Project Structure at a Glance

```
weather/
├── src/components/  ← React UI components
├── api/            ← Serverless API functions
├── src/utils/      ← Aggregation algorithms
└── .env            ← Your API keys (create this!)
```

## 🔑 API Keys Reminder

Get free API keys from:

1. **OpenWeatherMap**: https://openweathermap.org/api (1,000 calls/day)
2. **WeatherAPI**: https://www.weatherapi.com/ (1M calls/month)

Both have generous free tiers perfect for this project!

## 🌟 What Makes This Special?

- **Multi-source**: Combines 5-7 weather APIs
- **Accurate**: Uses median aggregation (not just average)
- **Reliable**: Works even if some APIs fail
- **Transparent**: Shows confidence scores
- **Beautiful**: Modern, responsive UI
- **Production-ready**: Complete error handling

## 💡 Pro Tips

1. Start with just OpenWeatherMap for testing
2. Add more API keys for better accuracy
3. Cache duration is 10 minutes (adjustable)
4. Dark mode button is in the header
5. Click "View Sources" to see individual API data

## 🎓 Learning Features

Perfect for learning:
- React + TypeScript
- API aggregation
- Data normalization
- Serverless functions
- State management
- Responsive design

## 📝 Next Steps

Once running:

1. ✅ Test all features
2. ✅ Try different locations
3. ✅ Check source comparison
4. ✅ View weather alerts (if available)
5. ✅ Test dark/light mode
6. ✅ Check mobile responsiveness
7. ✅ Review the code
8. ✅ Deploy to Vercel

## 🎉 That's It!

You now have a production-ready weather aggregation app running locally!

---

**Questions?** Check the documentation files or the README.md

**Happy Coding!** 🌤️

