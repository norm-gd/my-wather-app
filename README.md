# Angular Weather Leaflet

A simple web application to search for US cities and see their current weather along with location on an interactive map.

## What It Does

- Search any US city by name
- Display current weather: temperature (Fahrenheit), humidity, and "feels like" temperature
- Show city location on an interactive OpenStreetMap
- Error handling for incorrect city names
---
## Technology Stack


### Framework- **Angular 15**

### Libraries 

#### HTTP & Data Management
- **Angular HttpClientModule** 
- **RxJS 7.6.0** 

#### Mapping & Geolocation
- **Leaflet 1.9.3** 
- **ngx-leaflet 15.0.1** 
- **OpenStreetMap** 

### External API- **OpenWeatherMap API** 

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

## NPM Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linter

## License

MIT License - See LICENSE file
