import React from 'react';

const AlertCard = ({ title, time, severity, details }) => {
  const severityStyles = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-400 text-black',
  };

  return (
    <div className={`rounded-2xl overflow-hidden shadow-sm border ${severity === 'high' ? 'border-red-200' : 'border-yellow-200'}`}>
      <div className={`${severityStyles[severity]} px-4 py-2`}>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <div className="p-4 bg-white">
        <p className="text-xs text-slate-500 mb-2">{time}</p>
        <p className="text-sm text-slate-700">{details}</p>
      </div>
    </div>
  );
};

export const Alerts = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Active Alerts</h1>
      <AlertCard
        title="Strong Wind Warning"
        time="14:00 - 20:00"
        severity="high"
        details="Gusts up to 50mph expected. Secure all loose materials and halt crane operations."
      />
      <AlertCard
        title="Heavy Rain Advisory"
        time="18:00 - 22:00"
        severity="medium"
        details="Potential for localized flooding. Ensure drainage is clear."
      />
    </div>
  );
};