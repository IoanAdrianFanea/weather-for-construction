import { useState } from 'react';
import { SearchBar } from './SearchBar';
import NotificationModal from './NotificationModal';

export const Header = ({ location, projectStatus, setActiveTab, current, geoError }) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const windKmh = Math.round((current?.wind?.speed || 0) * 3.6);
  const rainfall = current?.rain?.['1h'] || current?.rain?.['3h'] || 0;
  const temperature = Math.round(current?.main?.temp || 0);
  const hasAlerts = windKmh >= 15 || rainfall >= 5 || temperature >= 25;

  return (
    <>
      <div className="bg-white dark:bg-gray-900 px-4 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600">📍</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{location}</h1>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{projectStatus}</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="hidden lg:block">
            <SearchBar setActiveTab={setActiveTab} />
          </div>

          <button
            onClick={() => setNotifOpen(true)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasAlerts && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>
        </div>
      </div>

      {geoError && (
        <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold px-4 py-2 border-b border-amber-200 dark:border-amber-800">
          {geoError}
        </div>
      )}

      {notifOpen && (
        <NotificationModal
          onClose={() => setNotifOpen(false)}
          current={current}
        />
      )}
    </>
  );
};