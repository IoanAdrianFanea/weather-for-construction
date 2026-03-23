import React from 'react';

const AlertCard = ({ title, time, severity, details }) => {
  const severityStyles = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-400 text-black',
  };

  return (
    <div className={`rounded-2xl overflow-hidden shadow-sm border ${severity === 'high' ? 'border-red-200' : 'border-yellow-200'}`}>
      <div className={`${severityStyles[severity]} px-4 py-2`}>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <div className="p-4 bg-white">
        <p className="text-xs text-slate-500 mb-2">{time}</p>
        <p className="text-sm text-slate-700">{details}</p>
      </div>
    </div>
  );
};

const alertRules = {
  windSpeed: [
    {
      min: 25,
      severity: "high",
      title: "Strong Wind Warning",
      details: (v) =>
        `Gusts exceeding ${v} mph expected. Secure loose materials and avoid outdoor tasks.`,
    },
    {
      min: 15,
      severity: "medium",
      title: "Wind Warning",
      details: (v) =>
        `Gusts up to ${v} mph expected.`,
    },
  ],

  rainfall: [
    {
      min: 10,
      severity: "high",
      title: "Heavy Rain Advisory",
      details: (v) =>
        `Heavy rainfall (${v} mm). Slippery conditions expected avoid outdoor tasks.`,
    },
    {
      min: 5,
      severity: "medium",
      title: "Moderate Rain Advisory",
      details: (v) =>
        `Rainfall of ${v} mm expected.`,
    },
  ],

  temperature: [
    {
      min: 30,
      severity: "high",
      title: "High Temperature Warning",
      details: (v) =>
        `Extreme heat at ${v}°C. Stay hydrated and avoid outdoor tasks.`,
    },
    {
      min: 25,
      severity: "medium",
      title: "Warm Temperature Warning",
      details: (v) =>
        `Temperature reaching ${v}°C.`,
    },
  ],
};

const generateAlerts = (weather) => {
  const alerts = [];

  Object.entries(alertRules).forEach(([key, rules]) => {
    const value = weather[key];
    if (value === undefined) return;

    const matchedRule = rules.find(rule => value >= rule.min);

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

export const Alerts = () => {
  const weatherData = {
    windSpeed: 30,
    rainfall: 4,
    temperature: 29,
  };

  const alerts = generateAlerts(weatherData);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">
        Active Alerts
      </h1>

      {alerts.length === 0 ? (
        <p>No active alerts</p>
      ) : (
        alerts.map((alert, index) => (
          <AlertCard key={index} {...alert} />
        ))
      )}
    </div>
  );
};