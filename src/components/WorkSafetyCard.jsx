/**
 * WorkSafetyCard.jsx
 * The primary decision-making card for construction workers.
 */
export const WorkSafetyCard = ({ status, time, rainRisk, windRisk }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 mb-4 relative overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase text-xs tracking-widest">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        Work Safety Status
      </div>
      <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
      </div>
    </div>
    <h2 className="text-2xl font-black text-slate-800 mb-6">{status} until {time}</h2>
    
    <div className="space-y-3 mb-6">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400 font-medium">Max Wind Gusts</span>
        <span className="text-slate-700 font-bold">{windRisk}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400 font-medium">Precipitation Prob.</span>
        <span className="text-slate-700 font-bold">{rainRisk}</span>
      </div>
    </div>
    
    <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200">
      View Full Safety Protocol
    </button>
  </div>
);