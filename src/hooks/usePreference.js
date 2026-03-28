import { useState } from 'react';

const DEFAULTS = {
  defaultCity: 'London',
  theme: 'light',
  tempUnit: 'C',
  speedUnit: 'kmh',
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

  const setDefaultCity = (city) => {
    setDefaultCityState(city);
    save('defaultCity', city);
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

  return { defaultCity, setDefaultCity, theme, setTheme, tempUnit, setTempUnit, speedUnit, setSpeedUnit };
};