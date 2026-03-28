import { useRef } from 'react';

/**
 * BottomNavigation.jsx
 * Floating island-style bottom nav with swipe-to-navigate support
 */
export const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'weather',   label: 'Weather',   icon: '☀️' },
    { id: 'locations', label: 'Locations', icon: '🗺️' },
    { id: 'alerts',    label: 'Alerts',    icon: '🔔' },
    { id: 'safety',    label: 'Safety',    icon: '🦺' },
    { id: 'forecast',  label: 'Forecast',   icon: '📈'},
    { id: 'settings',  label: 'Settings',  icon: '⚙️' },

  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return; // ignore small swipes

    if (diff > 0 && activeIndex < tabs.length - 1) {
      setActiveTab(tabs[activeIndex + 1].id);
    } else if (diff < 0 && activeIndex > 0) {
      setActiveTab(tabs[activeIndex - 1].id);
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* ── Mobile: floating island ── */}
      <div
        className="lg:hidden fixed bottom-5 left-0 right-0 flex justify-center z-50 px-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="
            flex items-center gap-1 px-3 py-2.5 rounded-full
            bg-white/80 dark:bg-gray-900/80
            backdrop-blur-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)]
            border border-white/60 dark:border-gray-700/60
          "
          style={{ transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
        >
          {tabs.map((tab, i) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                className={`
                  relative flex flex-col items-center justify-center rounded-full
                  ${isActive
                    ? 'bg-gray-900 dark:bg-white px-4 py-2 gap-0.5'
                    : 'px-3 py-2 gap-0.5'
                  }
                `}
              >
                <span
                  className="leading-none"
                  style={{
                    fontSize: isActive ? '1.15rem' : '1.1rem',
                    transition: 'font-size 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    filter: isActive ? 'none' : 'grayscale(30%)',
                    opacity: isActive ? 1 : 0.55,
                  }}
                >
                  {tab.icon}
                </span>
                {isActive && (
                  <span
                    className="text-[9px] font-black uppercase tracking-widest text-white dark:text-gray-900 whitespace-nowrap"
                    style={{
                      animation: 'labelPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
                    }}
                  >
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop: left sidebar (unchanged) ── */}
      <div
        id="desktop-sidebar"
        className="hidden lg:flex fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex-col pt-8 px-4 z-50"
      >
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

      {/* Label pop-in keyframe */}
      <style>{`
        @keyframes labelPop {
          from { opacity: 0; transform: translateY(4px) scale(0.8); }
          to   { opacity: 1; transform: translateY(0)   scale(1);   }
        }
      `}</style>
    </>
  );
};