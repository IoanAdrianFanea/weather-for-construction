import { useEffect } from 'react';
import { alertRules } from '../pages/Alerts';

const generateAlerts = (current) => {
  if (!current) return [];

  const windKmh = Math.round((current.wind?.speed || 0) * 3.6);
  const rainfall = current.rain?.['1h'] || current.rain?.['3h'] || 0;
  const temperature = Math.round(current.main?.temp || 0);
  const uvIndex = current.uvi || 0;
  const heatIndex = (tempC, humidity) => {
    if (tempC < 27) return null;
    const T = tempC * 9/5 + 32, R = humidity;
    const HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R
      - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R
      + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
    return Math.round((HI - 32) * 5/9);
  };

  const values = { windSpeed: windKmh, rainfall, temperature, uvIndex, heatIndex };
  const alerts = [];

  Object.entries(alertRules).forEach(([key, rules]) => {
    const value = values[key];
    const matched = rules.find(rule => value >= rule.min);
    if (matched) {
      alerts.push({
        title: matched.title,
        severity: matched.severity,
        time: 'Now',
        details: matched.details(value),
      });
    }
  });

  return alerts;
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

const NotificationModal = ({ onClose, current }) => {
  const alerts = generateAlerts(current);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
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

        <div className="overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">All clear</p>
              <p className="text-xs text-gray-400 mt-1">No weather alerts for your site right now</p>
            </div>
          ) : (
            alerts.map((alert, i) => <AlertCard key={i} {...alert} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;