export type TemperatureUnit = 'F' | 'C';

export function kelvinToFahrenheit(kelvin: number): number {
  return Math.ceil(((kelvin - 273.15) * 9) / 5 + 32);
}

export function kelvinToCelsius(kelvin: number): number {
  return Math.ceil(kelvin - 273.15);
}

export function formatTemp(kelvin: number, unit: TemperatureUnit): string {
  const temp = unit === 'F' ? kelvinToFahrenheit(kelvin) : kelvinToCelsius(kelvin);
  return `${temp}°${unit}`;
}