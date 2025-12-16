// interfaces/types.ts

// Tipos de elementos que puede devolver el backend
export type ItemType = 'product' | 'brand';

export interface BaseItem {
  id: string;
  name: string;
  image: string;
  type: ItemType;
  manufacturer?: string;
  price?: string;
  inStock?: boolean;
}

export interface Product extends BaseItem {
  type: 'product';
  price: string;
  originalPrice?: number;
  manufacturer: string;
  inStock: boolean;
  stock?: number;
  model?: string;
  sku?: string;
  category?: string;
  hasSpecialPrice?: boolean;
  specialPrice?: string;
  rating?: {
    average: string;
    count: number;
  };
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  url: string;
  metadata?: {
    viewed?: number;
    dateAdded?: string | null;
    isProduct?: boolean;
  };
}

export interface Brand extends BaseItem {
  type: 'brand';
  manufacturer: string;
  total_productos: number;
  description: string;
  price?: string;
  inStock?: boolean;
  url?: string;
  metadata?: {
    isBrand: boolean;
    manufacturerId: number;
    productCount: number;
  };
}

// Unión de tipos
export type DisplayItem = Product | Brand;

export interface ChatResponse {
  success: boolean;
  sessionId?: string;
  response?: string;
  products?: DisplayItem[];
  suggestions?: string[];
  metadata?: {
    processingTime?: number;
    productsCount?: number;
    source?: string;
    cached?: boolean;
    hasContext?: boolean;
    metrics?: any;
    intentType?: string;
    sqlUsed?: string;
  };
}