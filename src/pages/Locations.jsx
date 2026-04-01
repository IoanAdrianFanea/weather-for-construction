import { useState, useEffect, useRef } from 'react';
import { getWeatherByCity } from '../services/openWeather';
import { convertTemp, convertSpeed } from '../utils/units';

const RECOMMENDED_CITIES = [ // List of recommended cities
  'London', 'Manchester', 'Birmingham', 'Edinburgh',
  'Glasgow', 'Bristol', 'Leeds', 'Liverpool',
  'Cardiff', 'Newcastle', 'Sheffield', 'Nottingham',
];

const WORLD_CITIES = [
  'Abu Dhabi','Accra','Addis Ababa','Adelaide','Algiers','Almaty','Amsterdam','Ankara',
  'Athens','Auckland','Baghdad','Baku','Bangkok','Barcelona','Beijing','Beirut','Belgrade',
  'Berlin','Birmingham','Bogota','Brisbane','Brussels','Bucharest','Budapest','Buenos Aires',
  'Cairo','Calgary','Cape Town','Caracas','Casablanca','Chennai','Chicago','Colombo',
  'Copenhagen','Dallas','Dar es Salaam','Delhi','Denver','Dhaka','Doha','Dubai','Dublin',
  'Durban','Edinburgh','Frankfurt','Glasgow','Guangzhou','Hamburg','Hanoi','Harare','Havana',
  'Helsinki','Ho Chi Minh City','Hong Kong','Houston','Hyderabad','Istanbul','Jakarta',
  'Johannesburg','Kabul','Kampala','Karachi','Kathmandu','Khartoum','Kyiv','Kinshasa',
  'Kuala Lumpur','Kuwait City','Lagos','Lahore','Lima','Lisbon','London','Los Angeles',
  'Luanda','Madrid','Manila','Melbourne','Mexico City','Miami','Milan','Minneapolis',
  'Minsk','Montreal','Moscow','Mumbai','Nairobi','New York','Oslo','Ottawa','Paris',
  'Perth','Philadelphia','Prague','Riyadh','Rome','San Francisco','Santiago','Sao Paulo',
  'Seattle','Seoul','Shanghai','Singapore','Sofia','Stockholm','Sydney','Taipei','Tashkent',
  'Tehran','Tel Aviv','Tokyo','Toronto','Tunis','Vancouver','Vienna','Warsaw','Washington DC',
  'Yangon','Yerevan','Zagreb','Zurich',
];

const loadFavourites = () => {
  try { return JSON.parse(localStorage.getItem('favouriteCities')) || []; }
  catch { return []; }
};

const saveFavourites = (favs) => {
  localStorage.setItem('favouriteCities', JSON.stringify(favs));
};

// ── Location card ──
const LocationCard = ({ name, temp, tempUnit, windSpeed, speedUnit, condition, alert, isDefault, onSetDefault, isFavourite, onToggleFavourite }) => (
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
    <div className="mt-3 flex justify-between items-center">
      <button
        onClick={onToggleFavourite}
        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
          isFavourite
            ? 'bg-amber-400 text-white border-amber-400'
            : 'border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white'
        }`}
      >
        {isFavourite ? '★ Saved' : '☆ Favourite'}
      </button>
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

// ── Favourite card ──
const FavouriteCard = ({ cityName, tempUnit, speedUnit, isDefault, onSetDefault, onRemove }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeatherByCity(cityName)
      .then(d => setWeather(d.current))
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, [cityName]);

  const temp       = weather ? convertTemp(weather.main?.temp || 0, tempUnit) : '—';
  const feels      = weather ? convertTemp(weather.main?.feels_like || 0, tempUnit) : '—';
  const tempLabel  = tempUnit === 'F' ? '°F' : '°C';
  const condition  = weather?.weather?.[0]?.description || '';
  const windKmh    = Math.round((weather?.wind?.speed || 0) * 3.6);
  const windSpeed  = convertSpeed(windKmh, speedUnit);
  const speedLabel = speedUnit === 'mph' ? 'mph' : 'km/h';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white">{cityName}</h3>
          {loading
            ? <p className="text-xs text-slate-400 mt-0.5">Loading...</p>
            : <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{condition}</p>
          }
        </div>
        <button onClick={onRemove} className="text-xs text-slate-300 hover:text-red-400 transition-colors dark:text-gray-600 dark:hover:text-red-400">✕</button>
      </div>

      {!loading && weather && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temp</p>
            <p className="text-sm font-black text-slate-800 dark:text-white">{temp}{tempLabel}</p>
          </div>
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wind</p>
            <p className="text-sm font-black text-slate-800 dark:text-white">{windSpeed} {speedLabel}</p>
          </div>
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feels</p>
            <p className="text-sm font-black text-slate-800 dark:text-white">{feels}{tempLabel}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        {isDefault ? (
          <span className="text-xs text-green-500 font-semibold">✓ Default city</span>
        ) : (
          <button onClick={onSetDefault} className="text-xs px-3 py-1 rounded-full border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
};

// ── Favourites subpage ──
const FavouritesPage = ({ favourites, defaultCity, onSetDefault, onRemove, onBack, tempUnit, speedUnit }) => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 className="page-title text-2xl font-bold text-black dark:text-white">Favourites</h1>
        <p className="text-sm text-gray-500">Your saved job site locations</p>
      </div>
    </div>
    {favourites.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">☆</p>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No favourites yet</p>
        <p className="text-xs text-slate-400 mt-1">Search a city and tap ☆ Favourite to save it here</p>
      </div>
    ) : (
      <div className="space-y-3">
        {favourites.map(city => (
          <FavouriteCard
            key={city}
            cityName={city}
            tempUnit={tempUnit}
            speedUnit={speedUnit}
            isDefault={city.toLowerCase() === defaultCity?.toLowerCase()}
            onSetDefault={() => onSetDefault(city)}
            onRemove={() => onRemove(city)}
          />
        ))}
      </div>
    )}
  </div>
);

// ── Main Locations page ──
const Locations = ({ defaultCity, onSetDefaultCity, current, loading, error, tempUnit = 'C', speedUnit = 'kmh', setActiveTab, coords, geoError }) => {
  const [searchValue, setSearchValue]         = useState('');
  const [suggestions, setSuggestions]         = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity]       = useState(null);
  const [cityWeather, setCityWeather]         = useState(null);
  const [cityLoading, setCityLoading]         = useState(false);
  const [cityError, setCityError]             = useState('');
  const [favourites, setFavourites]           = useState(loadFavourites);
  const [showFavourites, setShowFavourites]   = useState(false);
  const [geoStatus, setGeoStatus]             = useState(null); // null | 'requesting' | 'denied' | 'unavailable'
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMyLocation = () => {
    if (coords?.lat) {
      // Already have coords — clear selected city so geo weather shows
      setSelectedCity(null);
      setCityWeather(null);
      setCityError('');
      setGeoStatus(null);
      return;
    }
    if (!navigator.geolocation) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      () => { window.location.reload(); },
      () => { setGeoStatus('denied'); }
    );
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (val.trim().length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    const filtered = WORLD_CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 6);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelectCity = async (cityName) => {
    setSelectedCity(cityName);
    setSearchValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setCityLoading(true);
    setCityError('');
    setCityWeather(null);
    try { // Fetch weather data for the selected city
      const data = await getWeatherByCity(cityName); // API call to fetch weather by city name
      setCityWeather(data.current); // Update state
    } catch (e) {
      setCityError(e.message);
    } finally {
      setCityLoading(false);
    }
  };

  const handleSearch = (e) => { // Handle search
    e.preventDefault();
    const normalized = searchValue.trim(); 
    if (!normalized) return;
    handleSelectCity(normalized);
  };

  const handleToggleFavourite = (cityName) => {
    const updated = favourites.includes(cityName)
      ? favourites.filter(c => c !== cityName)
      : [...favourites, cityName];
    setFavourites(updated);
    saveFavourites(updated);
  };

  const handleRemoveFavourite = (cityName) => {
    const updated = favourites.filter(c => c !== cityName);
    setFavourites(updated);
    saveFavourites(updated);
  };

  const displayWeather = selectedCity ? cityWeather : current;
  const displayLoading = selectedCity ? cityLoading : loading;
  const displayError   = selectedCity ? cityError : error;

  // Fetch weather for default city on initial load if not already fetched
  const locationName = displayWeather?.name
    ? `${displayWeather.name}, ${displayWeather.sys?.country}`
    : selectedCity || defaultCity;
  const condition  = displayWeather?.weather?.[0]?.description || 'Conditions unavailable';
  const rawTemp    = displayWeather?.main?.temp || 0;
  const rawWindKmh = Math.round((displayWeather?.wind?.speed || 0) * 3.6);
  const temp       = convertTemp(rawTemp, tempUnit);
  const windSpeed  = convertSpeed(rawWindKmh, speedUnit);
  const alert      = rawWindKmh >= 25 ? 'Strong winds expected today' : null;

  const activeCity  = displayWeather?.name || selectedCity || defaultCity;
  const isDefault   = activeCity?.toLowerCase() === defaultCity?.toLowerCase();
  const isFavourite = favourites.includes(activeCity);

  const deviceCity = current?.name || '';
  const recommendedCities = deviceCity
    ? [deviceCity, ...RECOMMENDED_CITIES.filter(c => c.toLowerCase() !== deviceCity.toLowerCase())]
    : RECOMMENDED_CITIES;

  if (showFavourites) {
    return (
      <FavouritesPage
        favourites={favourites}
        defaultCity={defaultCity}
        onSetDefault={(city) => onSetDefaultCity(city)}
        onRemove={handleRemoveFavourite}
        onBack={() => setShowFavourites(false)}
        tempUnit={tempUnit}
        speedUnit={speedUnit}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Locations</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">Weather across your job sites</p>

      {/* Action buttons row */}
      <div className="flex gap-2">
        {/* My Location */}
        <button
          onClick={handleMyLocation}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border font-semibold transition-colors ${
            coords?.lat
              ? 'border-green-400 text-green-500 hover:bg-green-400 hover:text-white'
              : 'border-slate-300 text-slate-500 dark:border-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500'
          }`}
        >
          <span>📍</span>
          <span>{geoStatus === 'requesting' ? 'Requesting...' : coords?.lat ? 'My Location' : 'Enable Location'}</span>
        </button>

        {/* Favourites */}
        <button
          onClick={() => setShowFavourites(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white transition-colors font-semibold"
        >
          <span>★</span>
          <span>Favourites</span>
          {favourites.length > 0 && (
            <span className="bg-amber-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black -mr-1">
              {favourites.length}
            </span>
          )}
        </button>
      </div>

      {/* Geo status messages */}
      {geoStatus === 'denied' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
          <p className="font-bold mb-0.5">Location access denied</p>
          <p>To enable it, go to your browser settings and allow location access for this site, then reload the page.</p>
        </div>
      )}
      {geoStatus === 'unavailable' && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-300">
          Geolocation is not supported by your browser.
        </div>
      )}

      {/* Search with autocomplete */}
      <div ref={searchRef} className="relative">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search city..."
            className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
        </form>

        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden">
            {suggestions.map((city) => (
              <button
                key={city}
                onClick={() => handleSelectCity(city)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <span className="text-slate-400">📍</span>
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

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
          isFavourite={isFavourite}
          onSetDefault={() => onSetDefaultCity(displayWeather?.name || selectedCity || defaultCity)}
          onToggleFavourite={() => handleToggleFavourite(activeCity)}
        />
      )}
    </div>
  );
};

export default Locations;