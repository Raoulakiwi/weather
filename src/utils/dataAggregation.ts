import { MetricValue, SourceWeatherData, AggregatedCurrent, HourlyForecast, AggregatedHourlyForecast, DailyForecast, AggregatedDailyForecast } from '../types/weather.types';

// Calculate aggregated metric value with confidence scoring
export const aggregateMetric = (values: (number | undefined)[]): MetricValue => {
  const validValues = values.filter((v): v is number => v !== undefined && !isNaN(v));
  
  if (validValues.length === 0) {
    return {
      value: 0,
      min: 0,
      max: 0,
      confidence: 0,
      sourceCount: 0,
    };
  }

  const sorted = [...validValues].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  // Use median for more robust aggregation
  let value: number;
  if (sorted.length % 2 === 0) {
    value = (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  } else {
    value = sorted[Math.floor(sorted.length / 2)];
  }

  // Calculate confidence based on agreement between sources
  const range = max - min;
  const avgValue = Math.abs(value) || 1;
  const variationPercent = (range / avgValue) * 100;
  
  // Lower variation = higher confidence
  let confidence = 100;
  if (variationPercent > 50) confidence = 30;
  else if (variationPercent > 30) confidence = 50;
  else if (variationPercent > 15) confidence = 70;
  else if (variationPercent > 5) confidence = 85;
  
  // Boost confidence with more sources
  const sourceBonus = Math.min(validValues.length * 2, 10);
  confidence = Math.min(confidence + sourceBonus, 100);

  return {
    value,
    min,
    max,
    confidence,
    sourceCount: validValues.length,
  };
};

// Find most common condition across sources
export const aggregateCondition = (conditions: (string | undefined)[]): { condition: string; confidence: number } => {
  const validConditions = conditions.filter((c): c is string => c !== undefined && c !== '');
  
  if (validConditions.length === 0) {
    return { condition: 'Unknown', confidence: 0 };
  }

  // Normalize conditions (lowercase, trim)
  const normalized = validConditions.map(c => c.toLowerCase().trim());
  
  // Count occurrences
  const counts = new Map<string, number>();
  normalized.forEach(condition => {
    counts.set(condition, (counts.get(condition) || 0) + 1);
  });

  // Find most common
  let maxCount = 0;
  let mostCommon = '';
  counts.forEach((count, condition) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = condition;
    }
  });

  // Calculate confidence based on agreement
  const confidence = (maxCount / validConditions.length) * 100;

  // Capitalize first letter of each word
  const formatted = mostCommon
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return { condition: formatted, confidence };
};

// Aggregate current weather from multiple sources
export const aggregateCurrentWeather = (sources: SourceWeatherData[]): AggregatedCurrent | undefined => {
  const successfulSources = sources.filter(s => s.success && s.current);
  
  if (successfulSources.length === 0) {
    return undefined;
  }

  const currents = successfulSources.map(s => s.current!);
  
  const { condition, confidence: conditionConfidence } = aggregateCondition(
    currents.map(c => c.condition)
  );

  return {
    temperature: aggregateMetric(currents.map(c => c.temperature)),
    feelsLike: aggregateMetric(currents.map(c => c.feelsLike)),
    condition,
    conditionConfidence,
    humidity: aggregateMetric(currents.map(c => c.humidity)),
    pressure: aggregateMetric(currents.map(c => c.pressure)),
    windSpeed: aggregateMetric(currents.map(c => c.windSpeed)),
    windDegree: aggregateMetric(currents.map(c => c.windDegree)),
    cloudCover: aggregateMetric(currents.map(c => c.cloudCover)),
    visibility: aggregateMetric(currents.map(c => c.visibility)),
    uvIndex: aggregateMetric(currents.map(c => c.uvIndex)),
    dewPoint: aggregateMetric(currents.map(c => c.dewPoint)),
    precipitation: aggregateMetric(currents.map(c => c.precipitation)),
    timestamp: Date.now(),
  };
};

// Aggregate hourly forecasts
export const aggregateHourlyForecasts = (sources: SourceWeatherData[]): AggregatedHourlyForecast[] => {
  const successfulSources = sources.filter(s => s.success && s.hourly && s.hourly.length > 0);
  
  if (successfulSources.length === 0) {
    return [];
  }

  // Group forecasts by time (rounded to nearest hour)
  const timeGroups = new Map<number, HourlyForecast[]>();
  
  successfulSources.forEach(source => {
    source.hourly!.forEach(forecast => {
      const roundedTime = Math.floor(forecast.time / 3600000) * 3600000;
      if (!timeGroups.has(roundedTime)) {
        timeGroups.set(roundedTime, []);
      }
      timeGroups.get(roundedTime)!.push(forecast);
    });
  });

  // Aggregate each time group
  const aggregated: AggregatedHourlyForecast[] = [];
  
  timeGroups.forEach((forecasts, time) => {
    const { condition } = aggregateCondition(forecasts.map(f => f.condition));
    
    aggregated.push({
      time,
      temperature: aggregateMetric(forecasts.map(f => f.temperature)),
      feelsLike: aggregateMetric(forecasts.map(f => f.feelsLike)),
      condition,
      precipitationChance: aggregateMetric(forecasts.map(f => f.precipitationChance)),
      humidity: aggregateMetric(forecasts.map(f => f.humidity)),
      windSpeed: aggregateMetric(forecasts.map(f => f.windSpeed)),
    });
  });

  // Sort by time and limit to 48 hours
  return aggregated
    .sort((a, b) => a.time - b.time)
    .slice(0, 48);
};

// Aggregate daily forecasts
export const aggregateDailyForecasts = (sources: SourceWeatherData[]): AggregatedDailyForecast[] => {
  const successfulSources = sources.filter(s => s.success && s.daily && s.daily.length > 0);
  
  if (successfulSources.length === 0) {
    return [];
  }

  // Group forecasts by date (rounded to day)
  const dateGroups = new Map<number, DailyForecast[]>();
  
  successfulSources.forEach(source => {
    source.daily!.forEach(forecast => {
      const dayStart = Math.floor(forecast.date / 86400000) * 86400000;
      if (!dateGroups.has(dayStart)) {
        dateGroups.set(dayStart, []);
      }
      dateGroups.get(dayStart)!.push(forecast);
    });
  });

  // Aggregate each date group
  const aggregated: AggregatedDailyForecast[] = [];
  
  dateGroups.forEach((forecasts, date) => {
    const { condition } = aggregateCondition(forecasts.map(f => f.condition));
    
    aggregated.push({
      date,
      tempMax: aggregateMetric(forecasts.map(f => f.tempMax)),
      tempMin: aggregateMetric(forecasts.map(f => f.tempMin)),
      condition,
      precipitationChance: aggregateMetric(forecasts.map(f => f.precipitationChance)),
      humidity: aggregateMetric(forecasts.map(f => f.humidity)),
      windSpeed: aggregateMetric(forecasts.map(f => f.windSpeed)),
      uvIndex: aggregateMetric(forecasts.map(f => f.uvIndex)),
    });
  });

  // Sort by date and limit to 7 days
  return aggregated
    .sort((a, b) => a.date - b.date)
    .slice(0, 7);
};

