import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { icon, latLng, Map, MapOptions, Marker, tileLayer } from 'leaflet';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { WeatherData } from './models/weather.model';
import { GeoResult } from './models/geocode.model';
import { GeocodeService } from './services/geocode.service';
import { WeatherService } from './services/weather.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  fahrenheit: number | null = null;
  feelsLike: number | null = null;
  humidity: number | null = null;
  cityNameValue: string = '';
  displayCityName: string = '';
  error: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;
  inputError: string = '';
  geoResults: GeoResult[] = [];

  mapOptions: MapOptions;
  map: Map | null = null;
  currentMarker: Marker | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  pendingWeatherData: WeatherData | null = null;
  private lastError: HttpErrorResponse | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  @ViewChild('cityName', { static: false }) cityName!: ElementRef;

  constructor(
    private geocodeService: GeocodeService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.initializeMapOptions();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchSubject$
      .pipe(
        switchMap((city) =>
          this.geocode(city).pipe(
            catchError((err) => {
              this.lastError = err;
              return of(null as GeoResult[] | null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          if (results === null) {
            this.handleError(this.lastError);
          } else if (results.length === 0) {
            this.handleNoMatch();
          } else if (results.length === 1) {
            this.fetchWeatherByCoords(results[0]);
          } else {
            this.geoResults = results;
            this.loading = false;
          }
        },
      });
  }

  private initializeMapOptions(): void {
    this.mapOptions = {
      center: latLng(38, -97),
      zoom: 6,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
  }

  onKeyDownEvent(evt: KeyboardEvent): void {
    if (evt.code === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    const inputValue = this.cityName.nativeElement.value.trim();
    this.cityNameValue = inputValue;

    if (!inputValue) {
      this.inputError = 'Please enter a city name';
      return;
    }

    if (inputValue.length > 100) {
      this.inputError = 'City name too long (max 100 characters)';
      return;
    }

    this.inputError = '';
    this.loading = true;
    this.error = false;
    this.geoResults = [];
    this.searchSubject$.next(inputValue);
  }

  selectGeo(result: GeoResult): void {
    this.geoResults = [];
    this.fetchWeatherByCoords(result);
  }

  private geocode(city: string) {
    return this.geocodeService.geocode(city);
  }

  private fetchWeatherByCoords(geo: GeoResult): void {
    this.loading = true;
    this.weatherService
      .getWeatherByCoords(geo)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.lastError = err;
          return of(null as WeatherData | null);
        })
      )
      .subscribe((data) => {
        if (data === null) {
          this.handleError(this.lastError);
        } else {
          this.handleWeatherSuccess(data);
        }
      });
  }

  private handleWeatherSuccess(weatherData: WeatherData): void {
    this.loading = false;
    this.error = false;

    if (!weatherData?.main || !weatherData.coord || !weatherData.name) {
      this.handleError();
      return;
    }

    this.fahrenheit = this.toFahrenheit(weatherData.main.temp);
    this.humidity = weatherData.main.humidity;
    this.feelsLike = this.toFahrenheit(weatherData.main.feels_like);
    this.displayCityName = weatherData.name;
    this.latitude = weatherData.coord.lat;
    this.longitude = weatherData.coord.lon;

    if (this.map) {
      this.setMarker(weatherData);
    } else {
      this.pendingWeatherData = weatherData;
    }
  }

  onMapReady(map: Map): void {
    this.map = map;

    if (this.pendingWeatherData) {
      this.setMarker(this.pendingWeatherData);
      this.pendingWeatherData = null;
    }
  }

  private setMarker(data: WeatherData): void {
    if (!this.map) {
      return;
    }

    const lat = data.coord.lat;
    const lon = data.coord.lon;

    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    this.currentMarker = new Marker([lat, lon]).setIcon(
      icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/leaflet/marker-icon-2x.png',
      })
    );

    this.currentMarker.bindTooltip(data.name).openTooltip();
    this.currentMarker.addTo(this.map);

    this.map.panTo(latLng(lat, lon));
  }

  private toFahrenheit(kelvin: number): number {
    return Math.ceil(((kelvin - 273.15) * 9) / 5 + 32);
  }

  private handleError(err?: HttpErrorResponse): void {
    this.loading = false;
    let msg = 'Something went wrong. Please try again.';

    if (err) {
      if (err.status === 404) {
        msg = 'City not found. Please check the spelling.';
      } else if (err.status === 401) {
        msg = 'Invalid API key.';
      } else if (err.status === 429) {
        msg = 'Too many requests. Please wait and try again.';
      } else if (err.status === 0) {
        msg = 'Network error. Check your connection.';
      }
    }

    this.errorMessage = msg;
    this.error = true;
    this.clearData();
  }

  private handleNoMatch(): void {
    this.loading = false;
    this.errorMessage = 'No matching city found. Try being more specific (e.g., "London,GB").';
    this.error = true;
    this.clearData();
  }

  clearData(): void {
    this.fahrenheit = null;
    this.feelsLike = null;
    this.humidity = null;
    this.displayCityName = '';
    this.latitude = null;
    this.longitude = null;
    this.geoResults = [];

    if (this.cityName) {
      this.cityName.nativeElement.value = '';
    }

    if (this.currentMarker && this.map) {
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }

    this.inputError = '';
  }
}