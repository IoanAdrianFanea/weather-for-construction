import React from 'react';

const LocationCard = ({ name, temp, condition, alert }) => (
  <div className="Item-box bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold text-slate-800 dark:text-white">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">{condition}</p>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{temp}°</p>
    </div>
    {alert && (
      <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800 dark:text-yellow-300">
        {alert}
      </div>
    )}
  </div>
);

const Locations = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Locations</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">Weather across your job sites</p>

      <div className="relative">
        <input
          type="text"
          placeholder="Search job sites..."
          className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      <LocationCard name="Southbank Site A" temp={18} condition="Cloudy with wind" alert="Strong winds expected today" />
      <LocationCard name="Warehouse - Manchester" temp={9} condition="Heavy Rain" alert="Concrete pour delayed" />
      <LocationCard name="Skyline Tower - Birmingham" temp={15} condition="Clear Skies" />
    </div>
  );
};

export default Locations;