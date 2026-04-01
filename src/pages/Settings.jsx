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

const Toggle = ({ enabled, onChange }) => (
  <div
    onClick={onChange}
    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${enabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
  >
    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${enabled ? 'left-5' : 'left-0.5'}`} />
  </div>
);

const Settings = ({ defaultCity, tempUnit, setTempUnit, speedUnit, setSpeedUnit, alertsEnabled, setAlertsEnabled }) => {
  const { isDark, toggle } = useTheme();

  const notifPermission = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';

  const handleAlertsToggle = async () => {
    if (alertsEnabled) {
      // Turn off
      setAlertsEnabled(false);
      return;
    }

    // Turn on — request permission if needed
    if (notifPermission === 'denied') {
      alert('Notifications are blocked by your browser. Please enable them in your browser site settings and try again.');
      return;
    }

    if (notifPermission === 'default') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') return;
    }

    setAlertsEnabled(true);
    new Notification('SiteWeather Alerts Enabled', {
      body: 'You will now receive safety alerts when weather conditions change.',
      icon: '/logostandard.png',
    });
  };

  const permissionLabel = () => {
    if (notifPermission === 'denied') return <span className="text-xs text-red-500 font-semibold">Blocked by browser</span>;
    if (notifPermission === 'granted' && alertsEnabled) return <span className="text-xs text-green-500 font-semibold">Active</span>;
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Settings</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">Modify your preferences</p>

      <div className="space-y-2">
        <h3 className="page-h2 text-sm font-bold text-slate-600 dark:text-slate-400">Measurement Units</h3>
        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Temperature</span>
          <UnitToggle value={tempUnit} optionA="C" labelA="°C" optionB="F" labelB="°F" onChange={setTempUnit} />
        </div>
        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Wind Speed</span>
          <UnitToggle value={speedUnit} optionA="kmh" labelA="km/h" optionB="mph" labelB="mph" onChange={setSpeedUnit} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="page-h2 text-sm font-bold text-slate-600 dark:text-slate-400">Site Preferences</h3>

        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-black dark:text-white">Safety Alerts</span>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-400">Browser notifications for weather warnings</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {permissionLabel()}
              <Toggle enabled={alertsEnabled} onChange={handleAlertsToggle} />
            </div>
          </div>
          {notifPermission === 'denied' && (
            <p className="text-xs text-red-400 mt-3 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
              ⚠️ Notifications are blocked. Go to your browser settings → Site Settings → Notifications to allow them for this site.
            </p>
          )}
        </div>

        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Default City</span>
          <span className="text-blue-500 font-semibold">{defaultCity || 'Not set'}</span>
        </div>

        <div className="setting-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-black dark:text-white">Theme</span>
          <Toggle enabled={isDark} onChange={toggle} />
        </div>
      </div>
    </div>
  );
};

export default Settings;