export interface Specification {
  specName: string;
  specValue: string;
}

export interface ComponentData {
  id: string;
  name: string;
  type: string;
  specifications: Specification[];
  commonUsage: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
  datasheetUrl?: string; 
}