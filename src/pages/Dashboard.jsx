import { AlertBanner } from "../components/AlertBanner";
import { ForecastItem } from "../components/ForecastItem";
import { MetricTile } from "../components/MetricTile";
import { useEffect, useState } from "react";

/**
 * Dashboard.jsx
 */
export const Dashboard = ({ current, forecast, loading, error }) => {
  const [weather, setWeather] = useState({ // weather data 
    wind_speed: 10,
    rain_chance: 100,
    temperature: 20,
  });

  const [recommend, setRecommend] = useState([]); // safety recommendations based on weather
  useEffect(() => {
    if (current) {
      setWeather({
        wind_speed: Math.round(current.wind?.speed * 3.6),
        rain_chance: Math.round((forecast?.[0]?.pop || 0) * 100),
        temperature: Math.round(current.main?.temp)
      })
    }
  }, [current, forecast]);

  function generateRecommendation() {
    const recs = []; // generate recommendations based on weather conditions
    if (weather.wind_speed > 30) { // comparison
      recs.push({text: "Strong winds expected, avoid high altitude work",
      icon: "💨"});
    }
    if (weather.rain_chance == 100) {
      recs.push({text: "Rain expected all day, consider rescheduling work or working indoors",
      icon: "☔"});
    }
    else if (weather.rain_chance > 60) {
      recs.push({text: "High chance of rain, avoid slippery surfaces",
      icon: "🌧️"});
    }
    if (weather.temperature > 25) {
      recs.push({text: "High temperatures, take breaks and stay hydrated",
      icon: "🌡️"});
    }
    if (weather.wind_speed > 30 && weather.rain_chance > 60 && weather.temperature > 25) {
      recs.push({text: "Extreme weather conditions, consider pausing work",
      icon: "⚠️"});
    }
    if (weather.wind_speed <= 30 && weather.rain_chance <= 60 && weather.temperature <= 25){
      recs.push({text: "Weather conditions are favourable for work",
      icon: "✅"});
    }

    setRecommend(recs);  // update recs with new recommendations 
  }

  useEffect(() => {
    generateRecommendation(); 
  }, [weather]); // regenerate recommendations whenever weather data changes


  if (loading) {
    return <div className="p-4 text-slate-600">Loading weather data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!current) {
    return <div className="p-4 text-slate-600">No weather data available.</div>;
  }

  const cityLabel =
    current.name && current.sys?.country
      ? `${current.name}, ${current.sys.country}`
      : current.name || "Unknown location";

  const temperature = Math.round(current.main?.temp || 0);
  const condition = current.weather?.[0]?.description || "Current conditions";
  const rainMm = current.rain?.["1h"] || current.rain?.["3h"] || 0;
  const windKmh = Math.round((current.wind?.speed || 0) * 3.6);
  const feelsLike = Math.round(current.main?.feels_like || temperature);

  const recommendation =
    windKmh >= 25
      ? "Strong winds expected. Secure loose materials and avoid crane/high-altitude operations."
      : rainMm >= 10
        ? "Heavy rain conditions. Delay concrete pours and increase slip prevention controls."
        : "Conditions are stable. Continue scheduled outdoor tasks with standard site precautions.";

  const alertTitle =
    windKmh >= 25
      ? "Strong wind warning"
      : rainMm >= 10
        ? "Heavy rain advisory"
        : "Conditions are currently stable";

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-400 to-blue-300 pt-12 pb-16 relative overflow-hidden lg:pt-[10%] lg:pb-[10%] dark:from-gray-700 dark:to-gray-600 rounded-b-3xl mb-8">
        <div className="relative z-10 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-2">{cityLabel} 📍</p>
          <div className="flex justify-center items-start">
            <h1 className="text-9xl lg:text-[12rem] font-black tracking-tighter">{temperature}</h1>
            <span className="text-4xl font-bold mt-4">°C</span>
          </div>
          <p className="text-2xl font-medium opacity-90 capitalize">{condition}</p>
        </div>
        
        {/* Abstract Clouds */}
        <div className="absolute -bottom-8 -left-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-12 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <AlertBanner title={alertTitle} type={windKmh >= 25 || rainMm >= 10 ? "danger" : "warning"} />

      <div className="p-4 -mt-8 relative z-20">
        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <MetricTile label="Rain" value={rainMm.toFixed(1)} unit="mm" icon={<span className="text-2xl">🌧️</span>} />
          <MetricTile label="Wind" value={windKmh} unit="km/h" icon={<span className="text-2xl">💨</span>} />
          <MetricTile label="Feels" value={feelsLike} unit="°" icon={<span className="text-2xl">🌡️</span>} />
        </div>

       

        {/*Dynamic Recommendation*/}
        {recommend.length > 0 && (
          <div className="bg-red-50 rounded-2xl border-l-4 border-red-500 p-5 mb-6">
            <h3 className="font-bold text-red-800 mb-2">Safety Recommendations</h3>
            <ul className="list-disc list-inside text-red-600 text-sm">
              {recommend.map((rec, index) => ( // render each recommendation with its icon
                <li key={index}>{rec.icon} {rec.text}</li> // display recommendation text with corresponding icon
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-3">
            {(forecast || []).map((f, i) => (
              <ForecastItem key={i} day={f.day} temp={f.temp} icon={f.icon} active={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};