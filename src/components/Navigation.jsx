/**
 * BottomNavigation.jsx
 * Sticky bottom bar for app-wide navigation
 */
export const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'weather', label: 'Weather', icon: '☀️' },
    { id: 'locations', label: 'Locations', icon: '🗺️' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <>
      {/* Mobile: bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center z-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && <div className="h-1 w-1 bg-blue-600 rounded-full"></div>}
          </button>
        ))}
      </div>



      {/* Desktop: left sidebar */}
      <div id="desktop-sidebar" className="hidden lg:flex fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 flex-col pt-8 px-4 z-50">
        <div className="mb-8 px-2">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-200">SiteWeather Desktop</h2>
          <p className="text-xs text-slate-400">Construction Dashboard</p>
        </div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 w-full text-left transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 font-bold dark:bg-gray-700 dark:text-blue-400'
                : 'bg-white text-slate-800 hover:bg-gray-50 hover:text-slate-600 dark:bg-gray-800 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-sm font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};