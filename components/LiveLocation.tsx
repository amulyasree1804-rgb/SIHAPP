
import React, { useState } from 'react';
import { LocationIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';


interface Location {
    latitude: number;
    longitude: number;
}

const LiveLocation: React.FC = () => {
  const { t } = useTranslations();
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(`Error: ${err.message}. Please enable location services.`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getButtonText = () => {
    if (isLoading) return t('location_card_button_loading');
    if (location) return t('location_card_button_again');
    return t('location_card_button');
  }

  return (
    <div>
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('location_title')}</h1>
        <p className="mt-2 text-light-text">
          {t('location_subtitle')}
        </p>
      </header>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <LocationIcon className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-xl font-bold text-dark-text my-4">{t('location_card_title')}</h2>
          
          {isLoading && <p className="text-gray-500">{t('location_card_loading')}</p>}
          {error && <p className="text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
          {location && (
            <div className="text-lg bg-green-50 p-4 rounded-md border border-green-200">
              <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
            </div>
          )}

          <button
            onClick={handleGetLocation}
            disabled={isLoading}
            className="mt-6 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveLocation;