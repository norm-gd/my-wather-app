export interface WeatherMain {
  temp: number;
  humidity: number;
  feels_like: number;
}

export interface WeatherSys {
  country: string;
}

export interface WeatherCoord {
  lon: number;
  lat: number;
}

export interface WeatherData {
  name: string;
  main: WeatherMain;
  sys: WeatherSys;
  coord: WeatherCoord;
}