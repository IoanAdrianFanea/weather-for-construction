import { useState, useRef } from 'react';
import { convertTemp, convertSpeed } from '../utils/units';

const HourlyStrip = ({ hourly, tempUnit, speedUnit }) => {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  };

  const onMouseUp = () => { isDragging.current = false; };

  return (
    <div
      ref={ref}
      className="flex gap-2 overflow-x-auto select-none pb-2 lg:grid lg:grid-cols-8 lg:overflow-x-visible"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {hourly.map((h, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-14 lg:w-auto bg-slate-50 dark:bg-gray-700 rounded-xl p-1.5 flex flex-col items-center gap-0.5 border border-slate-100 dark:border-gray-600"
        >
          <p className="text-xs text-slate-400 font-medium whitespace-nowrap">{h.hour}</p>
          <p className="text-base leading-tight">{h.icon}</p>
          <p className="text-xs font-bold text-slate-800 dark:text-white">{convertTemp(h.temp, tempUnit)}°{tempUnit}</p>
          <p className="text-xs text-slate-400">💨{convertSpeed(h.windSpeed, speedUnit)}</p>
          <p className="text-xs text-slate-400">💧{h.humidity}%</p>
        </div>
      ))}
    </div>
  );
};

const ForecastRow = ({ item, tempUnit, speedUnit }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
      <div
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3 ">
          <div className="w-10 flex-shrink-0">
            <p className="text-xs text-slate-400">{item.dateLabel}</p>
            <p className="font-bold text-sm text-slate-800 dark:text-white">{item.day}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.condition}</p>
            <p className="text-xs text-slate-400">💨 {convertSpeed(item.windSpeed, speedUnit)} {speedUnit === 'mph' ? 'mph' : 'km/h'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-xl leading-tight">{item.icon}</p>
            <p className="text-base font-bold text-slate-800 dark:text-white">{convertTemp(item.temp, tempUnit)}°{tempUnit}</p>
          </div>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {open && item.hourly?.length > 0 && (
        <div className="px-3 pb-3 border-t border-slate-100 dark:border-gray-700">
          <p className="text-xs text-slate-400 mt-2 mb-1">Every 3 hours — drag to scroll</p>
          <HourlyStrip hourly={item.hourly} tempUnit={tempUnit} speedUnit={speedUnit} />
        </div>
      )}
    </div>
  );
};

const Forecast = ({ forecast, loading, error, tempUnit = 'C', speedUnit = 'kmh' }) => {
  if (loading) return <div className="p-4 text-slate-600 dark:text-slate-400">Loading forecast...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!forecast?.length) return <div className="p-4 text-slate-600 dark:text-slate-400">No forecast data available.</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">5- Day Forecast</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">View hourly predictions</p>
      {forecast.map((item) => (
        <ForecastRow key={`${item.day}-${item.dateLabel}`} item={item} tempUnit={tempUnit} speedUnit={speedUnit} />
      ))}
    </div>
  );
};

export default Forecast;