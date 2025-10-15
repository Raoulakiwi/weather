# Deployment Guide - Weather Aggregator

This guide covers deploying the Weather Aggregator application to various platforms.

## Vercel Deployment (Recommended)

Vercel is recommended because it has built-in support for serverless functions, which this app uses.

### Prerequisites

- GitHub/GitLab/Bitbucket account (recommended for automatic deployments)
- Vercel account (free tier is sufficient)
- All your API keys ready

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   OPENWEATHER_API_KEY=your_key_here
   WEATHERAPI_KEY=your_key_here
   TOMORROW_API_KEY=your_key_here
   VISUAL_CROSSING_API_KEY=your_key_here
   WEATHERBIT_API_KEY=your_key_here
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? weather-aggregator
   - Directory? ./
   - Override settings? No

5. **Add Environment Variables**
   ```bash
   vercel env add OPENWEATHER_API_KEY
   vercel env add WEATHERAPI_KEY
   vercel env add TOMORROW_API_KEY
   vercel env add VISUAL_CROSSING_API_KEY
   vercel env add WEATHERBIT_API_KEY
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch automatically deploys to production
- Pull requests get preview deployments
- Rollback to previous versions with one click

---

## Netlify Deployment

Netlify can also host the frontend, but serverless functions require the Netlify Functions format.

### Option 1: Frontend Only (Limited Functionality)

If you deploy only the frontend to Netlify, you'll need to handle CORS issues with direct API calls.

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login**
   ```bash
   netlify login
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Add Environment Variables**
   - Go to Netlify dashboard
   - Site settings > Environment variables
   - Add all API keys with `VITE_` prefix:
     - `VITE_OPENWEATHER_API_KEY`
     - `VITE_WEATHERAPI_KEY`
     - etc.

**Note**: This approach exposes API keys in the browser. Not recommended for production.

### Option 2: With Netlify Functions (Full Functionality)

Convert Vercel serverless functions to Netlify format:

1. **Create `netlify/functions` directory**

2. **Convert functions** (example for weather.ts):
   ```typescript
   // netlify/functions/weather.ts
   import { Handler } from '@netlify/functions';
   // ... rest of code from api/weather.ts
   
   export const handler: Handler = async (event) => {
     const { lat, lon } = event.queryStringParameters;
     // ... implementation
   };
   ```

3. **Update `vercel.json` to `netlify.toml`**:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
     functions = "netlify/functions"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## Alternative Platforms

### AWS Amplify

1. Connect GitHub repository
2. Build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       build:
         commands:
           - npm install
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables in Amplify console

### Railway

1. Connect GitHub repository
2. Add environment variables
3. Railway auto-detects Node.js and deploys

### Render

1. Create new Web Service
2. Connect repository
3. Build command: `npm run build`
4. Start command: `npm run preview`
5. Add environment variables

---

## Post-Deployment Checklist

After deploying, verify:

- ✅ Site loads correctly
- ✅ Location search works
- ✅ Current location button works
- ✅ Weather data loads from multiple sources
- ✅ Maps display correctly
- ✅ Charts render properly
- ✅ Dark mode toggle works
- ✅ All API calls succeed (check browser console)
- ✅ No CORS errors
- ✅ Mobile responsive design works

## Monitoring and Maintenance

### Check API Usage

Monitor your API key usage to avoid exceeding limits:

- **OpenWeatherMap**: https://home.openweathermap.org/api_keys
- **WeatherAPI**: https://www.weatherapi.com/my/
- **Tomorrow.io**: Dashboard > Usage
- **Visual Crossing**: Account > Usage
- **Weatherbit**: Dashboard > Usage

### Set Up Alerts

In Vercel:
1. Settings > Alerts
2. Enable deployment alerts
3. Enable error rate alerts

### Performance Monitoring

Use Vercel Analytics (free):
1. Enable Analytics in dashboard
2. Monitor Core Web Vitals
3. Track user interactions

### Update Dependencies

Regularly update packages:
```bash
npm outdated
npm update
```

For major updates:
```bash
npx npm-check-updates -u
npm install
```

### Backup

Vercel automatically maintains deployment history, but also:
- Keep GitHub repository updated
- Tag releases: `git tag v1.0.0`
- Document changes in CHANGELOG.md

---

## Troubleshooting

### Deployment Fails

**Check build logs**:
- Vercel: Deployments > Click failed deployment > View logs
- Look for error messages

**Common issues**:
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Fix all type errors before deploying
- Environment variables: Ensure all keys are set

### API Calls Fail in Production

**CORS Issues**:
- Ensure API calls go through serverless functions, not directly
- Check API base URL in `weatherService.ts`

**Rate Limits**:
- Check API provider dashboards
- Increase cache duration in `weatherService.ts`

### Serverless Functions Timeout

Default timeout is 10 seconds. If requests timeout:
1. In `vercel.json`, increase `maxDuration`:
   ```json
   {
     "functions": {
       "api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```
2. Optimize API calls (make parallel requests)

### High Bandwidth Usage

**Optimize images**:
- Compress assets in `public/`
- Use WebP format

**Reduce API calls**:
- Increase cache duration
- Implement request debouncing

---

## Domain Setup

### Add Custom Domain (Vercel)

1. Go to Project Settings > Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Add records to your domain registrar:
   - A record or CNAME record as instructed
5. Wait for DNS propagation (can take up to 48 hours)

### SSL Certificate

Vercel automatically provides SSL certificates for all domains.

---

## Scaling Considerations

### Free Tier Limits

**Vercel Free Tier**:
- 100 GB bandwidth/month
- Serverless function execution: 100 GB-hours
- Usually sufficient for personal projects

**If you exceed limits**:
- Upgrade to Pro plan ($20/month)
- Or implement more aggressive caching
- Or use fewer API sources

### Performance Optimization

**For high traffic**:
1. Implement Redis caching (Vercel KV)
2. Use edge functions for geolocation
3. Implement API request queuing
4. Set up CDN for static assets

---

## Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Use platform environment variables

2. **Rotate API keys periodically**
   - Change keys every 3-6 months
   - Update in deployment platform

3. **Monitor for suspicious activity**
   - Check unusual API usage spikes
   - Review Vercel access logs

4. **Keep dependencies updated**
   - Security patches
   - Use `npm audit` regularly

---

## Support and Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: Vercel Discord server

---

Need help? Check the main README.md or SETUP_GUIDE.md first!

