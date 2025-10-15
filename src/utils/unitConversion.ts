// Unit conversion utilities

export const kelvinToCelsius = (kelvin: number): number => {
  return kelvin - 273.15;
};

export const kelvinToFahrenheit = (kelvin: number): number => {
  return (kelvin - 273.15) * 9/5 + 32;
};

export const celsiusToFahrenheit = (celsius: number): number => {
  return celsius * 9/5 + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

export const mpsToMph = (mps: number): number => {
  return mps * 2.23694;
};

export const mpsToKmh = (mps: number): number => {
  return mps * 3.6;
};

export const kmhToMph = (kmh: number): number => {
  return kmh * 0.621371;
};

export const mphToMps = (mph: number): number => {
  return mph * 0.44704;
};

export const metersToMiles = (meters: number): number => {
  return meters * 0.000621371;
};

export const metersToKm = (meters: number): number => {
  return meters / 1000;
};

export const hpaToInHg = (hpa: number): number => {
  return hpa * 0.02953;
};

export const mmToInches = (mm: number): number => {
  return mm * 0.0393701;
};

export const degreesToCardinal = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const normalizeTemperature = (temp: number, unit: 'C' | 'F' | 'K'): number => {
  // Normalize to Celsius
  switch (unit) {
    case 'F':
      return fahrenheitToCelsius(temp);
    case 'K':
      return kelvinToCelsius(temp);
    default:
      return temp;
  }
};

export const normalizeWindSpeed = (speed: number, unit: 'mps' | 'mph' | 'kmh'): number => {
  // Normalize to m/s
  switch (unit) {
    case 'mph':
      return mphToMps(speed);
    case 'kmh':
      return speed / 3.6;
    default:
      return speed;
  }
};

