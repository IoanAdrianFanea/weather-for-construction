import { useState } from 'react';
import { getWeatherByCity } from '../services/openWeather';
import { convertTemp, convertSpeed } from '../utils/units';

const RECOMMENDED_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Edinburgh',
  'Glasgow', 'Bristol', 'Leeds', 'Liverpool',
  'Cardiff', 'Newcastle', 'Sheffield', 'Nottingham',
];

const LocationCard = ({ name, temp, tempUnit, windSpeed, speedUnit, condition, alert, isDefault, onSetDefault }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold text-slate-800 dark:text-white">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{condition}</p>
        <p className="text-xs text-slate-400 mt-0.5">💨 {windSpeed} {speedUnit === 'mph' ? 'mph' : 'km/h'}</p>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{temp}°{tempUnit}</p>
    </div>
    {alert && (
      <div className="mt-3 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-2 text-sm text-yellow-800 dark:text-yellow-300">
        {alert}
      </div>
    )}
    <div className="mt-3 flex justify-end">
      {isDefault ? (
        <span className="text-xs text-green-500 font-semibold">✓ Default city</span>
      ) : (
        <button
          onClick={onSetDefault}
          className="text-xs px-3 py-1 rounded-full border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
        >
          Set as Default
        </button>
      )}
    </div>
  </div>
);

const Locations = ({ defaultCity, onSetDefaultCity, current, loading, error, tempUnit = 'C', speedUnit = 'kmh' }) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityWeather, setCityWeather] = useState(null);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState('');

  const handleSelectCity = async (cityName) => {
    setSelectedCity(cityName);
    setCityLoading(true);
    setCityError('');
    setCityWeather(null);
    try {
      const data = await getWeatherByCity(cityName);
      setCityWeather(data.current);
    } catch (e) {
      setCityError(e.message);
    } finally {
      setCityLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const normalized = searchValue.trim();
    if (!normalized) return;
    handleSelectCity(normalized);
    setSearchValue('');
  };

  const displayWeather = selectedCity ? cityWeather : current;
  const displayLoading = selectedCity ? cityLoading : loading;
  const displayError = selectedCity ? cityError : error;

  const locationName = displayWeather?.name
    ? `${displayWeather.name}, ${displayWeather.sys?.country}`
    : selectedCity || defaultCity;
  const condition = displayWeather?.weather?.[0]?.description || 'Conditions unavailable';
  const rawTemp = displayWeather?.main?.temp || 0;
  const rawWindKmh = Math.round((displayWeather?.wind?.speed || 0) * 3.6);
  const temp = convertTemp(rawTemp, tempUnit);
  const windSpeed = convertSpeed(rawWindKmh, speedUnit);
  const alert = rawWindKmh >= 25 ? 'Strong winds expected today' : null;

  const activeCity = displayWeather?.name || selectedCity || defaultCity;
  const isDefault = activeCity?.toLowerCase() === defaultCity?.toLowerCase();

  const deviceCity = current?.name || '';
  const recommendedCities = deviceCity
    ? [deviceCity, ...RECOMMENDED_CITIES.filter((city) => city.toLowerCase() !== deviceCity.toLowerCase())]
    : RECOMMENDED_CITIES;

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Locations</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">Weather across your job sites</p>

      <form className="relative" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search city..."
          className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </span>
      </form>

      <div className="flex flex-wrap gap-2">
        {recommendedCities.map((c) => (
          <button
            key={c}
            onClick={() => handleSelectCity(c)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors
              ${selectedCity === c
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border-slate-300 dark:border-gray-600 hover:border-blue-400'
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {displayLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {displayError && <p className="text-sm text-red-500">{displayError}</p>}
      {!displayLoading && !displayError && (
        <LocationCard
          name={locationName}
          temp={temp}
          tempUnit={tempUnit}
          windSpeed={windSpeed}
          speedUnit={speedUnit}
          condition={condition}
          alert={alert || undefined}
          isDefault={isDefault}
          onSetDefault={() => onSetDefaultCity(displayWeather?.name || selectedCity || defaultCity)}
        />
      )}
    </div>
  );
};

export default Locations;