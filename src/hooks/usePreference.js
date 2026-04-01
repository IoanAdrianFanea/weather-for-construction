import { useState } from 'react';

const DEFAULTS = {
  defaultCity: 'London',
  theme: 'light',
  tempUnit: 'C',
  speedUnit: 'kmh',
  userSelectedDefaultCity: false,
  lastGeoCity: '',
};

const load = (key) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : DEFAULTS[key];
  } catch {
    return DEFAULTS[key];
  }
};

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const usePreferences = () => {
  const [defaultCity, setDefaultCityState] = useState(() => load('defaultCity'));
  const [theme, setThemeState] = useState(() => load('theme'));
  const [tempUnit, setTempUnitState] = useState(() => load('tempUnit'));
  const [speedUnit, setSpeedUnitState] = useState(() => load('speedUnit'));
  const [userSelectedDefaultCity, setUserSelectedDefaultCity] = useState(() => load('userSelectedDefaultCity'));
  const [lastGeoCity, setLastGeoCityState] = useState(() => load('lastGeoCity'));

  const setDefaultCity = (city) => {
    setDefaultCityState(city);
    save('defaultCity', city);
    setUserSelectedDefaultCity(true);
    save('userSelectedDefaultCity', true);
  };

  const setDefaultCityFromGeo = (city) => {
    setDefaultCityState(city);
    save('defaultCity', city);
    setLastGeoCityState(city);
    save('lastGeoCity', city);
  };

  const setLastGeoCity = (city) => {
    setLastGeoCityState(city);
    save('lastGeoCity', city);
  };

  const setTheme = (t) => {
    setThemeState(t);
    save('theme', t);
  };

  const setTempUnit = (unit) => {
    setTempUnitState(unit);
    save('tempUnit', unit);
  };

  const setSpeedUnit = (unit) => {
    setSpeedUnitState(unit);
    save('speedUnit', unit);
  };

  return {
    defaultCity,
    setDefaultCity,
    userSelectedDefaultCity,
    lastGeoCity,
    setDefaultCityFromGeo,
    setLastGeoCity,
    theme,
    setTheme,
    tempUnit,
    setTempUnit,
    speedUnit,
    setSpeedUnit,
  };
};