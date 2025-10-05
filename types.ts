export interface Specification {
  specName: string;
  specValue: string;
}

export interface PinDefinition {
  pinNumber: number;
  pinName: string;
  pinDescription: string;
}

// NEW: A type to define the analysis options
export type AnalysisLevel = 'basic' | 'advanced';

export interface ComponentData {
  id: string; 
  userId: string;
  name: string;
  type: string;
  description?: string;
  manufacturer?: string;
  packageType?: string;
  applicationCategory?: string;
  keyFeatures?: string[];
  functionalBlocks?: string[];
  pinout?: PinDefinition[];
  specifications: Specification[];
  commonUsage: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
  datasheetUrl?: string;
  substitutes?: string[];
  imageBase64?: string;
}
