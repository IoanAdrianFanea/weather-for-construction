import { useEffect, useRef, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import Locations from './pages/Locations';
import Settings from './pages/Settings';
import Forecast from './pages/Forecast';
import { Header } from './components/Header';
import Layout from './components/Layout';
import { buildFiveDayForecast, getWeatherByCity } from './services/openWeather';
import { ThemeProvider } from './context/ThemeContext';
import { usePreferences } from './hooks/usePreference';
import { useGeolocation } from './hooks/useGeolocation';
import Safety from './pages/Safety';
import WeatherReport from './pages/WeatherReport';

function App() {
  const [activeTab, setActiveTab] = useState('weather');
  const { defaultCity, setDefaultCity, tempUnit, setTempUnit, speedUnit, setSpeedUnit, alertsEnabled, setAlertsEnabled } = usePreferences();
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
        const data = await getWeatherByCity(defaultCity);

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
  }, [defaultCity]);

  // ── Safety alert notifications + persistent banner ──────────────────────
  const [persistentAlert, setPersistentAlert] = useState(null);
  const lastNotifiedAlert = useRef(null);

  useEffect(() => {
    if (!weatherState.current || weatherState.loading) return;

    const windKmh = Math.round((weatherState.current?.wind?.speed || 0) * 3.6);
    const rainfall = weatherState.current?.rain?.['1h'] || weatherState.current?.rain?.['3h'] || 0;
    const temp = Math.round(weatherState.current?.main?.temp || 0);

    // Determine the top active alert
    let topAlert = null;
    if (windKmh >= 35 || rainfall >= 10 || temp >= 30 || temp <= 0) {
      topAlert = { severity: 'high', title: windKmh >= 35 ? 'Strong Wind Warning' : rainfall >= 10 ? 'Heavy Rain Warning' : temp >= 30 ? 'High Temperature Warning' : 'Freezing Temperature Warning', body: `Wind: ${windKmh} km/h · Rain: ${rainfall}mm · Temp: ${temp}°C` };
    } else if (windKmh >= 25 || rainfall >= 5 || temp >= 20 || temp <= 5) {
      topAlert = { severity: 'medium', title: 'Weather Advisory', body: `Monitor conditions — Wind: ${windKmh} km/h · Temp: ${temp}°C` };
    }

    // Update persistent banner
    setPersistentAlert(topAlert);

    // Fire browser notification if enabled and alert changed
    if (alertsEnabled && topAlert && Notification.permission === 'granted') {
      const alertKey = topAlert.title + topAlert.body;
      if (lastNotifiedAlert.current !== alertKey) {
        lastNotifiedAlert.current = alertKey;
        new Notification(`⚠️ ${topAlert.title}`, {
          body: topAlert.body,
          icon: '/logostandard.png',
        });
      }
    } else if (!topAlert) {
      lastNotifiedAlert.current = null;
    }
  }, [weatherState.current, alertsEnabled]);

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
            setActiveTab={setActiveTab}
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
            coords={coords}
            geoError={geoError}
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
          alertsEnabled={alertsEnabled}
          setAlertsEnabled={setAlertsEnabled}
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
      case 'detailed':
        return (
          <WeatherReport
            current={weatherState.current}
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
        {/* Persistent alert banner — shown on all pages when alerts enabled and warning active */}
        {alertsEnabled && persistentAlert && (
          <div className={`flex items-center gap-3 px-4 py-2.5 text-sm font-bold ${persistentAlert.severity === 'high' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
            <span>⚠️</span>
            <span>{persistentAlert.title}</span>
            <span className="font-normal opacity-80 text-xs ml-1 hidden sm:inline">{persistentAlert.body}</span>
          </div>
        )}
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;