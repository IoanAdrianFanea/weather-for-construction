import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let permissionStatus;

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser. Using your default city instead.');
      return;
    }

    const handlePermissionChange = () => {
      window.location.reload();
    };

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          permissionStatus = status;
          permissionStatus.addEventListener('change', handlePermissionChange);
        })
        .catch(() => {
          // Permissions API might be unavailable or blocked; ignore and continue.
        });
    }

    const onSuccess = (position) => {
      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    };

    const onError = (err) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError('Location permission denied. Using your default city instead.');
          break;
        case err.POSITION_UNAVAILABLE:
          setError('Location unavailable. Using your default city instead.');
          break;
        case err.TIMEOUT:
          setError('Location request timed out. Using your default city instead.');
          break;
        default:
          setError('Unable to access location. Using your default city instead.');
      }
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    });

    return () => {
      if (permissionStatus?.removeEventListener) {
        permissionStatus.removeEventListener('change', handlePermissionChange);
      }
    };
  }, []);

  return { coords, error };
};
