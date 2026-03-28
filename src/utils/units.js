export const convertTemp = (c, unit) =>
  unit === 'F' ? Math.round((c * 9) / 5 + 32) : Math.round(c);

export const convertSpeed = (kmh, unit) =>
  unit === 'mph' ? Math.round(kmh * 0.621371) : Math.round(kmh);