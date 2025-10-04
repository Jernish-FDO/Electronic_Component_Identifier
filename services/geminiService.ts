import { GoogleGenAI, Type } from "@google/genai";
import { ComponentData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const componentSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The common name of the electronic component (e.g., '555 Timer IC', '10k Ohm Resistor')." },
    type: { type: Type.STRING, description: "The general category of the component (e.g., 'Resistor', 'Capacitor', 'Integrated Circuit', 'Transistor')." },
    specifications: {
      type: Type.ARRAY,
      description: "A list of the component's specifications.",
      items: {
        type: Type.OBJECT,
        properties: {
          specName: { type: Type.STRING, description: "The name of the specification (e.g., 'Resistance', 'Tolerance')." },
          specValue: { type: Type.STRING, description: "The value of the specification (e.g., '10k Ohms', '5%')." },
        },
        required: ['specName', 'specValue']
      }
    },
    commonUsage: { type: Type.STRING, description: "A brief summary of what this component is commonly used for." },
    confidence: { type: Type.STRING, description: "An assessment of the identification confidence. Can be 'High', 'Medium', 'Low', or 'Uncertain'." },
    datasheetUrl: { type: Type.STRING, description: "A direct URL to the component's official PDF datasheet if available. If not found, this can be an empty string." }
  },
  required: ['name', 'type', 'specifications', 'commonUsage', 'confidence']
};

export const identifyComponent = async (base64Image: string): Promise<Omit<ComponentData, 'id'>> => {
  const prompt = "Analyze the image of the electronic component. Identify it and provide its details according to the provided JSON schema. Also, try to find a direct URL to the official PDF datasheet for this component. If the component cannot be clearly identified, set the confidence to 'Uncertain' and provide the best possible guess for the name and type.";

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };

  const textPart = {
    text: prompt
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: componentSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Validate the parsed data structure (simplified for brevity)
    if (!parsedData.name || !parsedData.type) {
      throw new Error('Invalid data structure received from API');
    }
    
    return parsedData as Omit<ComponentData, 'id'>;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to identify component. The API returned an error.");
  }
};