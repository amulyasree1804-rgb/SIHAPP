
import React, { useState } from 'react';
import { getWeatherForecast } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import { WeatherDay } from '../types';


const Weather: React.FC = () => {
  const { t } = useTranslations();
  const [location, setLocation] = useState('');
  const [weatherResult, setWeatherResult] = useState<WeatherDay[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetWeather = async () => {
    if (!location) return;
    setIsLoading(true);
    setError('');
    setWeatherResult(null);
    try {
      const result = await getWeatherForecast(location);
      setWeatherResult(result);
    } catch (e) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('weather_title')}</h1>
        <p className="mt-2 text-light-text">
          {t('weather_subtitle')}
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-bold text-dark-text mb-4">{t('weather_form_title')}</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder={t('weather_form_placeholder')}
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light" 
            />
            <button 
              onClick={handleGetWeather} 
              disabled={isLoading || !location} 
              className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? t('weather_form_loading_button') : t('weather_form_button')}
            </button>
          </div>
        </div>

        {isLoading && (
            <div className="flex justify-center items-center h-full p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )}
        {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
        {weatherResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weatherResult.map((day, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <h3 className="font-bold text-dark-text">{day.day}</h3>
                <p className="text-sm text-light-text">{day.condition}</p>
                <div className="my-2">
                    <p className="text-2xl font-bold text-primary-dark">{day.highTemp}</p>
                    <p className="text-md text-light-text">{day.lowTemp}</p>
                </div>
                <div className="text-xs space-y-1 text-gray-600">
                    <p>💧 {day.precipitation}</p>
                    <p>💧 {day.humidity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;