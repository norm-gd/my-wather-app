# Angular Weather Leaflet

A simple web application to search for US cities and see their current weather along with location on an interactive map.

## What It Does

- Search any US city by name
- Display current weather: temperature (Fahrenheit), humidity, and "feels like" temperature
- Show city location on an interactive OpenStreetMap
- Error handling for incorrect city names

## Technology Stack

### Core Framework
- **Angular 15** - Modern TypeScript-based frontend framework for building single-page applications

### Libraries & Functionality

#### HTTP & Data Management
- **Angular HttpClientModule** - Handles all API requests to fetch weather data
- **RxJS 7.6.0** - Reactive programming library for managing asynchronous data streams and observables. Currently used for HTTP subscriptions; can be extended for better error handling, retry logic, and input debouncing

#### Mapping & Geolocation
- **Leaflet 1.9.3** - Lightweight, open-source mapping library that renders interactive maps
- **ngx-leaflet 15.0.1** - Angular wrapper for Leaflet, providing Angular-friendly directives and components for map integration
- **OpenStreetMap** - Free, open-source map tiles used as the base layer

#### Styling
- **SCSS** - CSS preprocessor for writing maintainable, nested stylesheets

### External APIs
- **OpenWeatherMap API** - Provides real-time weather data (temperature, humidity, feels-like) for any city

## Setup & Installation

### Prerequisites
- Node.js and npm installed

### Development Setup

```bash
npm install # Install all dependencies
npm start # Start the development server
```

The app will run on `http://localhost:4200`

## API Key Setup

The app currently has a demo API key included. Before deploying:

1. Create a free account at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your own API key
3. Update the `key` variable in `src/app/app.component.ts`

Never commit API keys to version control. Consider using environment variables for better security.

## Project Structure

```
src/
├── app/
│   ├── app.component.ts      # Main component with weather logic
│   ├── app.component.html    # Search form and weather display
│   ├── app.component.scss    # Component styles
│   └── app.module.ts         # Module configuration
├── styles.scss               # Global styles
└── index.html                # Root HTML
```

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linter

## License

MIT License - See LICENSE file
