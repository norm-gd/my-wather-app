import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeoResult } from '../models/geocode.model';

@Injectable({
  providedIn: 'root',
})
export class GeocodeService {
  constructor(private http: HttpClient) {}

  geocode(city: string): Observable<GeoResult[]> {
    const params = new HttpParams()
      .set('q', city)
      .set('limit', '5')
      .set('appid', environment.openWeatherApiKey);

    return this.http.get<GeoResult[]>(environment.openWeatherGeoUrl, { params });
  }
}