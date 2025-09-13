
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';


const CommunityHub: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div>
      <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-dark-text">{t('community_title')}</h1>
        <p className="mt-2 text-light-text">
          {t('community_subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Farmer Forums */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Farmer Forums</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-primary-dark">Best practices for paddy cultivation in low rainfall?</h3>
              <p className="text-sm text-gray-500 mt-1">Posted by Ramesh Kumar • 5 replies</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-primary-dark">Organic pest control for tomato plants</h3>
              <p className="text-sm text-gray-500 mt-1">Posted by Sunita Devi • 12 replies</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-primary-dark">Questions about the new PM-KISAN update</h3>
              <p className="text-sm text-gray-500 mt-1">Posted by Vikram Singh • 8 replies</p>
            </div>
            <button className="mt-4 w-full text-primary font-semibold py-2">View All Discussions</button>
          </div>
        </div>

        {/* Expert Connect */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Expert Connect</h2>
          <p className="text-sm text-gray-600 mb-4">Read articles from our agricultural experts or schedule a consultation.</p>
          <div className="space-y-3">
            <div className="text-sm">
                <p className="font-semibold text-gray-700">Soil Health Management</p>
                <p className="text-xs text-gray-500">By Dr. Anjali Sharma</p>
            </div>
             <div className="text-sm">
                <p className="font-semibold text-gray-700">Maximizing Wheat Yields</p>
                <p className="text-xs text-gray-500">By Prof. Raj Patel</p>
            </div>
          </div>
           <button className="mt-6 w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">
            Schedule a Call
          </button>
        </div>
      </div>
       
      <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Farmer Success Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
                <img src="https://picsum.photos/80" alt="Farmer" className="w-20 h-20 rounded-full object-cover"/>
                <div>
                    <p className="font-semibold">"AgriNova's disease detection saved my cotton crop!"</p>
                    <p className="text-sm text-gray-500">- Hardeep S., Punjab</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <img src="https://picsum.photos/81" alt="Farmer" className="w-20 h-20 rounded-full object-cover"/>
                <div>
                    <p className="font-semibold">"The market price alerts helped me get 20% more for my produce."</p>
                    <p className="text-sm text-gray-500">- Lakshmi M., Andhra Pradesh</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;