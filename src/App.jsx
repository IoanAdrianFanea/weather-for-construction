import { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import Locations from './pages/Locations';
import Settings from './pages/Settings';
import Forecast from './pages/Forecast';
import { Header } from './components/Header';
import Layout from './components/Layout';
import { buildFiveDayForecast, getWeatherByCity } from './services/openWeather';
import { BottomNavigation } from './components/Navigation';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('weather');
  const [city, setCity] = useState('London');
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
        const data = await getWeatherByCity(city);

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
  }, [city]);

  const headerLocation =
    weatherState.current?.name && weatherState.current?.sys?.country
      ? `${weatherState.current.name}, ${weatherState.current.sys.country}`
      : city;

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
          />
        );
      case 'locations':
        return (
          <Locations
            city={city}
            onSearchCity={setCity}
            current={weatherState.current}
            loading={weatherState.loading}
            error={weatherState.error}
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
        return <Settings />;
      case 'forecast':
        return (
          <Forecast
            forecast={weatherState.forecast}
            loading={weatherState.loading}
            error={weatherState.error}
          />
        );
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
        <Header location={headerLocation} projectStatus={projectStatus} />
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;