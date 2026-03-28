import { useTheme } from '../context/ThemeContext';

const UnitToggle = ({ value, optionA, optionB, labelA, labelB, onChange }) => (
  <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-gray-600">
    <button
      onClick={() => onChange(optionA)}
      className={`px-3 py-1 text-sm font-semibold transition-colors ${
        value === optionA
          ? 'bg-blue-500 text-white'
          : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300'
      }`}
    >
      {labelA}
    </button>
    <button
      onClick={() => onChange(optionB)}
      className={`px-3 py-1 text-sm font-semibold transition-colors ${
        value === optionB
          ? 'bg-blue-500 text-white'
          : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300'
      }`}
    >
      {labelB}
    </button>
  </div>
);

const Settings = ({ defaultCity, tempUnit, setTempUnit, speedUnit, setSpeedUnit }) => {
  const { isDark, toggle } = useTheme();

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Settings</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">Modify your preferences</p>

      <div className="space-y-2">
        <h3 className="page-h2 text-sm font-bold text-slate-600 dark:text-slate-400">Measurement Units</h3>
        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Temperature</span>
          <UnitToggle
            value={tempUnit}
            optionA="C" labelA="°C"
            optionB="F" labelB="°F"
            onChange={setTempUnit}
          />
        </div>
        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Wind Speed</span>
          <UnitToggle
            value={speedUnit}
            optionA="kmh" labelA="km/h"
            optionB="mph" labelB="mph"
            onChange={setSpeedUnit}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="page-h2 text-sm font-bold text-slate-600 dark:text-slate-400">Site Preferences</h3>
        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Safety Alerts</span>
          <div className="w-10 h-5 bg-blue-500 rounded-full relative">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Default City</span>
          <span className="text-blue-500 font-semibold">{defaultCity || 'Not set'}</span>
        </div>
        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Theme</span>
          <div
            onClick={toggle}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${isDark ? 'bg-blue-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${isDark ? 'left-5' : 'left-0.5'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;