
export type Page = 'dashboard' | 'chatbot' | 'disease-detection' | 'weather' | 'crop-recommendations' | 'market-prices' | 'price-trends' | 'live-location' | 'community' | 'crop-calendar';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface WeatherDay {
  day: string;
  highTemp: string;
  lowTemp: string;
  precipitation: string;
  condition: string;
  humidity: string;
}

export interface Crop {
  cropName: string;
  reason: string;
  plantingGuide: string;
}

export interface MarketPrice {
  cropName: string;
  location: string;
  price: number;
  currency: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'stable';
  photoUrl?: string;
}

export interface DiseaseAnalysis {
  diseaseName: string;
  treatment: string;
  prevention: string;
}

export interface PriceTrendDataPoint {
  date: string;
  price: number;
}

export interface PriceTrendAnalysis {
  trendData: PriceTrendDataPoint[];
  summary: string;
}

export type CropCalendarEventCategory = 'Planting' | 'Irrigation' | 'Fertilization' | 'Pest Control' | 'General Care' | 'Harvesting';

export interface CropCalendarEvent {
  date: string; // YYYY-MM-DD
  eventName: string;
  description: string;
  category: CropCalendarEventCategory;
}

export interface TotalCropCareGuide {
  cropName: string;
  idealClimate: string;
  soilPreparation: string;
  wateringSchedule: string;
  fertilizationPlan: string;
  commonPestsAndDiseases: string;
  harvestingTips: string;
}