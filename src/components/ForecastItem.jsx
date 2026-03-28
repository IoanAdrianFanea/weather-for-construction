/**
 * ForecastItem.jsx
 * A single item in the 5-day forecast list
 */
export const ForecastItem = ({ day, temp, icon, active }) => (
    <div className={`shrink-0 w-18 lg:w-50 py-4 rounded-2xl flex flex-col items-center gap-2 border ${active ? 'bg-white border-blue-500 shadow-md shadow-blue-100 dark:bg-gray-700 dark:border-blue-500 dark:shadow-blue-900' : 'bg-white border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700'}`}>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-400">{day}</span>
        <span className="text-2xl">{icon}</span>
        <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{temp}°</span>
    </div>
);