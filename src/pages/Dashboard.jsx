import { AlertBanner } from "../components/AlertBanner";
import { ForecastItem } from "../components/ForecastItem";
import { MetricTile } from "../components/MetricTile";
import { generateAlerts, alertRules } from "./Alerts";
import { convertTemp, convertSpeed } from '../utils/units';
import { useEffect, useState } from "react";

const getWeatherBackground = (weatherId, dt, sunrise, sunset) => {
  const isNight = dt < sunrise || dt > sunset;

  if (!weatherId) return '/assets/backgrounds/sky-sunny.gif';
  if (weatherId >= 200 && weatherId <= 232) return '/assets/backgrounds/sky-storm.gif';
  if (weatherId >= 300 && weatherId <= 531) return '/assets/backgrounds/sky-rain.gif';
  if (weatherId >= 600 && weatherId <= 622) return '/assets/backgrounds/sky-snow.gif';
  if (weatherId >= 701 && weatherId <= 781) return '/assets/backgrounds/sky-fog.gif';
  if (weatherId === 800) return isNight ? '/assets/backgrounds/sky-night.gif' : '/assets/backgrounds/sky-sunny.gif';
  if (weatherId >= 801 && weatherId <= 804) return '/assets/backgrounds/sky-cloudy.gif';

  return '/assets/backgrounds/sky-sunny.gif';
};

export const Dashboard = ({ current, forecast, loading, error, tempUnit = 'C', speedUnit = 'kmh' }) => {
  /**
   * Dashboard.jsx
   */
  const [weather, setWeather] = useState({ // default values to show something before real data loads
    wind_speed: 10,
    rain_chance: 100,
    temperature: 20,
  });

  const [recommend, setRecommend] = useState([]);

  useEffect(() => {
    if (current) { 
      setWeather({ // convert weather data 
        wind_speed: Math.round(current.wind?.speed * 3.6),
        rain_chance: Math.round((forecast?.[0]?.pop || 0) * 100),
        temperature: Math.round(current.main?.temp)
      });
    }
  }, [current, forecast]); // Update weather state when either current or forecast changes 

  useEffect(() => {
    generateRecommendation(); // Generate recommendations whenever weather data changes
  }, [weather]);

  if (loading) return <div className="p-4 text-slate-600">Loading weather data...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!current) return <div className="p-4 text-slate-600">No weather data available.</div>;

  function generateRecommendation() { // Comparisons
    const recs = [];
    const tempThreshold = tempUnit === 'F' ? 77 : 25; // Threshold for high temperature based on unit
    if (weather.wind_speed > 30) { 
      recs.push({ text: "Strong winds expected, avoid high altitude work", icon: "💨" });
    }
    if (weather.rain_chance == 100) {
      recs.push({ text: "Rain expected all day, consider rescheduling work or working indoors", icon: "☔" });
    } else if (weather.rain_chance > 60) {
      recs.push({ text: "High chance of rain, avoid slippery surfaces", icon: "🌧️" });
    }
    if (weather.temperature > tempThreshold) {
      recs.push({ text: "High temperatures, take breaks and stay hydrated", icon: "🌡️" });
    }
    if (weather.wind_speed > 30 && weather.rain_chance > 60 && weather.temperature > tempThreshold) {
      recs.push({ text: "Extreme weather conditions, consider pausing work", icon: "⚠️" });
    }
    if (weather.wind_speed <= 30 && weather.rain_chance <= 60 && weather.temperature <= tempThreshold) {
      recs.push({ text: "Weather conditions are favourable for work", icon: "✅" });
    }
    setRecommend(recs);
  }

  const cityLabel =
    current.name && current.sys?.country
      ? `${current.name}, ${current.sys.country}`
      : current.name || 'Unknown location';

  const rawTemp = current.main?.temp || 0;
  const rawFeels = current.main?.feels_like || rawTemp;
  const rawWindKmh = Math.round((current.wind?.speed || 0) * 3.6);
  const rainMm = current.rain?.['1h'] || current.rain?.['3h'] || 0;

  const temperature = convertTemp(rawTemp, tempUnit);
  const feelsLike = convertTemp(rawFeels, tempUnit);
  const windSpeed = convertSpeed(rawWindKmh, speedUnit);
  const tempLabel = tempUnit === 'F' ? '°F' : '°C';
  const speedLabel = speedUnit === 'mph' ? 'mph' : 'km/h';

  const condition = current.weather?.[0]?.description || 'Current conditions';

  const weatherData = {
    windSpeed: rawWindKmh,
    rainfall: rainMm,
    temperature: temperature,
  };
  const alerts = generateAlerts(weatherData, alertRules);

  const priority = { high: 3, medium: 2, low: 1 };
  const topAlert = alerts.sort((a, b) => priority[b.severity] - priority[a.severity])[0];

  // Background GIF based on weather condition ID
  const bgGif = getWeatherBackground(
    current.weather?.[0]?.id,
    current.dt,
    current.sys?.sunrise,
    current.sys?.sunset
  );

  return (
    <div>
      {/* Hero Section */}
      <div
        className="pt-12 pb-16 relative overflow-hidden lg:pt-[10%] lg:pb-[10%] rounded-b-3xl mb-8"
        style={{
          backgroundImage: `url(${bgGif})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay so text stays readable over any GIF */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

        <div className="relative z-10 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-2">{cityLabel} 📍</p>
          <div className="flex justify-center items-start">
            <h1 className="text-9xl lg:text-[12rem] font-black tracking-tighter">{temperature}</h1>
            <span className="text-4xl font-bold mt-4">{tempLabel}</span>
          </div>
          <p className="text-2xl font-medium opacity-90 capitalize">{condition}</p>
        </div>

        <div className="absolute -bottom-8 -left-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-12 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {topAlert ? (
        <AlertBanner
          title={topAlert.title}
          message={topAlert.details}
          type={topAlert.severity === "high" ? "danger" : "warning"}
        />
      ) : (
        <AlertBanner
          title="No warnings right now"
          message="Weather conditions are safe for normal operations."
          type="warning"
        />
      )}

      <div className="p-4 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <MetricTile label="Rain" value={rainMm.toFixed(1)} unit="mm" icon={<span className="text-2xl">🌧️</span>} />
          <MetricTile label="Wind" value={windSpeed} unit={speedLabel} icon={<span className="text-2xl">💨</span>} />
          <MetricTile label="Feels" value={feelsLike} unit={tempLabel} icon={<span className="text-2xl">🌡️</span>} />
        </div>

        {/* Recommendation */}
        {recommend.length > 0 && (
          <div className="bg-red-50 rounded-2xl border-l-4 border-red-500 p-5 mb-6">
            <h3 className="font-bold text-red-800 mb-2">Safety Recommendations</h3>
            <ul className="list-disc list-inside text-red-600 text-sm">
              {recommend.map((rec, index) => ( // Display each recommendation with its icon
                <li key={index}>{rec.icon} {rec.text}</li> // Display icon alongside text
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-3">
            {(forecast || []).map((f, i) => (
              <ForecastItem key={i} day={f.day} temp={convertTemp(f.temp, tempUnit)} icon={f.icon} active={i === 0} tempLabel={tempLabel} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};