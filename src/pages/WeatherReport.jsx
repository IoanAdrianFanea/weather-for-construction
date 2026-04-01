import { useEffect, useState } from 'react';
import { convertTemp, convertSpeed } from '../utils/units';

const getApiKey = () => import.meta.env.VITE_OPENWEATHER_API_KEY;

// ─── Calculation helpers ─────────────────────────────────────────────────────

const windDirection = (deg) => { // Convert wind direction in degrees to compass direction
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
};

const beaufortScale = (kmh) => { // Convert wind speed in km/h to Beaufort scale
  const table = [
    [1,0,'Calm'], [6,1,'Light air'], [12,2,'Light breeze'], [20,3,'Gentle breeze'],
    [29,4,'Moderate breeze'], [39,5,'Fresh breeze'], [50,6,'Strong breeze'],
    [62,7,'Near gale'], [75,8,'Gale'], [89,9,'Severe gale'],
    [103,10,'Storm'], [118,11,'Violent storm'],
  ];
  for (const [max, level, desc] of table) if (kmh < max) return { level, desc }; 
  return { level: 12, desc: 'Hurricane' }; // Above 118 km/h is hurricane force
};

const dewPoint = (tempC, humidity) => { // Calculate dew point in °C using the Magnus formula
  const a = 17.27, b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha) * 10) / 10;
};

const wetBulb = (tempC, humidity) => {
  const wb = tempC * Math.atan(0.151977 * Math.pow(humidity + 8.313659, 0.5))
    + Math.atan(tempC + humidity)
    - Math.atan(humidity - 1.676331)
    + 0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity)
    - 4.686035;
  return Math.round(wb * 10) / 10;
};

const heatIndex = (tempC, humidity) => { // Calculate heat index in °C using the Rothfusz regression, return null if unable to calculate
  if (tempC < 27) return null;
  const T = tempC * 9/5 + 32, R = humidity;
  const HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R
    - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R
    + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
  return Math.round((HI - 32) * 5/9);
};

const windChill = (tempC, windKmh) => { // Calculate wind chill in °C using the North American formula, return null if unable to calculate
  if (tempC > 10 || windKmh < 4.8) return null;
  const wc = 13.12 + 0.6215*tempC - 11.37*Math.pow(windKmh, 0.16) + 0.3965*tempC*Math.pow(windKmh, 0.16);
  return Math.round(wc * 10) / 10;
};

const absoluteHumidity = (tempC, humidity) => { // Calculate absolute humidity in g/m³
  const es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  return Math.round((2.1674 * humidity * es) / (tempC + 273.15) * 10) / 10;
};

const vapourPressureDeficit = (tempC, humidity) => { // Calculate vapour pressure deficit in kPa
  const es = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  return Math.round((1 - humidity / 100) * es * 100) / 100;
};

const wetBulbRisk = (wb) => { // Determine heat stress risk level based
  if (wb >= 32) return { label: 'Extreme danger', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', note: 'Stop all outdoor work immediately' };
  if (wb >= 28) return { label: 'Danger', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', note: 'Limit strenuous outdoor tasks, mandatory rest breaks' };
  if (wb >= 25) return { label: 'High caution', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', note: 'Increase rest breaks, ensure workers stay hydrated' };
  if (wb >= 18) return { label: 'Caution', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', note: 'Normal precautions apply' };
  return { label: 'Safe', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', note: 'No heat stress risk' };
};

const pressureTrend = (hpa) => { // Determine pressure trend category based on hPa value
  if (hpa > 1022) return { label: 'High', desc: 'Stable, clear conditions likely', color: 'text-green-600 dark:text-green-400' };
  if (hpa > 1009) return { label: 'Normal', desc: 'Settled conditions', color: 'text-blue-600 dark:text-blue-400' };
  return { label: 'Low', desc: 'Unsettled — rain or wind likely', color: 'text-red-600 dark:text-red-400' };
};

const visibilityDesc = (m) => { // Convert visibility in meters to descriptive categories
  if (m >= 10000) return 'Excellent';
  if (m >= 5000)  return 'Good';
  if (m >= 2000)  return 'Moderate';
  if (m >= 1000)  return 'Poor';
  return 'Very poor — fog conditions';
};

const uvDesc = (uvi) => { // Convert UV index to descriptive category and recommended precautions
  if (uvi <= 2)  return { label: 'Low',       color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',   site: 'No protection needed' };
  if (uvi <= 5)  return { label: 'Moderate',  color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', site: 'Sun protection for prolonged outdoor work' };
  if (uvi <= 7)  return { label: 'High',      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', site: 'SPF 30+ required, limit midday exposure' };
  if (uvi <= 10) return { label: 'Very High', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',           site: 'SPF 50+ required, reschedule outdoor work if possible' };
  return { label: 'Extreme', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', site: 'Avoid outdoor work during peak hours' };
};

const aqiDesc = (aqi) => { // Convert AQI value to descriptive category and recommended PPE
  const levels = [
    { label: 'Good',      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',     ppe: 'No respiratory PPE required' },
    { label: 'Fair',      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', ppe: 'Standard dust mask recommended for sensitive workers' },
    { label: 'Moderate',  color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', ppe: 'FFP2 mask recommended for all outdoor workers' },
    { label: 'Poor',      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',             ppe: 'FFP3 mask required, limit time outdoors' },
    { label: 'Very Poor', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', ppe: 'Full respiratory protection, consider postponing work' },
  ];
  return levels[(aqi ?? 1) - 1] || levels[0]; 
};

const vpdDryingDesc = (vpd) => { // Convert vapour pressure deficit to drying condition categories 
  if (vpd < 0.4) return 'Very slow drying — high moisture, poor conditions for painting or concrete finishing';
  if (vpd < 0.8) return 'Slow drying — adequate for most tasks but allow extra cure time';
  if (vpd < 1.2) return 'Good drying conditions';
  if (vpd < 2.0) return 'Fast drying — monitor concrete and adhesives closely';
  return 'Very fast drying — risk of cracking in concrete/mortar, keep surfaces moist';
};

// ─── UI components ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, icon }) => ( // A header component for different sections of the report
  <div className="flex items-center gap-2 mb-3 mt-2">
    <span className="text-base">{icon}</span>
    <h2 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</h2>
    <div className="flex-1 h-px bg-slate-200 dark:bg-gray-700 ml-1" />
  </div>
);

// Fixed-height card for desktop grids
const Card = ({ label, value, unit, sub, highlight }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 border shadow-sm flex flex-col justify-between h-28 ${highlight ? 'border-orange-300 dark:border-orange-700' : 'border-slate-100 dark:border-gray-700'}`}>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{label}</span>
    <div>
      {value !== undefined && (
        <div className="text-xl font-black text-slate-800 dark:text-white leading-tight">
          {value}{unit && <span className="text-xs font-semibold text-slate-400 ml-1">{unit}</span>}
        </div>
      )}
      {sub && <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">{sub}</p>}
    </div>
  </div>
);

// Row-style item — used everywhere on mobile, and for Heat Stress/Wind/Atmosphere on desktop too
const RowItem = ({ label, value, unit, sub, badge, badgeColor, highlight }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 border shadow-sm flex items-center justify-between gap-4 ${highlight ? 'border-orange-300 dark:border-orange-700' : 'border-slate-100 dark:border-gray-700'}`}>
    <div className="flex-1 min-w-0">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{label}</span>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        {value !== undefined && (
          <span className="text-lg font-black text-slate-800 dark:text-white leading-tight">
            {value}{unit && <span className="text-xs font-semibold text-slate-400 ml-1">{unit}</span>}
          </span>
        )}
        {sub && <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{sub}</p>}
      </div>
    </div>
    {badge && <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 whitespace-nowrap ${badgeColor}`}>{badge}</span>}
  </div>
);

// Always rows (Heat Stress, Wind, Atmosphere, UV, AQI header)
const RowStack = ({ children }) => (
  <div className="flex flex-col gap-2 mb-6">{children}</div>
);

// ─── Main page ───────────────────────────────────────────────────────────────

const WeatherReport = ({ current, loading, error, tempUnit = 'C', speedUnit = 'kmh' }) => { // Main component
  const [uvIndex, setUvIndex]   = useState(null);
  const [uvLoading, setUvLoading] = useState(false);
  const [aqi, setAqi]           = useState(null);
  const [aqiComponents, setAqiComponents] = useState(null);

  useEffect(() => {
    if (!current?.coord) return;
    const { lat, lon } = current.coord; // Get latitude and longitude from current weather data
    const key = getApiKey();

    setUvLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${key}`) // Fetch UV index data from OpenWeather API
      .then(r => r.json())
      .then(d => { setUvIndex(d.value ?? null); setUvLoading(false); })
      .catch(() => setUvLoading(false));

    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`) // Fetch air quality index data from OpenWeather API
      .then(r => r.json())
      .then(d => {
        const item = d.list?.[0];
        if (item) { setAqi(item.main?.aqi); setAqiComponents(item.components); }
      })
      .catch(() => {});
  }, [current?.coord?.lat, current?.coord?.lon]);

  if (loading)  return <div className="p-4 text-slate-600 dark:text-slate-400">Loading...</div>;
  if (error)    return <div className="p-4 text-red-500">{error}</div>;
  if (!current) return <div className="p-4 text-slate-600 dark:text-slate-400">No data available.</div>;

  const tempC       = current.main?.temp ?? 0;
  const feelsC      = current.main?.feels_like ?? tempC;
  const minC        = current.main?.temp_min ?? tempC;
  const maxC        = current.main?.temp_max ?? tempC;
  const humidity    = current.main?.humidity ?? 0;
  const pressure    = current.main?.pressure ?? 1013;
  const seaLevel    = current.main?.sea_level ?? pressure;
  const groundLevel = current.main?.grnd_level ?? null;
  const visibility  = current.visibility ?? 10000;
  const windMs      = current.wind?.speed ?? 0;
  const windKmh     = Math.round(windMs * 3.6);
  const windDeg     = current.wind?.deg ?? 0;
  const gustMs      = current.wind?.gust ?? windMs;
  const gustKmh     = Math.round(gustMs * 3.6);
  const cloudPct    = current.clouds?.all ?? 0;
  const rainMm1h    = current.rain?.['1h'] ?? 0;
  const rainMm3h    = current.rain?.['3h'] ?? 0;
  const snowMm      = current.snow?.['1h'] ?? current.snow?.['3h'] ?? 0;
  const sunrise     = current.sys?.sunrise;
  const sunset      = current.sys?.sunset;
  const weatherId   = current.weather?.[0]?.id;
  const weatherDesc = current.weather?.[0]?.description ?? '';
  const dt          = current.dt;

  const tempLabel  = tempUnit === 'F' ? '°F' : '°C';
  const speedLabel = speedUnit === 'mph' ? 'mph' : 'km/h';

  const dp   = dewPoint(tempC, humidity);
  const wb   = wetBulb(tempC, humidity);
  const wbR  = wetBulbRisk(wb);
  const hi   = heatIndex(tempC, humidity);
  const wc   = windChill(tempC, windKmh);
  const absH = absoluteHumidity(tempC, humidity);
  const vpd  = vapourPressureDeficit(tempC, humidity);
  const bf   = beaufortScale(windKmh);
  const pres = pressureTrend(pressure);
  const uv   = uvIndex !== null ? uvDesc(uvIndex) : null;
  const aqiD = aqi !== null ? aqiDesc(aqi) : null;

  const sunriseStr   = sunrise ? new Date(sunrise * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';
  const sunsetStr    = sunset  ? new Date(sunset  * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';
  const daylightMins = sunrise && sunset ? Math.round((sunset - sunrise) / 60) : null;
  const daylightStr  = daylightMins ? `${Math.floor(daylightMins / 60)}h ${daylightMins % 60}m` : '—';
  const nowSec       = Math.floor(Date.now() / 1000);
  const minsToSunset = sunset ? Math.max(0, Math.round((sunset - nowSec) / 60)) : null;
  const workingLight = minsToSunset !== null
    ? (minsToSunset === 0 ? 'Daylight ended' : `${Math.floor(minsToSunset / 60)}h ${minsToSunset % 60}m remaining`)
    : '—';
  const lastUpdated  = dt ? new Date(dt * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

  return (
    <div className="p-4 space-y-4">

      {/* Page header */}
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Report</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-2">Full technical readout for site planning</p>
      <div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded-lg">Updated {lastUpdated}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded-lg capitalize">{weatherDesc} · ID {weatherId}</span>
        </div>
      </div>

      {/* ── 1. Temperature ── */}
      {/* Mobile: rows | Desktop: 4-col grid */}
      <SectionHeader icon="🌡️" title="Temperature" />
      <div className="flex flex-col gap-2 mb-6 md:hidden">
        <RowItem label="Actual"     value={convertTemp(tempC,  tempUnit)} unit={tempLabel} />
        <RowItem label="Feels Like" value={convertTemp(feelsC, tempUnit)} unit={tempLabel} sub="Wind & humidity adjusted" />
        <RowItem label="Min Today"  value={convertTemp(minC,   tempUnit)} unit={tempLabel} />
        <RowItem label="Max Today"  value={convertTemp(maxC,   tempUnit)} unit={tempLabel} />
        {hi !== null && <RowItem label="Heat Index" value={convertTemp(hi, tempUnit)} unit={tempLabel} sub="Apparent temp in shade" highlight />}
        {wc !== null && <RowItem label="Wind Chill" value={convertTemp(wc, tempUnit)} unit={tempLabel} sub="Apparent temp in wind"  highlight />}
      </div>
      <div className="hidden md:grid grid-cols-4 gap-3 mb-6">
        <Card label="Actual"     value={convertTemp(tempC,  tempUnit)} unit={tempLabel} />
        <Card label="Feels Like" value={convertTemp(feelsC, tempUnit)} unit={tempLabel} sub="Wind & humidity adjusted" />
        <Card label="Min Today"  value={convertTemp(minC,   tempUnit)} unit={tempLabel} />
        <Card label="Max Today"  value={convertTemp(maxC,   tempUnit)} unit={tempLabel} />
        {hi !== null && <Card label="Heat Index" value={convertTemp(hi, tempUnit)} unit={tempLabel} sub="Apparent temp in shade" highlight />}
        {wc !== null && <Card label="Wind Chill" value={convertTemp(wc, tempUnit)} unit={tempLabel} sub="Apparent temp in wind"  highlight />}
      </div>

      {/* ── 2. Heat Stress — always rows ── */}
      <SectionHeader icon="🔥" title="Heat Stress" />
      <RowStack>
        <RowItem label="Wet Bulb Temperature (OSHA standard)" value={convertTemp(wb, tempUnit)} unit={tempLabel} sub={`Site advisory: ${wbR.note}`} badge={wbR.label} badgeColor={wbR.color} />
        <RowItem label="Dew Point" value={dp} unit="°C" sub="Condensation forms on surfaces below this temp" />
        <RowItem label="Absolute Humidity" value={absH} unit="g/m³" sub="Actual water in air" />
        <RowItem label="Vapour Pressure Deficit" value={vpd} unit="kPa" sub={vpdDryingDesc(vpd)} highlight={vpd > 2 || vpd < 0.4} />
      </RowStack>

      {/* ── 3. Wind — always rows ── */}
      <SectionHeader icon="💨" title="Wind" />
      <RowStack>
        <RowItem label="Speed"     value={convertSpeed(windKmh, speedUnit)} unit={speedLabel} />
        <RowItem label="Gusts"     value={convertSpeed(gustKmh, speedUnit)} unit={speedLabel} highlight={gustKmh >= 35} sub={gustKmh >= 35 ? 'Secure all loose materials' : undefined} />
        <RowItem label="Direction" value={windDirection(windDeg)} unit={`${windDeg}°`} sub={`Coming from the ${windDirection(windDeg)}`} />
        <RowItem
          label="Beaufort Scale"
          value={`Force ${bf.level}`}
          sub={bf.level >= 6 ? 'Outdoor work at risk — secure all materials immediately' : bf.level >= 4 ? 'Monitor conditions, secure loose items' : 'Safe for normal operations'}
          badge={bf.desc}
          badgeColor={bf.level >= 6 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : bf.level >= 4 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}
        />
      </RowStack>

      {/* ── 4. Atmosphere — always rows ── */}
      <SectionHeader icon="🌫️" title="Atmosphere" />
      <RowStack>
        <RowItem label="Humidity"   value={humidity} unit="%" sub={humidity > 80 ? 'High — increased slip & corrosion risk' : 'Normal'} highlight={humidity > 80} />
        <RowItem label="Visibility" value={(visibility / 1000).toFixed(1)} unit="km" sub={visibilityDesc(visibility)} highlight={visibility < 2000} />
        <RowItem label="Cloud Cover" value={cloudPct} unit="%" />
        <RowItem
          label="Atmospheric Pressure"
          value={pressure} unit="hPa"
          sub={`${pres.desc}${seaLevel !== pressure ? ` · Sea level: ${seaLevel} hPa` : ''}${groundLevel ? ` · Ground level: ${groundLevel} hPa` : ''}`}
          badge={`${pres.label} pressure`}
          badgeColor={`${pres.color} bg-slate-100 dark:bg-slate-700`}
        />
      </RowStack>

      {/* ── 5. Precipitation — rows on mobile, 3-col grid on desktop ── */}
      <SectionHeader icon="🌧️" title="Precipitation" />
      <div className="flex flex-col gap-2 mb-6 md:hidden">
        <RowItem label="Rain (last 1h)" value={rainMm1h.toFixed(1)} unit="mm" highlight={rainMm1h >= 10} sub={rainMm1h >= 10 ? 'Heavy — stop outdoor work' : rainMm1h >= 5 ? 'Moderate — take precautions' : rainMm1h > 0 ? 'Light' : 'None'} />
        <RowItem label="Rain (last 3h)" value={rainMm3h.toFixed(1)} unit="mm" sub="3-hour accumulation" />
        <RowItem label="Snowfall (1h)"  value={snowMm.toFixed(1)}   unit="mm" highlight={snowMm > 0} sub={snowMm > 0 ? 'Ice risk on all surfaces' : 'None'} />
      </div>
      <div className="hidden md:grid grid-cols-3 gap-3 mb-6">
        <Card label="Rain (last 1h)" value={rainMm1h.toFixed(1)} unit="mm" highlight={rainMm1h >= 10} sub={rainMm1h >= 10 ? 'Heavy — stop outdoor work' : rainMm1h >= 5 ? 'Moderate — take precautions' : rainMm1h > 0 ? 'Light' : 'None'} />
        <Card label="Rain (last 3h)" value={rainMm3h.toFixed(1)} unit="mm" sub="3-hour accumulation" />
        <Card label="Snowfall (1h)"  value={snowMm.toFixed(1)}   unit="mm" highlight={snowMm > 0} sub={snowMm > 0 ? 'Ice risk on all surfaces' : 'None'} />
      </div>

      {/* ── 6. UV — always rows ── */}
      <SectionHeader icon="☀️" title="UV Index" />
      <RowStack>
        {uvLoading
          ? <RowItem label="UV Index" value="—" sub="Loading..." />
          : uv
            ? <RowItem label="UV Index" value={uvIndex.toFixed(1)} sub={`Site advisory: ${uv.site}`} badge={uv.label} badgeColor={uv.color} />
            : <RowItem label="UV Index" value="—" sub="Unavailable" />
        }
      </RowStack>

      {/* ── 7. Air Quality ── */}
      <SectionHeader icon="💨" title="Air Quality" />
      {aqiD ? (
        <>
          <RowStack>
            <RowItem label="Air Quality Index (AQI)" value={`Level ${aqi}`} sub={`PPE advisory: ${aqiD.ppe}`} badge={aqiD.label} badgeColor={aqiD.color} />
          </RowStack>
          {aqiComponents && (
            <>
              {/* Mobile: rows */}
              <div className="flex flex-col gap-2 mb-6 md:hidden">
                <RowItem label="PM2.5"    value={aqiComponents.pm2_5?.toFixed(1)} unit="μg/m³" sub="Fine particles — lung penetration risk"  highlight={aqiComponents.pm2_5 > 25} />
                <RowItem label="PM10"     value={aqiComponents.pm10?.toFixed(1)}  unit="μg/m³" sub="Coarse particles — dust on site"          highlight={aqiComponents.pm10 > 50} />
                <RowItem label="NO₂"      value={aqiComponents.no2?.toFixed(1)}   unit="μg/m³" sub="Vehicle & machinery exhaust" />
                <RowItem label="O₃ Ozone" value={aqiComponents.o3?.toFixed(1)}    unit="μg/m³" sub="Elevated in heat & sunlight" />
                <RowItem label="CO"       value={aqiComponents.co?.toFixed(0)}     unit="μg/m³" sub="Carbon monoxide — generator risk"         highlight={aqiComponents.co > 4000} />
                <RowItem label="SO₂"      value={aqiComponents.so2?.toFixed(1)}    unit="μg/m³" sub="Sulphur dioxide" />
              </div>
              {/* Desktop: 3-col grid */}
              <div className="hidden md:grid grid-cols-3 gap-3 mb-6">
                <Card label="PM2.5"    value={aqiComponents.pm2_5?.toFixed(1)} unit="μg/m³" sub="Fine particles — lung penetration risk"  highlight={aqiComponents.pm2_5 > 25} />
                <Card label="PM10"     value={aqiComponents.pm10?.toFixed(1)}  unit="μg/m³" sub="Coarse particles — dust on site"          highlight={aqiComponents.pm10 > 50} />
                <Card label="NO₂"      value={aqiComponents.no2?.toFixed(1)}   unit="μg/m³" sub="Vehicle & machinery exhaust" />
                <Card label="O₃ Ozone" value={aqiComponents.o3?.toFixed(1)}    unit="μg/m³" sub="Elevated in heat & sunlight" />
                <Card label="CO"       value={aqiComponents.co?.toFixed(0)}     unit="μg/m³" sub="Carbon monoxide — generator risk"         highlight={aqiComponents.co > 4000} />
                <Card label="SO₂"      value={aqiComponents.so2?.toFixed(1)}    unit="μg/m³" sub="Sulphur dioxide" />
              </div>
            </>
          )}
        </>
      ) : (
        <RowStack><RowItem label="Air Quality" value="—" sub="Loading..." /></RowStack>
      )}

      {/* ── 8. Daylight — rows on mobile | desktop: row1={2+2+2} row2={3+3} ── */}
      <SectionHeader icon="🌅" title="Daylight & Working Hours" />
      {/* Mobile: rows */}
      <div className="flex flex-col gap-2 mb-6 md:hidden">
        <RowItem label="Sunrise"                value={sunriseStr} />
        <RowItem label="Sunset"                 value={sunsetStr} />
        <RowItem label="Total Daylight"         value={daylightStr} sub="Available natural light" />
        <RowItem
          label="Working Light Remaining"
          value={workingLight}
          highlight={minsToSunset !== null && minsToSunset < 60}
          sub={minsToSunset !== null && minsToSunset < 60 ? 'Less than 1 hour of daylight left' : undefined}
        />
        <RowItem label="Last Data Update" value={lastUpdated} sub="OpenWeather station reading" />
      </div>
      {/* Desktop: 2-row layout */}
      <div className="hidden md:block mb-6">
        <div className="grid grid-cols-6 gap-3 mb-3">
          <div className="col-span-2"><Card label="Sunrise"        value={sunriseStr} /></div>
          <div className="col-span-2"><Card label="Sunset"         value={sunsetStr} /></div>
          <div className="col-span-2"><Card label="Total Daylight" value={daylightStr} sub="Available natural light" /></div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-3">
            <Card
              label="Working Light Remaining"
              value={workingLight}
              highlight={minsToSunset !== null && minsToSunset < 60}
              sub={minsToSunset !== null && minsToSunset < 60 ? 'Less than 1 hour of daylight left' : undefined}
            />
          </div>
          <div className="col-span-3"><Card label="Last Data Update" value={lastUpdated} sub="OpenWeather station reading" /></div>
        </div>
      </div>

    </div>
  );
};

export default WeatherReport;