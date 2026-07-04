import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeoResult } from '../models/geocode.model';
import { WeatherData } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherByCoords(geo: GeoResult): Observable<WeatherData> {
    const params = new HttpParams()
      .set('lat', geo.lat.toString())
      .set('lon', geo.lon.toString())
      .set('appid', environment.openWeatherApiKey);

    return this.http.get<WeatherData>(environment.openWeatherBaseUrl, { params });
  }
}