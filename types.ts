export interface Specification {
  specName: string;
  specValue: string;
}

export interface ComponentData {
  name: string;
  type: string;
  specifications: Specification[];
  commonUsage: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
}