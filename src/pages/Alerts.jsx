import React from 'react';
import { useEffect, useState } from 'react';

const AlertCard = ({ title, time, severity, details }) => { // Define styles for different severity levels
  const severityStyles = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-400 text-black',
  };

  return (
    <div className={`alert-box rounded-2xl overflow-hidden shadow-sm border ${severity === 'high' ? 'border-red-200 dark:border-red-900' : 'border-yellow-200 dark:border-yellow-900'}`}>
      <div className={`${severityStyles[severity]} px-4 py-2 flex justify-between items-center`}>
        <h3 className="font-bold text-sm">{title}</h3>
        <span className="text-xs opacity-75">{time}</span>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800">
        <p className="text-sm text-slate-700 dark:text-slate-300">{details}</p>
      </div>
    </div>
  );
};

export const alertRules = { // Define alert rules for different weather parameters
  windSpeed: [
    {
      min: 35,
      severity: "high",
      title: "Strong Wind Warning",
      details: (v) => `Gusts exceeding ${v} km/h expected. Secure loose materials and avoid outdoor tasks.`,
    },
    {
      min: 25,
      severity: "medium",
      title: "Moderate Wind Warning",
      details: (v) => `Gusts up to ${v} km/h expected.`, 
    },
  ],
  rainfall: [
    {
      min: 10,
      severity: "high",
      title: "Heavy Rain Warning",
      details: (v) => `Heavy rainfall (${v} mm). Slippery conditions expected, avoid outdoor tasks.`,
    },
    {
      min: 5,
      severity: "medium",
      title: "Moderate Rain Warning",
      details: (v) => `Rainfall of ${v} mm expected.`,
    },
  ],
  temperature: [
    {
      min: 30,
      severity: "high",
      title: "High Temperature Warning",
      details: (v) => `Extreme heat at ${v}°C. Stay hydrated and avoid outdoor tasks.`,
    },
    {
      min: 20,
      severity: "medium",
      title: "Warm Temperature Warning",
      details: (v) => `Temperature reaching ${v}°C.`,
    },
    {
      max: 0,
      severity: "high",
      title: "Freezing Temperature Warning",
      details: (v) => `Freezing conditions at ${v}°C. Risk of ice and unsafe surfaces.`,
    },
    {
      max: 5,
      severity: "medium",
      title: "Cold Weather Warning",
      details: (v) => `Cold temperature at ${v}°C. Wear appropriate protective clothing.`,
    },
  ],
  heatIndex: [
    {
      min: 35,
      severity: "high",
      title: "Extreme Heat Warning",
      details: (v) => `Heat index of ${v}°C. High heat risk, limit outdoor exposure.`,
    },
    {
      min: 25,
      severity: "medium",
      title: "Moderate Heat Warning",
      details: (v) => `Heat index reaching ${v}°C. Stay hydrated and take breaks.`,
    },
  ],
  uvIndex: [
    {
      min: 6,
      severity: "high",
      title: "Heavy UV Warning",
      details: (v) => `High UV index (${v}). Avoid outdoor tasks during peak sun hours. Use sun protection.`,
    },
    {
      min: 3,
      severity: "medium",
      title: "Moderate UV Warning",
      details: (v) => `Moderate UV index (${v}). Use sun protection when outdoors.`,
    },
  ],
};

const heatIndex = (tempC, humidity) => {
  if (tempC < 27) return null;
    const T = tempC * 9/5 + 32, R = humidity;
    const HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R
      - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R
      + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
    return Math.round((HI - 32) * 5/9);
};

export const generateAlerts = (weather) => {
  const alerts = []; // Generate alerts based on the defined rules and current weather data
  Object.entries(alertRules).forEach(([key, rules]) => { // Loop through each weather parameter and its rules
    const value = weather[key];
    if (value === undefined || value === null) return;
      const matchedRule = rules.find(rule => {
        const minCheck = rule.min === undefined || value >= rule.min; // Comparisons
        const maxCheck = rule.max === undefined || value <= rule.max;
      return minCheck && maxCheck;
      });
    if (matchedRule) {
      alerts.push({
        title: matchedRule.title,
        severity: matchedRule.severity,
        time: "Now",
        details: matchedRule.details(value),
      });
    }
  });
  return alerts;
};

export const Alerts = ({ current, loading, error, uvIndex }) => {
  const [uvFallback, setUvFallback] = useState(null);

  // fallback fetch (if uv not passed)
  useEffect(() => {
    if (!current?.coord) return;

    if (typeof uvIndex === "number") return;

    const { lat, lon } = current.coord;
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched UV:", data.current?.uvi);
        setUvFallback(data.current?.uvi ?? null);
      })
      .catch(() => {});
  }, [current, uvIndex]);

  if (loading) return <div className="p-4 text-slate-600">Loading alerts...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!current) return <div className="p-4 text-slate-600">No data available.</div>;

  console.log("UV PROP:", uvIndex);
  console.log("UV FALLBACK:", uvFallback);

  const tempC = current.main?.temp || 0;
  const humidity = current.main?.humidity || 0;

  const weatherData = {
    windSpeed: Math.round((current.wind?.speed || 0) * 3.6), // Convert values
    rainfall: current.rain?.['1h'] || current.rain?.['3h'] || 0,
    temperature: Math.round(current.main?.temp || 0),
    uvIndex: uvIndex ?? uvFallback,
    heatIndex: heatIndex(tempC, humidity),
  };

  const alerts = generateAlerts(weatherData);

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Active Alerts</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">Active weather-related alerts for construction sites</p>

      {alerts.length === 0 ? (
        <p className="text-sm text-gray-500">No active alerts</p>
      ) : (
        alerts.map((alert, index) => (
          <AlertCard key={index} {...alert} />
        ))
      )}
    </div>
  );
};