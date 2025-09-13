
import React, { useState } from 'react';
import { getMarketPrices } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import { MarketPrice } from '../types';
import { ArrowUpIcon, ArrowDownIcon, SeedlingIcon } from './icons';

const demoMarketData: MarketPrice[] = [
  {
    cropName: 'Tomato',
    location: 'Nashik, Maharashtra',
    price: 25,
    currency: '₹',
    trend: 'Prices have risen by 8% in the last week due to increased demand.',
    trendDirection: 'up',
    photoUrl: 'https://source.unsplash.com/400x300/?ripe,tomatoes',
  },
  {
    cropName: 'Wheat',
    location: 'Ludhiana, Punjab',
    price: 21,
    currency: '₹',
    trend: 'Stable prices due to consistent government procurement and good harvest.',
    trendDirection: 'stable',
    photoUrl: 'https://source.unsplash.com/400x300/?wheat,field,harvest',
  },
  {
    cropName: 'Onion',
    location: 'Lasalgaon, Maharashtra',
    price: 18,
    currency: '₹',
    trend: 'Prices have dipped slightly as new stock arrives in the market.',
    trendDirection: 'down',
    photoUrl: 'https://source.unsplash.com/400x300/?onions,harvest',
  },
  {
    cropName: 'Soybean',
    location: 'Indore, Madhya Pradesh',
    price: 45,
    currency: '₹',
    trend: 'Strong demand from processing plants has kept prices firm.',
    trendDirection: 'stable',
    photoUrl: 'https://source.unsplash.com/400x300/?soybean,plant',
  },
  {
    cropName: 'Cotton',
    location: 'Guntur, Andhra Pradesh',
    price: 72,
    currency: '₹',
    trend: 'Export demand has pushed prices up significantly over the past month.',
    trendDirection: 'up',
    photoUrl: 'https://source.unsplash.com/400x300/?cotton,boll,plant',
  },
   {
    cropName: 'Basmati Rice',
    location: 'Karnal, Haryana',
    price: 38,
    currency: '₹',
    trend: 'Prices are down slightly post-harvest as market supply increases.',
    trendDirection: 'down',
    photoUrl: 'https://source.unsplash.com/400x300/?rice,paddy,field',
  },
  {
    cropName: 'Potato',
    location: 'Agra, Uttar Pradesh',
    price: 15,
    currency: '₹',
    trend: 'Prices are stable with good supply from cold storage.',
    trendDirection: 'stable',
    photoUrl: 'https://source.unsplash.com/400x300/?potatoes,harvest',
  },
  {
    cropName: 'Sugarcane',
    location: 'Kolhapur, Maharashtra',
    price: 3.10,
    currency: '₹',
    trend: 'Prices are up due to demand from sugar mills.',
    trendDirection: 'up',
    photoUrl: 'https://source.unsplash.com/400x300/?sugarcane,field',
  },
];

const TrendIndicator: React.FC<{ direction: 'up' | 'down' | 'stable' }> = ({ direction }) => {
  if (direction === 'up') {
    return <span className="flex items-center text-sm text-green-600"><ArrowUpIcon className="w-4 h-4 mr-1" /> Up</span>;
  }
  if (direction === 'down') {
    return <span className="flex items-center text-sm text-red-600"><ArrowDownIcon className="w-4 h-4 mr-1" /> Down</span>;
  }
  return <span className="flex items-center text-sm text-gray-500">- Stable</span>;
};


const MarketPriceCard: React.FC<{ item: MarketPrice }> = ({ item }) => {
  const { t } = useTranslations();
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      {item.photoUrl ? (
        <img className="h-48 w-full object-cover" src={item.photoUrl} alt={item.cropName} />
      ) : (
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
          <SeedlingIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="uppercase tracking-wide text-sm text-primary font-semibold">{item.cropName}</div>
            <p className="block mt-1 text-lg leading-tight font-medium text-black">{`${t('currency_symbol')}${item.price} / kg`}</p>
          </div>
          <TrendIndicator direction={item.trendDirection} />
        </div>
        <p className="text-sm text-gray-500 mt-2">{item.location}</p>
        <p className="mt-4 text-gray-600 text-sm">{item.trend}</p>
      </div>
    </div>
  );
};


const MarketPrices: React.FC = () => {
  const { t } = useTranslations();
  const [marketCrop, setMarketCrop] = useState('');
  const [marketLocation, setMarketLocation] = useState('');
  const [marketResults, setMarketResults] = useState<MarketPrice[]>(demoMarketData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearchResult, setIsSearchResult] = useState(false);

  const handleGetPrices = async () => {
    if (!marketCrop || !marketLocation) return;
    setIsLoading(true);
    setError('');
    setMarketResults([]);
    try {
      const result = await getMarketPrices(marketCrop, marketLocation);
      setMarketResults([result]);
      setIsSearchResult(true);
    } catch(e) {
      setError('Failed to fetch market prices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShowAll = () => {
    setMarketResults(demoMarketData);
    setIsSearchResult(false);
    setMarketCrop('');
    setMarketLocation('');
    setError('');
  };

  return (
    <div>
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('market_title')}</h1>
        <p className="mt-2 text-light-text">
          {t('market_subtitle')}
        </p>
      </header>
       <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
           <h2 className="text-xl font-bold text-dark-text mb-4">{t('market_form_title')}</h2>
           <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" value={marketCrop} onChange={e => setMarketCrop(e.target.value)} placeholder={t('market_form_crop_placeholder')} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light" />
            <input type="text" value={marketLocation} onChange={e => setMarketLocation(e.target.value)} placeholder={t('market_form_location_placeholder')} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light" />
           </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
             <button onClick={handleGetPrices} disabled={isLoading || !marketCrop || !marketLocation} className="flex-grow w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors">
              {isLoading ? t('market_form_loading_button') : t('market_form_button')}
             </button>
             {isSearchResult && (
                <button onClick={handleShowAll} className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                    Show All
                </button>
             )}
          </div>
        </div>

        <div>
            {isLoading && (
                <div className="flex justify-center items-center h-full p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}
            {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketResults.map((item, index) => (
                <MarketPriceCard key={index} item={item} />
              ))}
            </div>

             {!isLoading && marketResults.length === 0 && !error && (
                <div className="text-center text-gray-500 mt-8 bg-white p-8 rounded-xl shadow-sm">
                    <p>{t('market_results_placeholder')}</p>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;