export interface Specification {
  specName: string;
  specValue: string;
}

// New: Define a structure for shopping links
export interface ShoppingLink {
  vendor: string;
  url: string;
  price?: string; // Optional price
}

export interface ComponentData {
  id: string; 
  userId: string;
  name: string;
  type: string;
  specifications: Specification[];
  commonUsage: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
  datasheetUrl?: string;
  shoppingLinks?: ShoppingLink[]; // New: An array of shopping links
}