import { useState } from 'react';

/**
 * AdminPanel.jsx
 * Dev/testing panel to override weather values used in
 * the recommendation and alert logic on the Dashboard.
 *
 * Severity thresholds (mirrors Dashboard logic):
 *   Wind speed  > 30 km/h  → warning
 *   Rain chance > 60%      → warning  (100% = all day rain)
 *   Temperature > 25°C     → warning
 *   All three triggered    → extreme (high)
 */

const PRESETS = [
  {
    label: '✅ All Clear',
    values: { wind_speed: 10, rain_chance: 20, temperature: 18 },
  },
  {
    label: '⚠️ Windy',
    values: { wind_speed: 35, rain_chance: 20, temperature: 18 },
  },
  {
    label: '⚠️ Heavy Rain',
    values: { wind_speed: 10, rain_chance: 100, temperature: 18 },
  },
  {
    label: '⚠️ High Heat',
    values: { wind_speed: 10, rain_chance: 20, temperature: 30 },
  },
  {
    label: '🚨 Extreme',
    values: { wind_speed: 40, rain_chance: 100, temperature: 32 },
  },
];

const Slider = ({ label, value, min, max, unit, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
      <span>{label}</span>
      <span className="font-black text-slate-800 dark:text-white">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-orange-500"
    />
    <div className="flex justify-between text-[10px] text-slate-400">
      <span>{min}{unit}</span>
      <span>{max}{unit}</span>
    </div>
  </div>
);

const AdminPanel = ({ liveWeather, overrideWeather, setOverrideWeather, clearOverride }) => {
  const [open, setOpen] = useState(false);
  const isOverriding = overrideWeather !== null;

  const current = overrideWeather ?? liveWeather;

  const handleSlider = (key, value) => {
    setOverrideWeather({ ...(overrideWeather ?? liveWeather), [key]: value });
  };

  const applyPreset = (preset) => {
    setOverrideWeather(preset.values);
  };

  return (
    <div className="mx-4 mb-4">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border
          ${isOverriding
            ? 'bg-orange-500 text-white border-orange-600'
            : 'bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 border-gray-200 dark:border-gray-700'
          }`}
      >
        <span className="flex items-center gap-2">
          <span>🛠️</span>
          <span>Admin Panel {isOverriding ? '— Override Active' : ''}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-5 shadow-lg">

          {/* Status */}
          <div className={`text-xs font-semibold px-3 py-2 rounded-lg ${isOverriding ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
            {isOverriding
              ? '⚡ Live data is paused — using manual override values below.'
              : '📡 Showing live weather data. Adjust sliders to override.'}
          </div>

          {/* Presets */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-slate-700 dark:text-slate-200 hover:border-orange-400 hover:text-orange-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manual Override</p>
            <Slider
              label="💨 Wind Speed"
              value={current.wind_speed}
              min={0} max={80} unit=" km/h"
              onChange={(v) => handleSlider('wind_speed', v)}
            />
            <Slider
              label="🌧️ Rain Chance"
              value={current.rain_chance}
              min={0} max={100} unit="%"
              onChange={(v) => handleSlider('rain_chance', v)}
            />
            <Slider
              label="🌡️ Temperature"
              value={current.temperature}
              min={-10} max={45} unit="°C"
              onChange={(v) => handleSlider('temperature', v)}
            />
          </div>

          {/* Current values summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Wind', value: `${current.wind_speed} km/h`, warn: current.wind_speed > 30 },
              { label: 'Rain', value: `${current.rain_chance}%`, warn: current.rain_chance > 60 },
              { label: 'Temp', value: `${current.temperature}°C`, warn: current.temperature > 25 },
            ].map(({ label, value, warn }) => (
              <div
                key={label}
                className={`rounded-xl p-2 text-xs font-bold border ${warn ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-slate-600 dark:text-slate-300'}`}
              >
                <div className="text-[10px] font-black uppercase opacity-60 mb-0.5">{label}</div>
                {value}
              </div>
            ))}
          </div>

          {/* Reset button */}
          {isOverriding && (
            <button
              onClick={() => { clearOverride(); }}
              className="w-full py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-600 transition-colors"
            >
              ↩ Reset to Live Weather
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;