import { GoogleGenAI, Type } from "@google/genai";
import { ComponentData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const componentSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The common name of the electronic component (e.g., '555 Timer IC')." },
    type: { type: Type.STRING, description: "The general category of the component (e.g., 'Integrated Circuit')." },
    specifications: {
      type: Type.ARRAY,
      description: "A list of the component's specifications.",
      items: {
        type: Type.OBJECT,
        properties: {
          specName: { type: Type.STRING, description: "The name of the specification (e.g., 'Voltage')." },
          specValue: { type: Type.STRING, description: "The value of the specification (e.g., '5-15V')." },
        },
        required: ['specName', 'specValue']
      }
    },
    commonUsage: { type: Type.STRING, description: "A brief summary of what this component is commonly used for." },
    confidence: { type: Type.STRING, description: "An assessment of the identification confidence: 'High', 'Medium', 'Low', or 'Uncertain'." },
    datasheetUrl: { type: Type.STRING, description: "A direct URL to the component's official PDF datasheet if available. Can be empty." },
    // New: Schema for shopping links
    shoppingLinks: {
      type: Type.ARRAY,
      description: "A list of shopping links for the component.",
      items: {
        type: Type.OBJECT,
        properties: {
          vendor: { type: Type.STRING, description: "The name of the vendor (e.g., 'Digi-Key', 'Mouser')." },
          url: { type: Type.STRING, description: "The direct URL to the product page." },
          price: { type: Type.STRING, description: "The approximate price, if available (e.g., '$0.75')." },
        },
        required: ['vendor', 'url']
      }
    }
  },
  required: ['name', 'type', 'specifications', 'commonUsage', 'confidence']
};

export const identifyComponent = async (base64Image: string): Promise<Omit<ComponentData, 'id' | 'userId'>> => {
  // Updated: Prompt is now more detailed
  const prompt = "Analyze the image of the electronic component. Identify it and provide its details according to the JSON schema. Find a direct URL to its PDF datasheet. Additionally, find up to 3 shopping links from major distributors like Digi-Key, Mouser, SparkFun, or Adafruit. If the component is unidentifiable, set confidence to 'Uncertain' and return empty arrays for links and specifications.";

  const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } };
  const textPart = { text: prompt };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: { responseMimeType: "application/json", responseSchema: componentSchema },
    });

    const parsedData = JSON.parse(response.text.trim());
    
    if (!parsedData.name || !parsedData.type) {
      throw new Error('Invalid data structure received from API');
    }
    
    return parsedData as Omit<ComponentData, 'id' | 'userId'>;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to identify component. The API returned an error.");
  }
};