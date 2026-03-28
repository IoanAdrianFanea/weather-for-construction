const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_OPENWEATHER_API_KEY in .env");
  return apiKey;
};

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${OPENWEATHER_BASE_URL}/${endpoint}`);
  const searchParams = new URLSearchParams({
    appid: getApiKey(),
    units: "metric",
    ...params,
  });
  url.search = searchParams.toString();
  return url.toString();
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const message =
      response.status === 401
        ? "OpenWeather API key is invalid or not activated yet. Verify VITE_OPENWEATHER_API_KEY and wait a few minutes after creating a new key."
        : data?.message || "Failed to fetch weather data";
    throw new Error(message);
  }

  return data;
};

export const weatherToEmoji = (condition) => {
  const main = condition?.toLowerCase();
  if (main?.includes("thunder")) return "⚡";
  if (main?.includes("rain") || main?.includes("drizzle")) return "🌧️";
  if (main?.includes("snow")) return "❄️";
  if (main?.includes("cloud")) return "☁️";
  if (main?.includes("mist") || main?.includes("fog")) return "🌫️";
  return "☀️";
};

export const buildFiveDayForecast = (forecastList = []) => {
  const grouped = new Map();

  forecastList.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const dayKey = date.toISOString().split("T")[0];
    if (!grouped.has(dayKey)) grouped.set(dayKey, []);
    grouped.get(dayKey).push(entry);
  });

  return Array.from(grouped.values())
    .slice(0, 5)
    .map((entries) => {
      const best =
        entries.find((item) => item.dt_txt?.includes("12:00:00")) || entries[0];
      const date = new Date(best.dt * 1000);

      const hourly = entries.map((entry) => {
        const t = new Date(entry.dt * 1000);
        return {
          hour: t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          temp: Math.round(entry.main.temp),
          feels: Math.round(entry.main.feels_like),
          condition: entry.weather?.[0]?.main || "Clear",
          icon: weatherToEmoji(entry.weather?.[0]?.main),
          windSpeed: Math.round((entry.wind?.speed || 0) * 3.6),
          humidity: entry.main.humidity,
          rain: entry.rain?.["3h"] || 0,
        };
      });

      return {
        day: date.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase(),
        dateLabel: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        temp: Math.round(best.main.temp),
        condition: best.weather?.[0]?.main || "Clear",
        icon: weatherToEmoji(best.weather?.[0]?.main),
        windSpeed: Math.round((best.wind?.speed || 0) * 3.6),
        hourly,
      };
    });
};

export const getWeatherByCity = async (city) => {
  const [current, forecast] = await Promise.all([
    fetchJson(buildUrl("weather", { q: city })),
    fetchJson(buildUrl("forecast", { q: city })),
  ]);

  return {
    current,
    forecast,
  };
};