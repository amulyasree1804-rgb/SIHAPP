
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, WeatherDay, Crop, MarketPrice, DiseaseAnalysis, PriceTrendAnalysis, CropCalendarEvent, TotalCropCareGuide } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const languageMap: { [key: string]: string } = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
    mr: 'Marathi',
};

export const generateChatResponse = async (history: ChatMessage[], newMessage: string, language: string): Promise<string> => {
  try {
    const languageName = languageMap[language] || 'English';
    const systemInstruction = `You are AgriNova, a friendly and expert AI farming assistant. Your goal is to provide helpful, concise, and accurate information to farmers. ALWAYS respond in the user's specified language: ${languageName} (${language}). Do not switch languages.`;

    const chat = ai.chats.create({ 
        model: 'gemini-2.5-flash', 
        history: history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })),
        config: {
            systemInstruction: systemInstruction,
        }
    });
    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Sorry, I encountered an error. Please try again. If the problem persists, check your API key and network connection.";
  }
};

export const analyzeCropImage = async (base64Image: string, mimeType: string): Promise<DiseaseAnalysis> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };
    const textPart = {
      text: `You are an expert agricultural scientist. Analyze this image of a plant. Identify the primary disease, pest, or nutrient deficiency. Provide:
      1.  **diseaseName:** The common name of the issue.
      2.  **treatment:** A concise treatment plan, including organic and chemical options.
      3.  **prevention:** A set of prevention measures.
      Return the response in a structured JSON format.`
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                diseaseName: { type: Type.STRING },
                treatment: { type: Type.STRING },
                prevention: { type: Type.STRING },
              }
            }
        }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Sorry, I couldn't analyze the image. Please try again with a clear, well-lit photo.");
  }
};

export const getWeatherForecast = async (location: string): Promise<WeatherDay[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a 5-day weather forecast for ${location}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              highTemp: { type: Type.STRING },
              lowTemp: { type: Type.STRING },
              precipitation: { type: Type.STRING },
              condition: { type: Type.STRING },
              humidity: { type: Type.STRING },
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating weather forecast:", error);
    throw new Error("Could not fetch weather forecast.");
  }
};

export const getCropRecommendations = async (soilParams: { ph: string; n: string; p: string; k: string; location: string }): Promise<Crop[]> => {
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Based on the following soil parameters for a farm in ${soilParams.location} (pH: ${soilParams.ph}, Nitrogen: ${soilParams.n} ppm, Phosphorus: ${soilParams.p} ppm, Potassium: ${soilParams.k} ppm), recommend 3 suitable crops.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cropName: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  plantingGuide: { type: Type.STRING },
                }
              }
            }
          }
        });
        return JSON.parse(response.text);
      } catch (error) {
        console.error("Error generating crop recommendations:", error);
        throw new Error("Could not fetch crop recommendations.");
      }
};

export const getMarketPrices = async (crop: string, location: string): Promise<MarketPrice> => {
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `What is the current wholesale market price per kilogram (kg) for ${crop} in and around ${location}? Provide the price as a number and the currency symbol (e.g., ₹). Provide a summary of recent price trends, classify the trend as 'up', 'down', or 'stable', and include a publicly accessible URL for a relevant photo of the crop.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                cropName: { type: Type.STRING },
                location: { type: Type.STRING },
                price: { type: Type.NUMBER },
                currency: { type: Type.STRING },
                trend: { type: Type.STRING },
                trendDirection: { type: Type.STRING, enum: ['up', 'down', 'stable'] },
                photoUrl: { type: Type.STRING, description: 'A publicly accessible URL for a photo of the crop.' }
              }
            }
          }
        });
        return JSON.parse(response.text);
      } catch (error) {
        console.error("Error generating market prices:", error);
        throw new Error("Could not fetch market prices.");
      }
};

export const getPriceTrends = async (crop: string, location: string): Promise<PriceTrendAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a historical price trend analysis for ${crop} in the ${location} market for the last 30 days. The data should include daily prices per kilogram. Also, provide a brief summary of the overall trend.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trendData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
                  price: { type: Type.NUMBER, description: "Price per kg" }
                }
              }
            },
            summary: { type: Type.STRING, description: "A brief summary of the price trend." }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating price trends:", error);
    throw new Error("Could not fetch price trends.");
  }
};

export const getCropCalendar = async (crop: string, plantingDate: string): Promise<CropCalendarEvent[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a detailed day-by-day farming calendar for cultivating ${crop}, assuming the planting date is ${plantingDate}. Include key activities like soil preparation, irrigation schedules, fertilization (specifying types like NPK), pest and disease control measures, and estimated harvesting time. Provide a schedule for the entire lifecycle of the crop. For each event, provide a category from this exact list: 'Planting', 'Irrigation', 'Fertilization', 'Pest Control', 'General Care', 'Harvesting'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Date of the event in YYYY-MM-DD format" },
              eventName: { type: Type.STRING, description: "A concise name for the activity (e.g., 'First Irrigation', 'NPK Fertilization')" },
              description: { type: Type.STRING, description: "A detailed, actionable description of the task for the day." },
              category: { type: Type.STRING, description: "Category of the event.", enum: ['Planting', 'Irrigation', 'Fertilization', 'Pest Control', 'General Care', 'Harvesting'] }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating crop calendar:", error);
    throw new Error("Could not generate the crop calendar.");
  }
};

export const getTotalCropCareGuide = async (cropName: string): Promise<TotalCropCareGuide> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a comprehensive 'total care' guide for cultivating ${cropName}. Provide detailed information for the following sections: 'idealClimate', 'soilPreparation', 'wateringSchedule', 'fertilizationPlan', 'commonPestsAndDiseases', and 'harvestingTips'. Each section should contain practical, actionable advice for a farmer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            idealClimate: { type: Type.STRING },
            soilPreparation: { type: Type.STRING },
            wateringSchedule: { type: Type.STRING },
            fertilizationPlan: { type: Type.STRING },
            commonPestsAndDiseases: { type: Type.STRING },
            harvestingTips: { type: Type.STRING },
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating crop care guide:", error);
    throw new Error("Could not generate the crop care guide.");
  }
};