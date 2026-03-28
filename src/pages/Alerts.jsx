import React from 'react';

const AlertCard = ({ title, time, severity, details }) => {
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

export const alertRules = {
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
};

export const generateAlerts = (weather) => {
  const alerts = [];
  Object.entries(alertRules).forEach(([key, rules]) => {
    const value = weather[key];
    if (value === undefined) return;
      const matchedRule = rules.find(rule => {
        const minCheck = rule.min === undefined || value >= rule.min;
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

export const Alerts = ({ current, loading, error }) => {
  if (loading) {
    return <div className="p-4 text-slate-600">Loading alerts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!current) {
    return <div className="p-4 text-slate-600">No weather data available for alerts.</div>;
  }

  const weatherData = {
    windSpeed: Math.round((current.wind?.speed || 0) * 3.6),
    rainfall: current.rain?.['1h'] || current.rain?.['3h'] || 0,
    temperature: Math.round(current.main?.temp || 0),
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