
import React, { useState, useRef } from 'react';
import { analyzeCropImage } from '../services/geminiService';
import { LeafIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { DiseaseAnalysis } from '../types';


const DiseaseDetection: React.FC = () => {
  const { t } = useTranslations();
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // Limit file size to 4MB
          setError("File size exceeds 4MB. Please upload a smaller image.");
          return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis(null);

    const base64Image = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];

    try {
      const result = await analyzeCropImage(base64Image, mimeType);
      setAnalysis(result);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('disease_detection_title')}</h1>
        <p className="mt-2 text-light-text">
          {t('disease_detection_subtitle')}
        </p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('disease_detection_upload_title')}</h2>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            {image ? (
              <img src={image} alt="Crop preview" className="max-h-60 mx-auto rounded-lg"/>
            ) : (
              <div>
                <LeafIcon className="w-16 h-16 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">{t('disease_detection_upload_prompt')}</p>
                <p className="text-xs text-gray-400">{t('disease_detection_upload_specs')}</p>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            onClick={handleAnalyze}
            disabled={!image || isLoading}
            className="mt-4 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? t('disease_detection_analyzing_button') : t('disease_detection_analyze_button')}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('disease_detection_results_title')}</h2>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          {analysis ? (
             <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Disease Identified</h3>
                <p className="text-dark-text mt-1">{analysis.diseaseName}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Treatment / Cure</h3>
                <p className="text-light-text mt-1 whitespace-pre-wrap">{analysis.treatment}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Prevention Measures</h3>
                <p className="text-light-text mt-1 whitespace-pre-wrap">{analysis.prevention}</p>
              </div>
            </div>
          ) : (
            !isLoading && <p className="text-gray-500">{t('disease_detection_results_placeholder')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;