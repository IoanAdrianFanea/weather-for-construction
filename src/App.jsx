import { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import Locations from './pages/Locations';
import Settings from './pages/Settings';
import Forecast from './pages/Forecast';
import { Header } from './components/Header';
import Layout from './components/Layout';
import { buildFiveDayForecast, getWeatherByCity, getWeatherByCoords } from './services/openWeather';
import { ThemeProvider } from './context/ThemeContext';
import { usePreferences } from './hooks/usePreference';
import { useGeolocation } from './hooks/useGeolocation';
import Safety from './pages/Safety';

function App() {
  const [activeTab, setActiveTab] = useState('weather');
  const { defaultCity, setDefaultCity, tempUnit, setTempUnit, speedUnit, setSpeedUnit } = usePreferences();
  const { coords, error: geoError } = useGeolocation();
  const [weatherState, setWeatherState] = useState({
    loading: true,
    error: '',
    current: null,
    forecast: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadWeather = async () => {
      setWeatherState((previous) => ({ ...previous, loading: true, error: '' }));

      try {
        const shouldUseCoords = coords?.lat && coords?.lon;
        const data = shouldUseCoords
          ? await getWeatherByCoords(coords.lat, coords.lon)
          : await getWeatherByCity(defaultCity);

        if (ignore) return;

        setWeatherState({
          loading: false,
          error: '',
          current: data.current,
          forecast: buildFiveDayForecast(data.forecast?.list),
        });
      } catch (error) {
        if (ignore) return;

        setWeatherState({
          loading: false,
          error: error.message || 'Unable to load weather data.',
          current: null,
          forecast: [],
        });
      }
    };

    loadWeather();

    return () => {
      ignore = true;
    };
  }, [defaultCity, coords?.lat, coords?.lon]);

  const headerLocation =
    weatherState.current?.name && weatherState.current?.sys?.country
      ? `${weatherState.current.name}, ${weatherState.current.sys.country}`
      : defaultCity;

  const projectStatus = (() => {
    const windKmh = Math.round((weatherState.current?.wind?.speed || 0) * 3.6);
    const rainfallMm =
      weatherState.current?.rain?.['1h'] ||
      weatherState.current?.rain?.['3h'] ||
      0;

    if (windKmh >= 25 || rainfallMm >= 10) return 'Weather Risk';
    if (windKmh >= 15 || rainfallMm >= 5) return 'Monitor Conditions';

    return 'On Schedule';
  })();

  const renderPage = () => {
    switch (activeTab) {
      case 'weather':
        return (
          <Dashboard
            current={weatherState.current}
            forecast={weatherState.forecast}
            loading={weatherState.loading}
            error={weatherState.error}
            tempUnit={tempUnit}
            speedUnit={speedUnit}
          />
        );
      case 'locations':
        return (
          <Locations
            defaultCity={defaultCity}
            onSetDefaultCity={setDefaultCity}
            current={weatherState.current}
            loading={weatherState.loading}
            error={weatherState.error}
            tempUnit={tempUnit}
            speedUnit={speedUnit}
          />
        );
      case 'alerts':
        return (
          <Alerts
            current={weatherState.current}
            loading={weatherState.loading}
            error={weatherState.error}
          />
        );
      case 'settings':
        return <Settings
          defaultCity={defaultCity}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          speedUnit={speedUnit}
          setSpeedUnit={setSpeedUnit}
        />;      
      case 'forecast':
        return (
          <Forecast
            forecast={weatherState.forecast}
            loading={weatherState.loading}
            error={weatherState.error}
            tempUnit={tempUnit}
            speedUnit={speedUnit}
          />
        );
      case 'safety':
        return <Safety />;
      default:
        return (
          <Dashboard
            current={weatherState.current}
            forecast={weatherState.forecast}
            loading={weatherState.loading}
            error={weatherState.error}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <Header
          location={headerLocation}
          projectStatus={projectStatus}
          setActiveTab={setActiveTab}
          current={weatherState.current}
          geoError={geoError}
        />
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;