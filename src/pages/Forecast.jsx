/**
 * Forecast.jsx
 * Page for displaying detailed weather forecast
 */
const Forecast = ({ forecast, loading, error }) => {
  if (loading) {
    return <div className="p-4 text-slate-600">Loading forecast...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!forecast?.length) {
    return <div className="p-4 text-slate-600">No forecast data available.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">5-Day Forecast</h1>
      {forecast.map((item) => (
        <div key={`${item.day}-${item.dateLabel}`} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{item.dateLabel}</p>
              <h3 className="font-bold text-slate-800">{item.day}</h3>
              <p className="text-sm text-slate-500">{item.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl">{item.icon}</p>
              <p className="text-xl font-bold text-slate-800">{item.temp}°C</p>
              <p className="text-xs text-slate-500">Wind {item.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forecast;