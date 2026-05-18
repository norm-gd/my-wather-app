import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { icon, latLng, Map, MapOptions, Marker, tileLayer } from 'leaflet';
declare let L;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  country: string;
  fahrenheit: number = null;
  feelsLike: number = null;
  humidity: number = null;
  baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather?q=';

  // PLEASE CREATE YOUR OWN KEY. THIS IS ONLY FOR DEMO PURPOSES.
  key: string = '&appid=5fa988728912c96f18d5abbb35a0a12f';

  // Map
  mapOptions: MapOptions;
  map: Map;
  userInteraction: boolean = false;
  longitude: any = null;
  latitude: any = null;
  weatherData: any;
  error: boolean = false;

  @ViewChild('cityName', { static: false }) cityName: ElementRef;
  @ViewChild('temperature', { static: false }) temperature: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeMapOptions();
  }

  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(38, -97),
      zoom: 6,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 30,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
  }

  onMapReady(map: Map) {
    this.map = map;
    this.setMarker(this.weatherData);
    map.panTo(new L.LatLng(this.latitude, this.longitude));
  }

  // SINGLE DAY
  getSingleDay() {
    this.http
      .get<any>(this.baseUrl + this.cityName.nativeElement.value + this.key)
      .subscribe({
        next: (weatherData) => {
          this.error = false;
          this.country = weatherData.sys.country;

          this.fahrenheit = this.toFahrenheit(weatherData.main.temp);
          this.humidity = weatherData.main.humidity;
          this.feelsLike = this.toFahrenheit(weatherData.main.feels_like);

          this.weatherData = weatherData;
          this.setMarker(this.weatherData);

          if (this.map !== undefined) {
            this.map.panTo(new L.LatLng(this.latitude, this.longitude));
          }
        },
        error: () => {
          this.error = true;
          this.clearData();
        },
      });
  }

  private toFahrenheit(kelvin: number): number {
    return Math.ceil(((kelvin - 273.15) * 9) / 5 + 32);
  }

  setMarker(data: any) {
    this.userInteraction = true;
    this.longitude = data.coord.lon;
    this.latitude = data.coord.lat;
    const marker = new Marker([this.longitude, this.latitude]).setIcon(
      icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/leaflet/marker-icon-2x.png',
      })
    );
    marker.bindTooltip(this.weatherData.name).openTooltip();
  }

  onKeyDownEvent(evt: any) {
    console.log(evt)
    if (evt.code === 'Enter') {
      this.getSingleDay();
      this.clearData();
    }
  }

  clearData() {
    this.fahrenheit = null;
    this.feelsLike = null;
    this.humidity = null;
    this.cityName.nativeElement.value = '';
  }
}
