export interface Specification {
  specName: string;
  specValue: string;
}

// The ShoppingLink interface has been removed.

export interface ComponentData {
  id: string; 
  userId: string;
  name: string;
  type: string;
  specifications: Specification[];
  commonUsage: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
  datasheetUrl?: string;
  imageBase64?: string; // New: To store the captured image
}