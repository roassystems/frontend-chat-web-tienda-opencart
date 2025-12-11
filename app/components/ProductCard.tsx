import React from "react";
import { Product } from "../interfaces/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const BASE_URL = "https://www.tiendapadelpoint.com/image/cache/";
  
  // Convertir "data/zapatillas-xxx.jpg" en "data/zapatillas-xxx-300x300.jpg"
  const getImageUrl = () => {
    // Extraer nombre del archivo
    const filename = product.image.split('/').pop() || '';
    
    // Si ya tiene tamaño (ej: nombre-1100x1100.jpg), mantenerlo
    if (filename.includes('-') && /\d+x\d+/.test(filename)) {
      return `${BASE_URL}${product.image}`;
    }
    
    // Sino, agregar tamaño 300x300 (óptimo para chat mobile)
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const extension = filename.split('.').pop() || 'jpg';
    
    return `${BASE_URL}${product.image.replace(
      filename, 
      `${nameWithoutExt}-300x300.${extension}`
    )}`;
  };

  const imageUrl = getImageUrl();
  const productoURLOpencart = `${BASE_URL}${product.url}`;
  //console.log("url del producto es "+ productoURLOpencart);

  return (
    <a
      href={productoURLOpencart}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-[180px]"
    >
      <div className="relative w-full pt-[100%] bg-gray-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback: intentar con tamaño 1100x1100
            e.currentTarget.src = imageUrl.replace('-300x300.', '-1100x1100.');
          }}
        />
      </div>
      
      <div className="p-2 flex flex-col flex-1">
        <h3 className="font-medium text-gray-800 text-xs line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="mt-auto">
          <p className="text-indigo-600 font-bold text-sm">{product.price}</p>
          <p className={`text-xs font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
            {product.inStock ? "✓ Stock" : "✗ Agotado"}
          </p>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;