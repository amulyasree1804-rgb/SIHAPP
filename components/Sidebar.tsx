
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, ChatIcon, LeafIcon, UsersIcon, WeatherIcon, SeedlingIcon, ChartIcon, LocationIcon, PhoneIcon, TrendingUpIcon, CalendarIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import LanguageSwitcher from './LanguageSwitcher';


interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onOpenSmsModal: () => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  icon: React.ReactNode;
  currentPage: Page;
  onClick: (page: Page) => void;
}> = ({ page, label, icon, currentPage, onClick }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => onClick(page)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-lg'
          : 'text-gray-600 hover:bg-green-100 hover:text-green-800'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onOpenSmsModal }) => {
  const { t } = useTranslations();
  
  return (
    <aside className="w-64 bg-white p-4 flex-shrink-0 shadow-lg hidden md:block flex flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-primary p-2 rounded-full">
            <LeafIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold ml-3 text-primary-dark">{t('sidebar_title')}</h1>
      </div>
      <nav className="space-y-2 flex-grow">
        <NavItem
          page="dashboard"
          label={t('sidebar_dashboard')}
          icon={<DashboardIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="chatbot"
          label={t('sidebar_ai_assistant')}
          icon={<ChatIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="disease-detection"
          label={t('sidebar_disease_detection')}
          icon={<LeafIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="crop-calendar"
          label={t('sidebar_crop_calendar')}
          icon={<CalendarIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="weather"
          label={t('sidebar_weather')}
          icon={<WeatherIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="crop-recommendations"
          label={t('sidebar_crop_recommendations')}
          icon={<SeedlingIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="market-prices"
          label={t('sidebar_market_prices')}
          icon={<ChartIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="price-trends"
          label={t('sidebar_price_trends')}
          icon={<TrendingUpIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="live-location"
          label={t('sidebar_live_location')}
          icon={<LocationIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          page="community"
          label={t('sidebar_community')}
          icon={<UsersIcon />}
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
      </nav>
      <div className="mt-4">
        <LanguageSwitcher />
        <button 
            onClick={onOpenSmsModal}
            className="w-full p-4 bg-green-50 border border-green-200 rounded-lg text-center mt-4 hover:bg-green-100 transition-colors"
        >
            <div className="flex items-center justify-center">
                <PhoneIcon className="w-6 h-6 text-primary-dark"/>
                <h3 className="font-bold text-green-800 ml-2">{t('sidebar_helpline_title')}</h3>
            </div>
            <p className="text-sm text-green-700 mt-1">{t('sidebar_helpline_prompt')}</p>
            <p className="text-base font-bold text-primary-dark mt-2">{t('sidebar_helpline_number')}</p>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;