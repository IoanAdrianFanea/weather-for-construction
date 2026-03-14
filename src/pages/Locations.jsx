import React from 'react';

const LocationCard = ({ name, temp, condition, alert }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold text-slate-800">{name}</h3>
        <p className="text-sm text-slate-500">{condition}</p>
      </div>
      <p className="text-2xl font-bold text-slate-800">{temp}°</p>
    </div>
    {alert && (
      <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800">
        {alert}
      </div>
    )}
  </div>
);

const Locations = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search job sites..."
          className="w-full p-3 pl-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
      <LocationCard
        name="Southbank Site A"
        temp={18}
        condition="Cloudy with wind"
        alert="Strong winds expected today"
      />
      <LocationCard
        name="Warehouse - Manchester"
        temp={9}
        condition="Heavy Rain"
        alert="Concrete pour delayed"
      />
      <LocationCard
        name="Skyline Tower - Birmingham"
        temp={15}
        condition="Clear Skies"
      />
    </div>
  );
};

export default Locations;