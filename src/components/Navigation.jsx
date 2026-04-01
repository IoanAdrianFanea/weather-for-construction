import { useRef, useState, useEffect } from 'react';
import logoIcon from '../assets/icons/logo_transparent_fixed.png';

/**
 * Navigation.jsx
 * Floating island-style bottom nav (mobile) + left sidebar (desktop)
 */
const SiteClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-4 shrink-0">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Site Briefing</p>
      <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{time}</p>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">{date}</p>
    </div>
  );
};

export const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'weather',   label: 'Weather',   icon: '☀️' },
    { id: 'locations', label: 'Locations', icon: '🗺️' },
    { id: 'forecast',  label: 'Forecast',  icon: '🗓️' },
    { id: 'detailed',  label: 'Report',    icon: '🔬' },
    { id: 'alerts',    label: 'Alerts',    icon: '🔔' },
    { id: 'safety',    label: 'Safety',    icon: '🦺' },
    { id: 'settings',  label: 'Settings',  icon: '⚙️' },
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const navScrollRef = useRef(null);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;

    if (diff > 0 && activeIndex < tabs.length - 1) {
      setActiveTab(tabs[activeIndex + 1].id);
    } else if (diff < 0 && activeIndex > 0) {
      setActiveTab(tabs[activeIndex - 1].id);
    }
    touchStartX.current = null;
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const bar = navScrollRef.current;
    if (!bar) return;
    const btn = bar.querySelector(`[data-id="${tabId}"]`);
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <>
      {/* ── Mobile: scrollable floating island ── */}
      <div
        className="lg:hidden fixed bottom-5 left-0 right-0 flex justify-center z-50 px-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={navScrollRef}
          className="
            mobile-nav-pill
            flex items-center gap-1 px-3 py-2.5 rounded-full
            bg-white/80 dark:bg-gray-900/80
            backdrop-blur-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)]
            border border-white/60 dark:border-gray-700/60
            overflow-x-auto
          "
          style={{
            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maxWidth: '92vw',
          }}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                data-id={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  flexShrink: 0,
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

      {/* ── Desktop: left sidebar ── */}
      <div
        id="desktop-sidebar"
        className="navigation-sidebar navigation_background hidden lg:flex fixed top-0 left-0 h-full w-72 border-r border-gray-100 dark:border-gray-700 flex-col pt-8 px-4 z-50"
      >
        {/* Logo — always visible at top */}
        <div className="mb-8 px-2 flex items-center gap-2 shrink-0">
          <img
            src={logoIcon}
            alt="SiteWeather logo"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-200">SiteWeather</h2>
            <p className="text-xs text-slate-400">Construction Dashboard</p>
          </div>
        </div>

        {/* Nav items — scrollable section */}
        <div
          className="flex-1 overflow-y-auto min-h-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 w-full text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-gray-700 dark:text-blue-400'
                  : 'text-slate-800 hover:bg-black/5 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Clock — always pinned at bottom, never scrolls */}
        <SiteClock />
      </div>

      {/* Keyframes + hide scrollbars */}
      <style>{`
        @keyframes labelPop {
          from { opacity: 0; transform: translateY(4px) scale(0.8); }
          to   { opacity: 1; transform: translateY(0)   scale(1);   }
        }
        .mobile-nav-pill::-webkit-scrollbar { display: none; }
        #desktop-sidebar .overflow-y-auto::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};