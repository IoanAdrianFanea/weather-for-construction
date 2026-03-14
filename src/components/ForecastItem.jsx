/**
 * ForecastItem.jsx
 * A single item in the 5-day forecast list
 */
export const ForecastItem = ({ day, temp, icon, active }) => (
    <div className={`shrink-0 w-20 py-4 rounded-2xl flex flex-col items-center gap-2 border ${active ? 'bg-white border-blue-500 shadow-md shadow-blue-100' : 'bg-white border-gray-100 shadow-sm'}`}>
        <span className="text-[10px] font-black text-slate-400">{day}</span>
        <span className="text-2xl">{icon}</span>
        <span className="text-lg font-bold text-slate-800">{temp}°</span>
    </div>
);