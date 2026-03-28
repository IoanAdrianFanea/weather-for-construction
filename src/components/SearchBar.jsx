import { useState, useRef, useEffect } from 'react';

const pages = [
  { id: 'weather',   label: 'Dashboard' },
  { id: 'locations', label: 'Locations' },
  { id: 'alerts',    label: 'Alerts' },
  { id: 'settings',  label: 'Settings' },
  { id: 'forecast',  label: 'Forecast' },
  { id: 'safety',    label: 'Safety Guide' },
];

export const SearchBar = ({ setActiveTab }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const filtered = pages.filter(p =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSearchOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleNavigate = (id) => {
    setActiveTab(id);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setSearchOpen(o => !o)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {searchOpen && (
        <div className="absolute right-0 top-10 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full text-sm bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 border-none"
            />
          </div>
          <div className="p-2">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">No results found</p>
            ) : (
              filtered.map(page => (
                <button
                  key={page.id}
                  onClick={() => handleNavigate(page.id)}
                  className="flex items-center px-4 py-3 rounded-xl mb-1 w-full text-left transition-colors bg-white text-slate-800 hover:bg-gray-50 hover:text-slate-600 dark:bg-gray-800 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-200"
                >
                  <span className="text-sm font-semibold">{page.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};