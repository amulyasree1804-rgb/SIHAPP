
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import DiseaseDetection from './components/DiseaseDetection';
import CommunityHub from './components/CommunityHub';
import Weather from './components/Weather';
import CropRecommendations from './components/CropRecommendations';
import MarketPrices from './components/MarketPrices';
import PriceTrends from './components/PriceTrends';
import LiveLocation from './components/LiveLocation';
import SMSModal from './components/SMSModal';
// Fix: Changed to a named import to resolve the module 'has no default export' error.
import { CropCalendar } from './components/CropCalendar';
import { LanguageProvider } from './context/LanguageContext';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setActivePage={setCurrentPage} />;
      case 'chatbot':
        return <Chatbot />;
      case 'disease-detection':
        return <DiseaseDetection />;
      case 'weather':
        return <Weather />;
      case 'crop-recommendations':
        return <CropRecommendations />;
      case 'market-prices':
        return <MarketPrices />;
      case 'price-trends':
        return <PriceTrends />;
      case 'live-location':
        return <LiveLocation />;
      case 'community':
        return <CommunityHub />;
      case 'crop-calendar':
        return <CropCalendar />;
      default:
        return <Dashboard setActivePage={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onOpenSmsModal={() => setIsSmsModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
        {isSmsModalOpen && <SMSModal onClose={() => setIsSmsModalOpen(false)} />}
      </div>
    </LanguageProvider>
  );
};

export default App;