// Producto que devuelve el backend
export interface Product {
  id: number;
  name: string;
  model: string;
  price: string;
  originalPrice: number;
  stock: number;
  image: string;
  additionalImages: string[];
  categories: string[];
  manufacturer: string;
  inStock: boolean;
  isActive: boolean;
  url: string;
  views: number;
}

// Metadata opcional
export interface ChatMetadata {
  processingTime: number;
  productsCount: number;
  matchType: string;
  deepseekUsed: boolean;
  dataAge: number;
  timestamp: string;
}

// Respuesta completa del backend
export interface ChatResponse {
  success: boolean;
  sessionId: string;
  response: string;          // texto principal del bot
  suggestions: string[];     // sugerencias rápidas
  products: Product[];       // productos asociados
  metadata: ChatMetadata;
}
