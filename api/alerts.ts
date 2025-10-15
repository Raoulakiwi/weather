import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface WeatherAlert {
  event: string;
  headline: string;
  description: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor' | 'unknown';
  start: number;
  end: number;
  source: string;
}

// Fetch alerts from Weather.gov (US only)
const fetchWeatherGovAlerts = async (lat: number, lon: number): Promise<WeatherAlert[]> => {
  try {
    const response = await axios.get(
      `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
      { headers: { 'User-Agent': 'WeatherAggregator/1.0' } }
    );
    
    const features = response.data.features || [];
    
    return features.map((feature: any) => {
      const props = feature.properties;
      const severityMap: { [key: string]: 'extreme' | 'severe' | 'moderate' | 'minor' | 'unknown' } = {
        'Extreme': 'extreme',
        'Severe': 'severe',
        'Moderate': 'moderate',
        'Minor': 'minor',
      };
      
      return {
        event: props.event || 'Weather Alert',
        headline: props.headline || props.event || 'Weather Alert',
        description: props.description || '',
        severity: severityMap[props.severity] || 'unknown',
        start: new Date(props.onset || props.effective).getTime(),
        end: new Date(props.ends || props.expires).getTime(),
        source: 'Weather.gov',
      };
    });
  } catch (error) {
    return [];
  }
};

// Fetch alerts from OpenWeatherMap
const fetchOpenWeatherMapAlerts = async (lat: number, lon: number): Promise<WeatherAlert[]> => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return [];
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    
    const alerts = response.data.alerts || [];
    
    return alerts.map((alert: any) => ({
      event: alert.event,
      headline: alert.event,
      description: alert.description,
      severity: 'moderate' as const,
      start: alert.start * 1000,
      end: alert.end * 1000,
      source: 'OpenWeatherMap',
    }));
  } catch (error) {
    return [];
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon parameters' });
  }
  
  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lon as string);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid lat or lon parameters' });
  }
  
  // Fetch alerts from all sources in parallel
  const [nwsAlerts, owmAlerts] = await Promise.all([
    fetchWeatherGovAlerts(latitude, longitude),
    fetchOpenWeatherMapAlerts(latitude, longitude),
  ]);
  
  const allAlerts = [...nwsAlerts, ...owmAlerts];
  
  // Remove duplicates and sort by severity
  const uniqueAlerts = allAlerts.filter((alert, index, self) =>
    index === self.findIndex(a => a.event === alert.event && a.start === alert.start)
  );
  
  const severityOrder = { extreme: 0, severe: 1, moderate: 2, minor: 3, unknown: 4 };
  uniqueAlerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  return res.status(200).json({
    success: true,
    alerts: uniqueAlerts,
    timestamp: Date.now(),
  });
}

