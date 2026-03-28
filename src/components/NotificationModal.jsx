import { useEffect } from 'react';

const alertRules = {
  windSpeed: [
    {
      min: 25,
      severity: "high",
      title: "Strong Wind Warning",
      details: (v) => `Gusts exceeding ${v} mph expected. Secure loose materials and avoid outdoor tasks.`,
    },
    {
      min: 15,
      severity: "medium",
      title: "Wind Warning",
      details: (v) => `Gusts up to ${v} mph expected.`,
    },
  ],
  rainfall: [
    {
      min: 10,
      severity: "high",
      title: "Heavy Rain Advisory",
      details: (v) => `Heavy rainfall (${v} mm). Slippery conditions expected, avoid outdoor tasks.`,
    },
    {
      min: 5,
      severity: "medium",
      title: "Moderate Rain Advisory",
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
      min: 25,
      severity: "medium",
      title: "Warm Temperature Warning",
      details: (v) => `Temperature reaching ${v}°C.`,
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

const weatherData = {
  windSpeed: 30,
  rainfall: 4,
  temperature: 29,
};

const AlertCard = ({ title, time, severity, details }) => {
  const severityStyles = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-400 text-black',
  };

  return (
    <div className={`rounded-2xl overflow-hidden shadow-sm border ${severity === 'high' ? 'border-red-200' : 'border-yellow-200'}`}>
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

const NotificationModal = ({ onClose }) => {
  const alerts = generateAlerts(weatherData);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">Notifications</h2>
            <p className="text-xs text-gray-500">{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No active alerts</p>
          ) : (
            alerts.map((alert, i) => (
              <AlertCard key={i} {...alert} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
