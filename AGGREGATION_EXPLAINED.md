# Weather Data Aggregation - How It Works

This document explains how the Weather Aggregator combines data from multiple sources to provide accurate, reliable weather information.

## Overview

The app fetches weather data from 5-7 different weather services simultaneously and intelligently combines their responses to produce a single, accurate reading with confidence scores.

## Why Aggregate Data?

Different weather services use different:
- Weather stations
- Satellite data
- Prediction models
- Update frequencies

By combining multiple sources, we can:
- ✅ Increase accuracy through consensus
- ✅ Detect outliers and anomalies
- ✅ Provide data even when some sources fail
- ✅ Give users confidence scores
- ✅ Show data variation between sources

## Data Sources

### 1. OpenWeatherMap
- **Coverage**: Global
- **Update**: Every 10 minutes
- **Strengths**: Comprehensive data, good forecasts, weather maps
- **API Key**: Required

### 2. WeatherAPI.com
- **Coverage**: Global
- **Update**: Real-time
- **Strengths**: Detailed forecasts, high accuracy
- **API Key**: Required

### 3. Open-Meteo
- **Coverage**: Global
- **Update**: Hourly
- **Strengths**: Free, no API key, open source
- **API Key**: Not required

### 4. Weather.gov (NWS)
- **Coverage**: United States only
- **Update**: Hourly
- **Strengths**: Government source, detailed alerts, free
- **API Key**: Not required

### 5-7. Optional Sources
- Tomorrow.io
- Visual Crossing
- Weatherbit

## Aggregation Process

### Step 1: Parallel API Calls

```typescript
// Fetch from all sources simultaneously
const results = await Promise.allSettled([
  fetchOpenWeatherMap(lat, lon),
  fetchWeatherAPI(lat, lon),
  fetchOpenMeteo(lat, lon),
  fetchWeatherGov(lat, lon),
]);
```

**Key Points**:
- All requests happen in parallel (faster)
- Uses `Promise.allSettled` (doesn't fail if one API fails)
- Each source has its own error handling

### Step 2: Data Normalization

Each API returns data in different formats:

**Temperature**:
- OpenWeatherMap: Celsius
- WeatherAPI: Celsius
- Weather.gov: Fahrenheit → Convert to Celsius
- Open-Meteo: Celsius

**Wind Speed**:
- OpenWeatherMap: m/s
- WeatherAPI: km/h → Convert to m/s
- Weather.gov: mph → Convert to m/s
- Open-Meteo: km/h → Convert to m/s

All data is normalized to standard units before aggregation.

### Step 3: Metric Aggregation

For numerical values (temperature, humidity, wind speed, etc.):

```typescript
function aggregateMetric(values: number[]): MetricValue {
  // 1. Filter out invalid values
  const valid = values.filter(v => v !== undefined && !isNaN(v));
  
  // 2. Sort values
  const sorted = [...valid].sort((a, b) => a - b);
  
  // 3. Calculate median (not mean!)
  const median = calculateMedian(sorted);
  
  // 4. Get min and max
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  // 5. Calculate confidence
  const confidence = calculateConfidence(min, max, median, valid.length);
  
  return { value: median, min, max, confidence, sourceCount: valid.length };
}
```

#### Why Median Instead of Mean?

**Example**: Temperature readings: [20°C, 21°C, 22°C, 45°C]

- **Mean**: (20 + 21 + 22 + 45) / 4 = **27°C** ❌ (Inaccurate due to outlier)
- **Median**: (21 + 22) / 2 = **21.5°C** ✅ (Robust to outliers)

The median is less affected by erroneous readings from individual sources.

### Step 4: Confidence Scoring

Confidence is calculated based on two factors:

#### Factor 1: Agreement Between Sources

```typescript
const range = max - min;
const avgValue = Math.abs(value) || 1;
const variationPercent = (range / avgValue) * 100;

// Lower variation = Higher confidence
if (variationPercent > 50) confidence = 30;
else if (variationPercent > 30) confidence = 50;
else if (variationPercent > 15) confidence = 70;
else if (variationPercent > 5) confidence = 85;
else confidence = 100;
```

**Example**:
- Temperature readings: [20°C, 21°C, 20°C, 22°C]
- Range: 2°C
- Variation: 2/21 × 100 = 9.5%
- Confidence: 85% ✅ (Good agreement)

#### Factor 2: Number of Sources

```typescript
const sourceBonus = Math.min(validValues.length * 2, 10);
confidence = Math.min(confidence + sourceBonus, 100);
```

**Example**:
- Base confidence: 85%
- Sources responding: 5
- Bonus: 5 × 2 = 10%
- Final confidence: 95% ✅

More sources = More confidence in the result.

### Step 5: Condition Aggregation

For text values (weather conditions):

```typescript
function aggregateCondition(conditions: string[]): string {
  // 1. Normalize (lowercase, trim)
  const normalized = conditions.map(c => c.toLowerCase().trim());
  
  // 2. Count occurrences
  const counts = new Map<string, number>();
  normalized.forEach(condition => {
    counts.set(condition, (counts.get(condition) || 0) + 1);
  });
  
  // 3. Find most common
  const mostCommon = findMaxCount(counts);
  
  // 4. Calculate confidence
  const confidence = (maxCount / conditions.length) * 100;
  
  return { condition: capitalize(mostCommon), confidence };
}
```

**Example**:
- Conditions: ["Partly Cloudy", "Partly Cloudy", "Cloudy", "Overcast"]
- Count: { "partly cloudy": 2, "cloudy": 1, "overcast": 1 }
- Result: "Partly Cloudy" (50% confidence)

### Step 6: Forecast Aggregation

Hourly and daily forecasts are grouped by time:

```typescript
// Group forecasts by hour
const timeGroups = new Map<number, HourlyForecast[]>();

sources.forEach(source => {
  source.hourly.forEach(forecast => {
    // Round to nearest hour
    const roundedTime = Math.floor(forecast.time / 3600000) * 3600000;
    timeGroups.get(roundedTime).push(forecast);
  });
});

// Aggregate each time group
timeGroups.forEach((forecasts, time) => {
  aggregatedHourly.push({
    time,
    temperature: aggregateMetric(forecasts.map(f => f.temperature)),
    condition: aggregateCondition(forecasts.map(f => f.condition)),
    // ... other metrics
  });
});
```

This ensures forecasts are aligned by time across sources.

## Error Handling

### Graceful Degradation

The app works with any number of sources (even just 1):

```typescript
if (successfulSources.length === 0) {
  return undefined; // No data available
}

if (successfulSources.length < 3) {
  showWarning("Limited sources, accuracy may be reduced");
}
```

### Individual Source Failures

```typescript
const results = await Promise.allSettled(sources.map(fetchSource));

results.forEach(result => {
  if (result.status === 'fulfilled') {
    // Use data
  } else {
    // Log error, continue with other sources
    console.error('Source failed:', result.reason);
  }
});
```

One failed API doesn't break the entire application.

## Caching Strategy

To reduce API calls and improve performance:

```typescript
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

class Cache {
  private cache = new Map<string, CacheEntry>();
  
  get(key: string): Data | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      return null; // Expired or not found
    }
    return entry.data; // Return cached data
  }
  
  set(key: string, data: Data): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    });
  }
}
```

**Cache Key**: `"weather_${latitude}_${longitude}"`

**Benefits**:
- Reduces API calls (saves quota)
- Faster response times
- Lower bandwidth usage
- Better user experience

**Trade-offs**:
- Weather data could be up to 10 minutes old
- Adjustable in `weatherService.ts`

## Real-World Example

Let's walk through a complete example:

### Input
Location: New York City (40.7128°N, 74.0060°W)

### API Responses

**OpenWeatherMap**:
- Temperature: 22°C
- Condition: "Clear sky"
- Humidity: 65%
- Wind: 5 m/s

**WeatherAPI**:
- Temperature: 21°C
- Condition: "Sunny"
- Humidity: 68%
- Wind: 4.8 m/s

**Open-Meteo**:
- Temperature: 23°C
- Condition: "Clear"
- Humidity: 64%
- Wind: 5.2 m/s

**Weather.gov**:
- Temperature: 22°C (converted from 72°F)
- Condition: "Fair"
- Humidity: 66%
- Wind: 4.9 m/s

### Aggregation Results

**Temperature**:
- Values: [22, 21, 23, 22]
- Sorted: [21, 22, 22, 23]
- Median: 22°C ✅
- Range: 2°C
- Variation: 9.1%
- Confidence: 93% (85% base + 8% source bonus)

**Condition**:
- Values: ["Clear sky", "Sunny", "Clear", "Fair"]
- Normalized: ["clear sky", "sunny", "clear", "fair"]
- Most similar: Clear-related (3 out of 4)
- Result: "Clear" ✅
- Confidence: 75%

**Humidity**:
- Values: [65, 68, 64, 66]
- Median: 65.5%
- Confidence: 95%

**Wind Speed**:
- Values: [5, 4.8, 5.2, 4.9]
- Median: 4.95 m/s
- Confidence: 97%

### Final Display

```
Temperature: 22°C (range: 21-23°C)
Condition: Clear (High Confidence)
Humidity: 66% (range: 64-68%)
Wind: 4.9 m/s (range: 4.8-5.2 m/s)

Data from 4 of 4 sources
```

## Benefits of This Approach

1. **Accuracy**: Median aggregation removes outliers
2. **Reliability**: Works even when sources fail
3. **Transparency**: Users see confidence scores and ranges
4. **Flexibility**: Easy to add/remove data sources
5. **Performance**: Parallel requests and caching
6. **User Trust**: Shows individual source data on demand

## Customization

You can adjust the aggregation in `src/utils/dataAggregation.ts`:

- Change from median to mean
- Adjust confidence calculation
- Weight sources differently
- Filter sources by historical accuracy
- Add more sophisticated outlier detection

## Future Improvements

Potential enhancements:

1. **Machine Learning**: Learn which sources are most accurate for each location
2. **Historical Accuracy**: Weight sources based on past performance
3. **Weather Pattern Detection**: Identify which source is best for rain, snow, etc.
4. **User Feedback**: Let users report inaccurate data
5. **Ensemble Forecasting**: More sophisticated prediction algorithms

---

The aggregation approach makes this weather app unique and more reliable than single-source alternatives!

