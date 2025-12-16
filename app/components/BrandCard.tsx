// components/BrandCard.tsx
import React from "react";
import { Brand } from "../interfaces/types";

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const BASE_URL = "https://www.tiendapadelpoint.com/";
  
  // 🔥 GARANTIZAR que siempre haya una URL
  const brandURL = brand.url || `/index.php?route=product/manufacturer/info&manufacturer_id=${brand.metadata?.manufacturerId || 0}`;
  
  // 🔥 IMAGEN de respaldo para marcas
  const brandImage = brand.image && brand.image !== 'no_image.jpg' 
    ? `${BASE_URL}image/cache/${brand.image}`
    : null;

  return (
    <a
      href={`${BASE_URL}${brandURL}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-[180px] h-full"
    >
      <div className="relative w-full pt-[100%] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          {brandImage ? (
            <img 
              src={brandImage} 
              alt={brand.name}
              className="w-16 h-16 object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                // Mostrar letra inicial como fallback
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'w-16 h-16 flex items-center justify-center bg-white rounded-full shadow';
                fallbackDiv.innerHTML = `<span class="text-2xl font-bold text-indigo-600">${brand.name.charAt(0)}</span>`;
                e.currentTarget.parentNode?.appendChild(fallbackDiv);
              }}
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow">
              <span className="text-2xl font-bold text-indigo-600">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-sm text-center mb-1">
          {brand.name}
        </h3>
        
        <div className="text-center mb-2">
          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
            {brand.total_productos} productos
          </span>
        </div>
        
        <p className="text-gray-600 text-xs text-center line-clamp-2 mb-3 flex-1">
          {brand.description || `Marca ${brand.name} disponible`}
        </p>
        
        <div className="mt-auto">
          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition">
            Ver productos
          </button>
        </div>
      </div>
    </a>
  );
};

export default BrandCard;