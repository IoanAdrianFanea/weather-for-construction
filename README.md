# Weather for Construction

A weather dashboard designed for outdoor construction workers. It highlights current conditions, alerts, and safety guidance with a simple, fast UI.

## Features

- Current weather, forecast, and safety alerts
- Automatic geolocation with fallback to a default city
- Search and compare locations
- Unit preferences for temperature and wind speed

## Tech Stack

- React + Vite
- Tailwind CSS
- OpenWeather API

## Setup

1. Install dependencies:
	```bash
	npm install
	```
2. Add your API key (create a `.env` file in the project root):
	```
	VITE_OPENWEATHER_API_KEY=YOUR_KEY_HERE
	```
3. Start the dev server:
	```bash
	npm run dev
	```

## Notes

- Allow location access to use GPS-based weather. If blocked, the app uses the default city.
- This project is university coursework.
