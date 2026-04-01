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
  const [overrideCurrent, setOverrideCurrent] = useState(null);
  const [recommend, setRecommend] = useState([]);

  // Use overridden current object if set, otherwise live API data
  const activeCurrent = overrideCurrent ?? current;

  // Derived simplified values for recommendation logic
  const activeWeather = {
    wind_speed: Math.round((activeCurrent?.wind?.speed || 0) * 3.6),
    rain_chance: overrideCurrent
      ? ((activeCurrent?.rain?.['1h'] || 0) > 0 ? 100 : 0)
      : Math.round((forecast?.[0]?.pop || 0) * 100),
    temperature: Math.round(activeCurrent?.main?.temp || 0),
  };

  useEffect(() => {
    generateRecommendation();
  }, [JSON.stringify(activeCurrent)]);

  if (loading) return <div className="p-4 text-slate-600">Loading weather data...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!current) return <div className="p-4 text-slate-600">No weather data available.</div>;

  function generateRecommendation() {
    const recs = [];
    if (activeWeather.wind_speed >= 35) {
      recs.push({ text: "Strong winds expected, avoid high altitude work and secure loose materials", icon: "💨" });
    } else if (activeWeather.wind_speed >= 25) {
      recs.push({ text: "Moderate winds on site, monitor conditions and take care outdoors", icon: "🌬️" });
    }
    if (activeWeather.rain_chance >= 100) {
      recs.push({ text: "Rain expected all day, consider rescheduling work or working indoors", icon: "☔" });
    } else if (activeWeather.rain_chance >= 60) {
      recs.push({ text: "High chance of rain, avoid slippery surfaces", icon: "🌧️" });
    }
    if (activeWeather.temperature >= 30) {
      recs.push({ text: "Extreme heat — stay hydrated and limit outdoor exposure", icon: "🌡️" });
    } else if (activeWeather.temperature >= 20) {
      recs.push({ text: "Warm conditions — ensure workers take regular breaks and stay hydrated", icon: "☀️" });
    }
    if (activeWeather.temperature <= 0) {
      recs.push({ text: "Freezing conditions — risk of ice on surfaces, wear appropriate PPE", icon: "🧊" });
    } else if (activeWeather.temperature <= 5) {
      recs.push({ text: "Cold conditions — wear appropriate protective clothing", icon: "🥶" });
    }
    if (activeWeather.wind_speed >= 35 && activeWeather.rain_chance >= 60 && activeWeather.temperature >= 25) {
      recs.push({ text: "Extreme weather conditions, consider pausing work entirely", icon: "⚠️" });
    }
    // Only show all-clear if nothing else triggered
    if (recs.length === 0) {
      recs.push({ text: "Weather conditions are favourable for work", icon: "✅" });
    }
    setRecommend(recs);
  }

  const cityLabel =
    activeCurrent.name && activeCurrent.sys?.country
      ? `${activeCurrent.name}, ${activeCurrent.sys.country}`
      : activeCurrent.name || 'Unknown location';

  const rawTemp = activeCurrent.main?.temp || 0;
  const rawFeels = activeCurrent.main?.feels_like || rawTemp;
  const rawWindKmh = Math.round((activeCurrent.wind?.speed || 0) * 3.6);
  const rainMm = activeCurrent.rain?.['1h'] || activeCurrent.rain?.['3h'] || 0;

  const temperature = convertTemp(rawTemp, tempUnit);
  const feelsLike = convertTemp(rawFeels, tempUnit);
  const windSpeed = convertSpeed(rawWindKmh, speedUnit);
  const tempLabel = tempUnit === 'F' ? '°F' : '°C';
  const speedLabel = speedUnit === 'mph' ? 'mph' : 'km/h';

  const condition = activeCurrent.weather?.[0]?.description || 'Current conditions';

  const weatherData = {
    windSpeed: rawWindKmh,
    rainfall: rainMm,
    temperature: Math.round(rawTemp), // always °C — alert rules are defined in Celsius
  };
  const alerts = generateAlerts(weatherData, alertRules);

  const priority = { high: 3, medium: 2, low: 1 };
  const topAlert = alerts.sort((a, b) => priority[b.severity] - priority[a.severity])[0];

  // Background GIF based on weather condition ID
  const bgGif = getWeatherBackground(
    activeCurrent.weather?.[0]?.id,
    activeCurrent.dt,
    activeCurrent.sys?.sunrise,
    activeCurrent.sys?.sunset
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
          type="none"
        />
      )}

      <div className="p-4 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <MetricTile label="Rain" value={rainMm.toFixed(1)} unit="mm" icon={<span className="text-2xl">🌧️</span>} />
          <MetricTile label="Wind" value={windSpeed} unit={speedLabel} icon={<span className="text-2xl">💨</span>} />
          <MetricTile label="Feels" value={feelsLike} unit={tempLabel} icon={<span className="text-2xl">🌡️</span>} />
        </div>

        {/* Dynamic Recommendation */}
        {recommend.length > 0 && (() => {
          const isClear = recommend.length === 1 && recommend[0].text.includes('favourable');
          const isExtreme = recommend.some(r => r.text.includes('Extreme'));
          const severity = isClear ? 'clear' : isExtreme || recommend.length >= 3 ? 'high' : 'medium';

          const overlayColor = severity === 'clear'
            ? 'rgba(0,0,0,0.55)'
            : severity === 'high'
              ? 'rgba(180,20,20,0.72)'
              : 'rgba(200,100,0,0.68)';

          const borderColor = severity === 'clear' ? '#6b7280' : severity === 'high' ? '#ef4444' : '#f97316';
          const titleColor = severity === 'clear' ? '#fff' : severity === 'high' ? '#fff' : '#fff';

          return (
            <div
              className="rounded-2xl overflow-hidden mb-6 shadow-md"
              style={{
                backgroundImage: `url(/construction_pattern.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: `2px solid ${borderColor}`,
              }}
            >
              <div
                className="p-5"
                style={{ backgroundColor: overlayColor, backdropFilter: 'blur(1px)' }}
              >
                <h3
                  className="font-black text-sm uppercase tracking-widest mb-3"
                  style={{ color: titleColor }}
                >
                  {severity === 'clear' ? '✅' : severity === 'high' ? '🚨' : '⚠️'} Safety Recommendations
                </h3>
                <ul className="space-y-1.5">
                  {recommend.map((rec, index) => (
                    <li key={index} className="text-sm font-semibold text-white flex items-start gap-2">
                      <span>{rec.icon}</span>
                      <span>{rec.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}

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