
import React, { useState } from 'react';
import { getPriceTrends } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import { PriceTrendAnalysis, PriceTrendDataPoint } from '../types';

// Helper to generate dynamic demo data for the last 30 days
const generateLast30DaysData = (startPrice: number, volatility: number): PriceTrendDataPoint[] => {
    const data: PriceTrendDataPoint[] = [];
    let currentPrice = startPrice;
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const change = (Math.random() - 0.48) * volatility; // Skew slightly upwards
        currentPrice = Math.max(startPrice - (volatility * 1.5), currentPrice + change);
        data.push({
            date: date.toISOString().split('T')[0], // YYYY-MM-DD
            price: parseFloat(currentPrice.toFixed(2))
        });
    }
    return data;
}

const demoPriceTrendData: PriceTrendAnalysis = {
  trendData: generateLast30DaysData(24, 2.5),
  summary: "This is a demonstration of price trends. Tomato prices in Nashik showed slight volatility over the past month, starting around ₹22, dipping mid-month, and recovering to near ₹26 due to seasonal demand changes."
};


const PriceChart: React.FC<{ data: PriceTrendDataPoint[] }> = ({ data }) => {
    if (!data || data.length < 2) {
        return <div className="text-center text-gray-500">Not enough data to display a chart.</div>;
    }

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Add 10% padding to min and max for better visualization
    const yMin = Math.max(0, minPrice - priceRange * 0.1);
    const yMax = maxPrice + priceRange * 0.1;

    const getX = (index: number) => (index / (data.length - 1)) * chartWidth;
    const getY = (price: number) => chartHeight - ((price - yMin) / (yMax - yMin)) * chartHeight;

    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.price)}`).join(' ');

    const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
        const value = yMin + (i * (yMax - yMin)) / 4;
        return { value: Math.round(value), y: getY(value) };
    });

    const xAxisLabels = [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Y-axis grid lines and labels */}
                {yAxisLabels.map(({ value, y }) => (
                    <g key={value} className="text-gray-400">
                        <line x1="0" x2={chartWidth} y1={y} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                        <text x="-10" y={y + 3} textAnchor="end" className="text-xs fill-current">{value}</text>
                    </g>
                ))}
                
                {/* X-axis labels */}
                 {xAxisLabels.map((d, i) => {
                    let index = 0;
                    if (i === 1) index = Math.floor(data.length / 2);
                    if (i === 2) index = data.length - 1;
                    return (
                        <text key={i} x={getX(index)} y={chartHeight + 20} textAnchor="middle" className="text-xs fill-current text-gray-500">
                            {new Date(d.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric'})}
                        </text>
                    );
                 })}

                {/* Line path */}
                <path d={pathData} className="stroke-primary" fill="none" strokeWidth="2" />

                {/* Data points */}
                {data.map((d, i) => (
                    <circle key={i} cx={getX(i)} cy={getY(d.price)} r="3" className="fill-primary-dark" />
                ))}
            </g>
        </svg>
    );
};

const PriceTrends: React.FC = () => {
    const { t } = useTranslations();
    const [crop, setCrop] = useState('');
    const [location, setLocation] = useState('');
    const [trendResult, setTrendResult] = useState<PriceTrendAnalysis | null>(demoPriceTrendData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSearchResult, setIsSearchResult] = useState(false);
    const [displayCrop, setDisplayCrop] = useState('Tomato');
    const [displayLocation, setDisplayLocation] = useState('Nashik');

    const handleGetTrends = async () => {
        if (!crop || !location) return;
        setIsLoading(true);
        setError('');
        setTrendResult(null);
        try {
            const result = await getPriceTrends(crop, location);
            setTrendResult(result);
            setIsSearchResult(true);
            setDisplayCrop(crop);
            setDisplayLocation(location);
        } catch (e) {
            setError('Failed to fetch price trends. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleShowDemo = () => {
        setTrendResult(demoPriceTrendData);
        setIsSearchResult(false);
        setCrop('');
        setLocation('');
        setError('');
        setDisplayCrop('Tomato');
        setDisplayLocation('Nashik');
    };

    return (
        <div>
            <header className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h1 className="text-3xl font-bold text-dark-text">{t('trends_title')}</h1>
                <p className="mt-2 text-light-text">{t('trends_subtitle')}</p>
            </header>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h2 className="text-xl font-bold text-dark-text mb-4">{t('trends_form_title')}</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={crop}
                            onChange={e => setCrop(e.target.value)}
                            placeholder={t('trends_form_crop_placeholder')}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                        />
                        <input
                            type="text"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder={t('trends_form_location_placeholder')}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        <button
                            onClick={handleGetTrends}
                            disabled={isLoading || !crop || !location}
                            className="flex-grow w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
                        >
                            {isLoading ? t('trends_form_loading_button') : t('trends_form_button')}
                        </button>
                        {isSearchResult && (
                             <button onClick={handleShowDemo} className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                Show Demo
                             </button>
                        )}
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center h-full p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                )}
                {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
                
                {trendResult && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold text-dark-text">30-Day Price Trend for {displayCrop} in {displayLocation}</h3>
                        <PriceChart data={trendResult.trendData} />
                        <div className="mt-4">
                            <h4 className="font-bold text-primary-dark">{t('trends_summary_title')}</h4>
                            <p className="text-sm text-light-text mt-1">{trendResult.summary}</p>
                        </div>
                    </div>
                )}

                {!isLoading && !trendResult && !error && (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                        <p>{t('trends_results_placeholder')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceTrends;