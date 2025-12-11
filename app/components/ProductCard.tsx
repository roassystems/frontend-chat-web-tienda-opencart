import React from "react";
import { Product } from "../interfaces/types";


interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Tomamos la URL base de la variable de entorno
  const BASE_URL = process.env.NEXT_PUBLIC_OPENCART_BASE_URL_IMAGEN ?? "";

  // Ajustamos la URL de la imagen principal
  const imageUrl = `${BASE_URL}${product.image.split("/").pop()}`;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
    >
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-indigo-600 font-medium">{product.price}</p>
        <p
          className={`text-sm ${
            product.inStock ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.inStock ? "En stock" : "Agotado"}
        </p>
      </div>
    </a>
  );
};

export default ProductCard;
