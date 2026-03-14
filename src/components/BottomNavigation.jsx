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
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-2 sm:px-6 py-2 flex justify-between items-center z-50">
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
  );
};