import React from 'react';
import { useState } from 'react';

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

const Locations = ({ city, onSearchCity, current, loading, error }) => {
  const [searchValue, setSearchValue] = useState(city || '');

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = searchValue.trim();
    if (!normalized) return;
    onSearchCity(normalized);
  };

  const locationName =
    current?.name && current?.sys?.country
      ? `${current.name}, ${current.sys.country}`
      : city;
  const condition = current?.weather?.[0]?.description || 'Current conditions unavailable';
  const temp = Math.round(current?.main?.temp || 0);
  const windKmh = Math.round((current?.wind?.speed || 0) * 3.6);
  const alert =
    windKmh >= 25
      ? 'Strong winds expected today'
      : null;

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search city..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="w-full p-3 pl-10 pr-24 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </span>
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-slate-600 text-sm">Loading location weather...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <LocationCard
        name={locationName}
        temp={temp}
        condition={condition}
        alert={alert}
      />
    </div>
  );
};

export default Locations;