/**
 * MetricTile.jsx
 * Small data tiles for quick scanning
 */
export const MetricTile = ({ label, value, icon, unit }) => (
  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
    <div className="text-orange-500 mb-2">{icon}</div>
    <div className="text-lg font-bold text-slate-800">{value}<span className="text-xs ml-0.5 text-slate-400">{unit}</span></div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</div>
  </div>
);