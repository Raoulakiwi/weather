import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface WeatherSource {
  name: string;
  fetch: (lat: number, lon: number) => Promise<any>;
}

// Normalize data from OpenWeatherMap
const fetchOpenWeatherMap = async (lat: number, lon: number) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('Missing API key');
  
  const response = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  
  const data = response.data;
  
  return {
    current: {
      temperature: data.current.temp,
      feelsLike: data.current.feels_like,
      condition: data.current.weather[0].description,
      conditionCode: data.current.weather[0].id.toString(),
      humidity: data.current.humidity,
      pressure: data.current.pressure,
      windSpeed: data.current.wind_speed,
      windDegree: data.current.wind_deg,
      cloudCover: data.current.clouds,
      visibility: data.current.visibility,
      uvIndex: data.current.uvi,
      dewPoint: data.current.dew_point,
      timestamp: data.current.dt * 1000,
    },
    hourly: data.hourly.slice(0, 48).map((h: any) => ({
      time: h.dt * 1000,
      temperature: h.temp,
      feelsLike: h.feels_like,
      condition: h.weather[0].description,
      precipitationChance: (h.pop || 0) * 100,
      humidity: h.humidity,
      windSpeed: h.wind_speed,
      windDegree: h.wind_deg,
    })),
    daily: data.daily.slice(0, 7).map((d: any) => ({
      date: d.dt * 1000,
      tempMax: d.temp.max,
      tempMin: d.temp.min,
      condition: d.weather[0].description,
      precipitationChance: (d.pop || 0) * 100,
      humidity: d.humidity,
      windSpeed: d.wind_speed,
      uvIndex: d.uvi,
      sunrise: d.sunrise * 1000,
      sunset: d.sunset * 1000,
    })),
  };
};

// Normalize data from WeatherAPI.com
const fetchWeatherAPI = async (lat: number, lon: number) => {
  const apiKey = process.env.WEATHERAPI_KEY;
  if (!apiKey) throw new Error('Missing API key');
  
  const response = await axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no`
  );
  
  const data = response.data;
  
  return {
    current: {
      temperature: data.current.temp_c,
      feelsLike: data.current.feelslike_c,
      condition: data.current.condition.text,
      conditionCode: data.current.condition.code.toString(),
      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,
      windSpeed: data.current.wind_kph / 3.6, // Convert to m/s
      windDegree: data.current.wind_degree,
      windDirection: data.current.wind_dir,
      cloudCover: data.current.cloud,
      visibility: data.current.vis_km * 1000, // Convert to meters
      uvIndex: data.current.uv,
      precipitation: data.current.precip_mm,
      timestamp: new Date(data.current.last_updated).getTime(),
    },
    hourly: data.forecast.forecastday.flatMap((day: any) =>
      day.hour.map((h: any) => ({
        time: h.time_epoch * 1000,
        temperature: h.temp_c,
        feelsLike: h.feelslike_c,
        condition: h.condition.text,
        precipitationChance: h.chance_of_rain || h.chance_of_snow,
        precipitationAmount: h.precip_mm,
        humidity: h.humidity,
        windSpeed: h.wind_kph / 3.6,
        windDegree: h.wind_degree,
      }))
    ).slice(0, 48),
    daily: data.forecast.forecastday.map((d: any) => ({
      date: d.date_epoch * 1000,
      tempMax: d.day.maxtemp_c,
      tempMin: d.day.mintemp_c,
      condition: d.day.condition.text,
      precipitationChance: d.day.daily_chance_of_rain || d.day.daily_chance_of_snow,
      precipitationAmount: d.day.totalprecip_mm,
      humidity: d.day.avghumidity,
      windSpeed: d.day.maxwind_kph / 3.6,
      uvIndex: d.day.uv,
      sunrise: new Date(`${d.date} ${d.astro.sunrise}`).getTime(),
      sunset: new Date(`${d.date} ${d.astro.sunset}`).getTime(),
    })),
  };
};

// Fetch from Open-Meteo (no API key required)
const fetchOpenMeteo = async (lat: number, lon: number) => {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
  );
  
  const data = response.data;
  const weatherCodeToCondition = (code: number): string => {
    const codes: { [key: number]: string } = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
      55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 80: 'Slight rain showers',
      81: 'Moderate rain showers', 82: 'Violent rain showers', 95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
    };
    return codes[code] || 'Unknown';
  };
  
  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      condition: weatherCodeToCondition(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.pressure_msl,
      windSpeed: data.current.wind_speed_10m / 3.6, // Convert km/h to m/s
      windDegree: data.current.wind_direction_10m,
      cloudCover: data.current.cloud_cover,
      visibility: 10000, // Default
      uvIndex: 0, // Not provided
      precipitation: data.current.precipitation,
      timestamp: new Date(data.current.time).getTime(),
    },
    hourly: data.hourly.time.slice(0, 48).map((_: any, i: number) => ({
      time: new Date(data.hourly.time[i]).getTime(),
      temperature: data.hourly.temperature_2m[i],
      feelsLike: data.hourly.apparent_temperature[i],
      condition: weatherCodeToCondition(data.hourly.weather_code[i]),
      precipitationChance: data.hourly.precipitation_probability[i] || 0,
      humidity: data.hourly.relative_humidity_2m[i],
      windSpeed: data.hourly.wind_speed_10m[i] / 3.6,
      windDegree: data.hourly.wind_direction_10m[i],
    })),
    daily: data.daily.time.map((_: any, i: number) => ({
      date: new Date(data.daily.time[i]).getTime(),
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      condition: weatherCodeToCondition(data.daily.weather_code[i]),
      precipitationChance: data.daily.precipitation_probability_max[i] || 0,
      humidity: 0, // Not provided
      windSpeed: data.daily.wind_speed_10m_max[i] / 3.6,
    })),
  };
};

// Fetch from Weather.gov (NWS) - US only, no API key required
const fetchWeatherGov = async (lat: number, lon: number) => {
  try {
    // First, get the grid point
    const pointResponse = await axios.get(
      `https://api.weather.gov/points/${lat},${lon}`,
      { headers: { 'User-Agent': 'WeatherAggregator/1.0' } }
    );
    
    const { forecast, forecastHourly } = pointResponse.data.properties;
    
    // Get forecast
    const forecastResponse = await axios.get(forecast, {
      headers: { 'User-Agent': 'WeatherAggregator/1.0' }
    });
    
    const hourlyResponse = await axios.get(forecastHourly, {
      headers: { 'User-Agent': 'WeatherAggregator/1.0' }
    });
    
    const periods = forecastResponse.data.properties.periods;
    const hourlyPeriods = hourlyResponse.data.properties.periods;
    
    // Current is first hourly period
    const current = hourlyPeriods[0];
    
    return {
      current: {
        temperature: (current.temperature - 32) * 5/9, // Convert F to C
        feelsLike: (current.temperature - 32) * 5/9,
        condition: current.shortForecast,
        humidity: current.relativeHumidity?.value || 0,
        pressure: 1013, // Default
        windSpeed: parseFloat(current.windSpeed.split(' ')[0]) * 0.44704, // mph to m/s
        windDegree: 0,
        windDirection: current.windDirection,
        cloudCover: 0,
        visibility: 10000,
        uvIndex: 0,
        timestamp: new Date(current.startTime).getTime(),
      },
      hourly: hourlyPeriods.slice(0, 48).map((h: any) => ({
        time: new Date(h.startTime).getTime(),
        temperature: (h.temperature - 32) * 5/9,
        feelsLike: (h.temperature - 32) * 5/9,
        condition: h.shortForecast,
        precipitationChance: h.probabilityOfPrecipitation?.value || 0,
        humidity: h.relativeHumidity?.value || 0,
        windSpeed: parseFloat(h.windSpeed.split(' ')[0]) * 0.44704,
        windDegree: 0,
      })),
      daily: periods.filter((_: any, i: number) => i % 2 === 0).slice(0, 7).map((d: any, i: number) => {
        const night = periods[i * 2 + 1];
        return {
          date: new Date(d.startTime).getTime(),
          tempMax: (d.temperature - 32) * 5/9,
          tempMin: night ? (night.temperature - 32) * 5/9 : (d.temperature - 32) * 5/9,
          condition: d.shortForecast,
          precipitationChance: d.probabilityOfPrecipitation?.value || 0,
          humidity: d.relativeHumidity?.value || 0,
          windSpeed: parseFloat(d.windSpeed.split(' ')[0]) * 0.44704,
        };
      }),
    };
  } catch (error) {
    // Weather.gov only works for US locations
    throw new Error('Location not in US coverage area');
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
  
  // Define weather sources
  const sources: WeatherSource[] = [
    { name: 'OpenWeatherMap', fetch: fetchOpenWeatherMap },
    { name: 'WeatherAPI', fetch: fetchWeatherAPI },
    { name: 'Open-Meteo', fetch: fetchOpenMeteo },
    { name: 'Weather.gov', fetch: fetchWeatherGov },
  ];
  
  // Fetch from all sources in parallel
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      try {
        const data = await source.fetch(latitude, longitude);
        return {
          source: source.name,
          success: true,
          timestamp: Date.now(),
          ...data,
        };
      } catch (error: any) {
        return {
          source: source.name,
          success: false,
          error: error.message,
          timestamp: Date.now(),
        };
      }
    })
  );
  
  const sourceData = results.map(result => 
    result.status === 'fulfilled' ? result.value : result.reason
  );
  
  return res.status(200).json({
    success: true,
    sources: sourceData,
    timestamp: Date.now(),
  });
}

