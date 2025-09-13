
import React from 'react';
import { Page } from '../types';
import { ChatIcon, LeafIcon, WeatherIcon, SeedlingIcon, ChartIcon, LocationIcon, TrendingUpIcon, CalendarIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';


interface DashboardProps {
  setActivePage: (page: Page) => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  page: Page;
  onClick: (page: Page) => void;
}> = ({ icon, title, description, page, onClick }) => (
  <button
    onClick={() => onClick(page)}
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left w-full"
  >
    <div className="flex items-center">
      <div className="p-3 bg-green-100 rounded-full">{icon}</div>
      <h3 className="ml-4 text-xl font-bold text-dark-text">{title}</h3>
    </div>
    <p className="mt-4 text-light-text">{description}</p>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const { t } = useTranslations();

  return (
    <div className="fade-in">
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('dashboard_title')}</h1>
        <p className="mt-2 text-light-text">
          {t('dashboard_subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<ChatIcon className="text-primary" />}
          title={t('dashboard_card_ai_title')}
          description={t('dashboard_card_ai_desc')}
          page="chatbot"
          onClick={setActivePage}
        />
        <FeatureCard
          icon={<LeafIcon className="text-primary" />}
          title={t('dashboard_card_disease_title')}
          description={t('dashboard_card_disease_desc')}
          page="disease-detection"
          onClick={setActivePage}
        />
         <FeatureCard
          icon={<CalendarIcon className="text-primary" />}
          title={t('dashboard_card_calendar_title')}
          description={t('dashboard_card_calendar_desc')}
          page="crop-calendar"
          onClick={setActivePage}
        />
         <FeatureCard
          icon={<WeatherIcon className="text-primary" />}
          title={t('dashboard_card_weather_title')}
          description={t('dashboard_card_weather_desc')}
          page="weather"
          onClick={setActivePage}
        />
        <FeatureCard
          icon={<SeedlingIcon className="text-primary" />}
          title={t('dashboard_card_crop_title')}
          description={t('dashboard_card_crop_desc')}
          page="crop-recommendations"
          onClick={setActivePage}
        />
        <FeatureCard
          icon={<ChartIcon className="text-primary" />}
          title={t('dashboard_card_market_title')}
          description={t('dashboard_card_market_desc')}
          page="market-prices"
          onClick={setActivePage}
        />
        <FeatureCard
          icon={<TrendingUpIcon className="text-primary" />}
          title={t('dashboard_card_trends_title')}
          description={t('dashboard_card_trends_desc')}
          page="price-trends"
          onClick={setActivePage}
        />
        <FeatureCard
          icon={<LocationIcon className="text-primary" />}
          title={t('dashboard_card_location_title')}
          description={t('dashboard_card_location_desc')}
          page="live-location"
          onClick={setActivePage}
        />
      </div>

       <footer className="mt-8 text-center text-sm text-gray-500">
        <p>{t('dashboard_footer_empowering')}</p>
        <p className="mt-1">{t('dashboard_footer_copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
};

export default Dashboard;