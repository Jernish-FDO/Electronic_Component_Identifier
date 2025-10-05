import { GoogleGenAI, Type } from "@google/genai";
import { ComponentData, AnalysisLevel } from '../types';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// --- SCHEMA DEFINITIONS FOR EACH LEVEL ---

const basicSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The specific model number or common name." },
    type: { type: Type.STRING, description: "The general category of the component." },
    commonUsage: { type: Type.STRING, description: "A brief, one-sentence summary of what this is used for. If uncertain, explain why." },
    confidence: { type: Type.STRING, description: "Confidence: 'High', 'Medium', 'Low', or 'Uncertain'." },
  },
  required: ['name', 'type', 'commonUsage', 'confidence']
};

const advancedSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The specific model number or common name of the electronic component (e.g., 'NE555P Timer IC')." },
    type: { type: Type.STRING, description: "The general category of the component (e.g., 'Integrated Circuit', 'Transistor')." },
    description: { type: Type.STRING, description: "A concise, 1-2 sentence technical summary of the component's primary function and purpose." },
    applicationCategory: { type: Type.STRING, description: "The high-level application category this component belongs to (e.g., 'Timing & Oscillation', 'Linear Regulation', 'Signal Amplification', 'Digital Logic')." },
    manufacturer: { type: Type.STRING, description: "The manufacturer of the component (e.g., 'Texas Instruments'). Can be 'Unknown' if not identifiable." },
    packageType: { type: Type.STRING, description: "The physical package type of the component (e.g., 'DIP-8', 'TO-220', 'SOT-23')." },
    keyFeatures: { type: Type.ARRAY, description: "A list of 3-5 key features from the datasheet.", items: { type: Type.STRING } },
    pinout: {
      type: Type.ARRAY,
      description: "A detailed list of each pin's number, name, and function. For components without numbered pins, this must be an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          pinNumber: { type: Type.NUMBER, description: "The pin number." },
          pinName: { type: Type.STRING, description: "The official name of the pin (e.g., 'VCC', 'GND', 'OUT')." },
          pinDescription: { type: Type.STRING, description: "A brief description of the pin's function." }
        },
        required: ['pinNumber', 'pinName', 'pinDescription']
      }
    },
    specifications: {
      type: Type.ARRAY,
      description: "A list of the most important technical specifications.",
      items: {
        type: Type.OBJECT,
        properties: {
          specName: { type: Type.STRING, description: "The name of the specification (e.g., 'Supply Voltage')." },
          specValue: { type: Type.STRING, description: "The value and unit (e.g., '4.5V - 16V')." },
        },
        required: ['specName', 'specValue']
      }
    },
    commonUsage: { type: Type.STRING, description: "A paragraph explaining common applications. If confidence is 'Uncertain', this field MUST explain why." },
    confidence: { type: Type.STRING, description: "An assessment of the identification confidence: 'High', 'Medium', 'Low', or 'Uncertain'." },
    datasheetUrl: { type: Type.STRING, description: "A direct URL to the component's official PDF datasheet. Must be an empty string if not found." },
    substitutes: { type: Type.ARRAY, description: "A list of 1-3 common, pin-compatible substitute part numbers.", items: { type: Type.STRING } },
  },
  required: ['name', 'type', 'description', 'applicationCategory', 'manufacturer', 'packageType', 'keyFeatures', 'pinout', 'specifications', 'commonUsage', 'confidence', 'datasheetUrl', 'substitutes']
};

// --- PROMPT DEFINITIONS FOR EACH LEVEL ---

const basicPrompt = `
  Quickly analyze the image of the electronic component. Provide a basic identification according to the schema.
  If you are uncertain, set confidence to 'Uncertain' and use 'commonUsage' to explain why.
`;

const advancedPrompt = `
  You are an expert electronics engineer. Perform a detailed identification of the component in the image.
  Your response must be a comprehensive JSON object adhering strictly to the schema.
  
  CRITICAL INSTRUCTIONS:
  - Populate ALL fields. Return empty arrays [] or empty strings "" for fields where info is not found.
  - The pinout is critical. Provide a full pin-by-pin breakdown for any component with numbered pins.
  - If uncertain, set confidence to 'Uncertain', name to 'Unknown Component', and explain why in the 'commonUsage' field.
`;

export const identifyComponent = async (base64Image: string, level: AnalysisLevel): Promise<Omit<ComponentData, 'id' | 'userId' | 'imageBase64'>> => {
  const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } };
  
  // Select prompt and schema based on the user's choice
  const isAdvanced = level === 'advanced';
  const prompt = isAdvanced ? advancedPrompt : basicPrompt;
  const schema = isAdvanced ? advancedSchema : basicSchema;

  const textPart = { text: prompt };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // This model is stable and works for both simple/complex queries
      contents: { parts: [imagePart, textPart] },
      config: { responseMimeType: "application/json", responseSchema: schema },
    });

    const parsedData = JSON.parse(response.text.trim());
    
    if (!parsedData.name || !parsedData.type) {
      throw new Error('Invalid data structure received from API');
    }
    
    // For basic responses, we need to ensure all fields from the full ComponentData type exist, even if empty.
    const fullData = isAdvanced ? parsedData : {
        ...parsedData,
        description: '',
        applicationCategory: '',
        manufacturer: '',
        packageType: '',
        keyFeatures: [],
        pinout: [],
        specifications: [],
        datasheetUrl: '',
        substitutes: []
    };

    return fullData as Omit<ComponentData, 'id' | 'userId' | 'imageBase64'>;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to identify component. The AI returned an error.");
  }
};
