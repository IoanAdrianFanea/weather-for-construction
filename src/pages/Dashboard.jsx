import { AlertBanner } from "../components/AlertBanner";
import { ForecastItem } from "../components/ForecastItem";
import { MetricTile } from "../components/MetricTile";

/**
 * Dashboard.jsx
 */
export const Dashboard = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-400 to-blue-300 pt-12 pb-16 relative overflow-hidden dark:from-gray-700 dark:to-gray-600 rounded-b-3xl mb-8">
        <div className="relative z-10 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Southbank Site A, London 📍</p>
          <div className="flex justify-center items-start">
            <h1 className="text-9xl font-black tracking-tighter">18</h1>
            <span className="text-4xl font-bold mt-4">°C</span>
          </div>
          <p className="text-2xl font-medium opacity-90">Cloudy with wind</p>
        </div>
        
        {/* Abstract Clouds */}
        <div className="absolute -bottom-8 -left-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-12 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <AlertBanner title="Strong winds expected today" />

      <div className="p-4 -mt-8 relative z-20">
        {/* Quick Metrics */}
        <div id="quick-metrics" className="grid grid-cols-3 gap-3 mb-6">
          <MetricTile label="Rain" value="70" unit="%" icon={<span className="text-2xl">🌧️</span>} />
          <MetricTile label="Wind" value="28" unit="km/h" icon={<span className="text-2xl">💨</span>} />
          <MetricTile label="Feels" value="16" unit="°" icon={<span className="text-2xl">🌡️</span>} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500 mb-6 dark:bg-gray-800">
          <h3 className="font-bold text-slate-800 mb-2 dark:text-slate-200">Recommendation</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Secure loose materials before work. High altitude operations should be paused after 14:30 due to increased wind shear risk.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-3">
            {[
              { day: 'MON', temp: '17', icon: '☁️' },
              { day: 'TUE', temp: '19', icon: '💧', active: true },
              { day: 'WED', temp: '15', icon: '🌧️' },
              { day: 'THU', temp: '13', icon: '⚡' },
              { day: 'FRI', temp: '16', icon: '☀️' }
            ].map((f, i) => (
              <ForecastItem key={i} day={f.day} temp={f.temp} icon={f.icon} active={f.active} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};