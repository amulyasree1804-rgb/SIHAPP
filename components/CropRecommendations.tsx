
import React, { useState } from 'react';
import { getCropRecommendations } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import { Crop } from '../types';


const CropRecommendations: React.FC = () => {
  const { t } = useTranslations();
  const [soil, setSoil] = useState({ ph: '', n: '', p: '', k: '', location: '' });
  const [cropResult, setCropResult] = useState<Crop[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetCrops = async () => {
    if (!soil.ph || !soil.n || !soil.p || !soil.k || !soil.location) return;
    setIsLoading(true);
    setError('');
    setCropResult(null);
    try {
      const result = await getCropRecommendations(soil);
      setCropResult(result);
    } catch(e) {
      setError('Failed to fetch crop recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('crop_title')}</h1>
        <p className="mt-2 text-light-text">
          {t('crop_subtitle')}
        </p>
      </header>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-dark-text mb-4">{t('crop_form_title')}</h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={soil.location} onChange={e => setSoil({...soil, location: e.target.value})} placeholder={t('crop_form_location')} className="p-2 border rounded-md col-span-2 focus:outline-none focus:ring-2 focus:ring-primary-light" />
              <input type="number" value={soil.ph} onChange={e => setSoil({...soil, ph: e.target.value})} placeholder={t('crop_form_ph')} className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light" />
              <input type="number" value={soil.n} onChange={e => setSoil({...soil, n: e.target.value})} placeholder={t('crop_form_n')} className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light" />
              <input type="number" value={soil.p} onChange={e => setSoil({...soil, p: e.target.value})} placeholder={t('crop_form_p')} className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light" />
              <input type="number" value={soil.k} onChange={e => setSoil({...soil, k: e.target.value})} placeholder={t('crop_form_k')} className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light" />
            </div>
            <button onClick={handleGetCrops} disabled={isLoading || !Object.values(soil).every(v => v)} className="mt-3 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors">
              {isLoading ? t('crop_form_loading_button') : t('crop_form_button')}
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
            {isLoading && (
                 <div className="flex justify-center items-center h-full p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}
            {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
            {cropResult && (
                <div className="space-y-4">
                    {cropResult.map((crop, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold text-primary-dark">{crop.cropName}</h3>
                            <p className="mt-2 text-sm text-dark-text font-semibold">Why it's a good choice:</p>
                            <p className="text-sm text-light-text">{crop.reason}</p>
                            <p className="mt-3 text-sm text-dark-text font-semibold">Planting Guide:</p>
                            <p className="text-sm text-light-text whitespace-pre-wrap">{crop.plantingGuide}</p>
                        </div>
                    ))}
                </div>
            )}
             {!isLoading && !cropResult && !error && (
                <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500 h-full flex items-center justify-center">
                    <p>{t('crop_results_placeholder')}</p>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendations;