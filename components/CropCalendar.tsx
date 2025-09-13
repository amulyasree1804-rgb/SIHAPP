
import React, { useState, useMemo } from 'react';
import { getCropCalendar, getTotalCropCareGuide } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import { CropCalendarEvent, CropCalendarEventCategory, TotalCropCareGuide } from '../types';
import { WaterDropIcon, NutrientIcon, BugIcon, HarvestIcon, SpadeIcon, SeedlingIcon, SoilIcon, WeatherIcon } from './icons';

const categoryStyles: { [key in CropCalendarEventCategory]: { color: string; icon: React.ReactNode } } = {
  'Irrigation': { color: 'bg-blue-500', icon: <WaterDropIcon className="w-5 h-5 text-blue-600" /> },
  'Fertilization': { color: 'bg-yellow-500', icon: <NutrientIcon className="w-5 h-5 text-yellow-600" /> },
  'Pest Control': { color: 'bg-red-500', icon: <BugIcon className="w-5 h-5 text-red-600" /> },
  'Harvesting': { color: 'bg-purple-500', icon: <HarvestIcon className="w-5 h-5 text-purple-600" /> },
  'Planting': { color: 'bg-green-500', icon: <SeedlingIcon className="w-5 h-5 text-green-600" /> },
  'General Care': { color: 'bg-gray-500', icon: <SpadeIcon className="w-5 h-5 text-gray-600" /> },
};

const popularCrops = ['Tomato', 'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Potato'];

const CareGuideSection: React.FC<{icon: React.ReactNode, title: string, content: string}> = ({ icon, title, content }) => (
    <div className="flex items-start gap-4 p-4 border-b">
        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-dark-text">{title}</h4>
            <p className="text-sm text-light-text mt-1 whitespace-pre-wrap">{content}</p>
        </div>
    </div>
);

// Fix: Switched to a named export to resolve a 'no default export' error in the consuming component.
export const CropCalendar: React.FC = () => {
  const { t } = useTranslations();
  const [crop, setCrop] = useState('');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<CropCalendarEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewDate, setViewDate] = useState(new Date());

  const [careGuide, setCareGuide] = useState<TotalCropCareGuide | null>(null);
  const [isGuideLoading, setIsGuideLoading] = useState(false);
  const [guideError, setGuideError] = useState('');
  const [selectedGuideCrop, setSelectedGuideCrop] = useState<string | null>(null);

  const handleGenerateCalendar = async () => {
    if (!crop || !plantingDate) return;
    setIsLoading(true);
    setError('');
    setEvents(null);
    try {
      const result = await getCropCalendar(crop, plantingDate);
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(result);
      setViewDate(new Date(plantingDate + 'T00:00:00'));
    } catch (e) {
      setError('Failed to generate calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCareGuide = async (cropName: string) => {
    setCrop(cropName);
    setSelectedGuideCrop(cropName);
    setIsGuideLoading(true);
    setGuideError('');
    setCareGuide(null);
    try {
        const result = await getTotalCropCareGuide(cropName);
        setCareGuide(result);
    } catch (e) {
        setGuideError(t('crop_care_error'));
    } finally {
        setIsGuideLoading(false);
    }
  };

  const changeMonth = (offset: number) => {
    setViewDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: { day: number | null; key: string; categories: CropCalendarEventCategory[] }[] = Array.from({ length: firstDay }, (_, i) => ({ day: null, key: `empty-${i}`, categories: [] }));
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events?.filter(e => e.date === dateStr) || [];
        const categories = [...new Set(dayEvents.map(e => e.category))] as CropCalendarEventCategory[];
        days.push({ day, key: dateStr, categories });
    }
    return days;
  }, [viewDate, events]);

  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div>
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('calendar_title')}</h1>
        <p className="mt-2 text-light-text">{t('calendar_subtitle')}</p>
      </header>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-bold text-dark-text mb-4">{t('calendar_form_title')}</h2>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <input
              type="text"
              value={crop}
              onChange={e => setCrop(e.target.value)}
              placeholder={t('calendar_form_crop_placeholder')}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('calendar_form_date_label')}</label>
              <input
                type="date"
                value={plantingDate}
                onChange={e => setPlantingDate(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </div>
          </div>
          <button
            onClick={handleGenerateCalendar}
            disabled={isLoading || !crop || !plantingDate}
            className="mt-4 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? t('calendar_form_loading_button') : t('calendar_form_button')}
          </button>
        </div>

        {isLoading && (
            <div className="flex justify-center items-center h-full p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )}
        {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
        
        {events && (
            <div className="grid lg:grid-cols-5 gap-8 mt-8">
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-dark-text mb-4">{t('calendar_view_title')}</h3>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
                        <h4 className="font-semibold">{monthName}</h4>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500 pb-2 border-b">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mt-2">
                        {calendarData.map(d => (
                            <div key={d.key} className="h-12 flex justify-center items-center text-sm">
                                {d.day && (
                                    <div className="w-10 h-10 flex flex-col justify-center items-center rounded-full relative">
                                        <span>{d.day}</span>
                                        {d.categories.length > 0 && (
                                            <div className="absolute bottom-1 flex space-x-0.5">
                                                {d.categories.slice(0, 4).map(cat => (
                                                     <div key={cat} className={`w-1.5 h-1.5 ${categoryStyles[cat]?.color || 'bg-gray-400'} rounded-full`}></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-dark-text mb-4">{t('calendar_reminders_title')}</h3>
                    <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
                        {events.length > 0 ? events.map((event, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="mt-1">{categoryStyles[event.category]?.icon || <SpadeIcon className="w-5 h-5 text-gray-600"/>}</div>
                                <div>
                                    <p className="font-bold text-sm text-primary-dark">{new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                                    <p className="font-semibold text-dark-text text-sm">{event.eventName}</p>
                                    <p className="text-xs text-light-text mt-1">{event.description}</p>
                                </div>
                            </div>
                        )) : <p className="text-sm text-gray-500">No events found.</p>}
                    </div>
                </div>
            </div>
        )}

        <div className="mt-8">
            <h2 className="text-2xl font-bold text-dark-text">{t('crop_care_title')}</h2>
            <p className="mt-1 text-light-text">{t('crop_care_subtitle')}</p>
            <div className="flex gap-2 flex-wrap mt-4">
                {popularCrops.map(c => (
                    <button 
                        key={c}
                        onClick={() => handleGetCareGuide(c)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${selectedGuideCrop === c ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
            
            <div className="mt-6">
                {isGuideLoading && (
                    <div className="bg-white p-8 rounded-xl shadow-md text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-light-text">{t('crop_care_loading', { crop: selectedGuideCrop || '' })}</p>
                    </div>
                )}
                {guideError && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{guideError}</p>}
                {careGuide && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <CareGuideSection icon={<WeatherIcon className="text-blue-500"/>} title={t('care_guide_climate')} content={careGuide.idealClimate} />
                        <CareGuideSection icon={<SoilIcon className="text-yellow-700"/>} title={t('care_guide_soil')} content={careGuide.soilPreparation} />
                        <CareGuideSection icon={<WaterDropIcon className="text-cyan-500"/>} title={t('care_guide_watering')} content={careGuide.wateringSchedule} />
                        <CareGuideSection icon={<NutrientIcon className="text-orange-500"/>} title={t('care_guide_fertilization')} content={careGuide.fertilizationPlan} />
                        <CareGuideSection icon={<BugIcon className="text-red-500"/>} title={t('care_guide_pests')} content={careGuide.commonPestsAndDiseases} />
                        <CareGuideSection icon={<HarvestIcon className="text-purple-500"/>} title={t('care_guide_harvesting')} content={careGuide.harvestingTips} />
                    </div>
                )}
                {!isGuideLoading && !careGuide && !guideError && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                        <p>{t('crop_care_placeholder')}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};