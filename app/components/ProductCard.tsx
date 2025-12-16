// components/ProductCard.tsx
import React from "react";
import { Product } from "../interfaces/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const BASE_URL = "https://www.tiendapadelpoint.com/image/cache/";

  // 🔥 VERIFICAR si product tiene url
  const hasUrl = product.url && product.url.trim() !== '';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    const filename = product.image?.split('/').pop() || '';

    if (!filename) {
      img.src = `${BASE_URL}no_image-300x300.jpg`;
      return;
    }

    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const extension = filename.split('.').pop() || 'jpg';

    // Dimensiones a probar en orden
    const fallbackDimensions = ['800x800', '500x500', '300x300', '200x200'];

    // Verificar si la URL actual ya tiene alguna dimensión
    const currentDimensionMatch = currentSrc.match(/-(\d+x\d+)\./);

    if (currentDimensionMatch) {
      const currentDimension = currentDimensionMatch[1];

      // Buscar la siguiente dimensión en la lista
      const currentIndex = fallbackDimensions.indexOf(currentDimension);

      if (currentIndex !== -1 && currentIndex + 1 < fallbackDimensions.length) {
        // Probar con la siguiente dimensión
        const nextDimension = fallbackDimensions[currentIndex + 1];
        img.src = currentSrc.replace(
          `-${currentDimension}.`,
          `-${nextDimension}.`
        );
        console.log(`🔄 Fallback: ${currentDimension} → ${nextDimension}`);
        return;
      }
    }

    // Si ya probamos todas las dimensiones o no había dimensión
    // Probar con la imagen sin dimensiones
    if (!currentSrc.includes(nameWithoutExt) || currentDimensionMatch) {
      const baseUrl = "https://www.tiendapadelpoint.com/image/cache/";
      const urlWithoutDim = `${baseUrl}${product.image}`;

      if (currentSrc !== urlWithoutDim) {
        console.log(`🔄 Último intento: sin dimensiones`);
        img.src = urlWithoutDim;
        return;
      }
    }

    // Si todo falla, usar imagen por defecto
    console.log(`⚠️ Todas las opciones fallaron, usando no_image`);
    img.src = `${BASE_URL}no_image-300x300.jpg`;
  };

  const getImageUrl = () => {
    const BASE_URL = "https://www.tiendapadelpoint.com/image/cache/";

    // 1. Si no hay imagen, devolver por defecto
    if (!product.image || product.image.trim() === '') {
      return `${BASE_URL}no_image-300x300.jpg`;
    }

    // 2. Si la URL ya es completa o tiene dimensiones, mantenerla
    const imagePath = product.image.trim();
    const filename = imagePath.split('/').pop() || '';

    // Si ya tiene formato de caché con dimensiones, usar directamente
    if (filename.includes('-') && /\d+x\d+/.test(filename)) {
      // Si ya incluye "cache/", usar tal cual; sino, agregar BASE_URL
      return imagePath.includes('cache/')
        ? `https://www.tiendapadelpoint.com/${imagePath}`
        : `${BASE_URL}${imagePath}`;
    }

    // 3. Lista de dimensiones a probar (ordenadas de más específicas a generales)
    const dimensionsToTry = ['1100x1100', '800x800', '500x500', '300x300', '200x200'];

    // Extraer nombre base y extensión
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const extension = filename.split('.').pop() || 'jpg';

    // 4. Crear array de URLs posibles
    const possibleUrls = dimensionsToTry.map(dim => {
      // Reemplazar solo el nombre del archivo manteniendo la ruta
      return `${BASE_URL}${imagePath.replace(
        filename,
        `${nameWithoutExt}-${dim}.${extension}`
      )}`;
    });



    // Añadir también la URL sin dimensiones (por si acaso)
    possibleUrls.push(`${BASE_URL}${imagePath}`);

    // 5. Devolver la primera dimensión (la que más probabilidad tiene)
    // El manejo real del fallo lo hará onError
    console.log(`🔍 URL primaria para ${product.name}:`, possibleUrls[0]);
    console.log(`🔍 Alternativas disponibles:`, possibleUrls.slice(1, 3));

    return possibleUrls[0]; // Empieza con 1100x1100
  };


  const imageUrl = getImageUrl();

  // 🔥 MANEJAR CASO SIN URL
  const productoURLOpencart = hasUrl
    ? (product.url.startsWith('http')
      ? product.url
      : `https://www.tiendapadelpoint.com${product.url}`)
    : '#'; // Enlace por defecto si no hay URL

  // 🔥 CREAR CONTENIDO DEL CARD
  const cardContent = (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-[180px] h-full">
      <div className="relative w-full pt-[100%] bg-gray-50">
        <img
          src={getImageUrl()} // La nueva función flexible
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError} // El nuevo manejador inteligente
         />
      </div>

      <div className="p-2 flex flex-col flex-1">
        <h3 className="font-medium text-gray-800 text-xs line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="mt-auto">
          <p className="text-indigo-600 font-bold text-sm">{product.price || 'Consultar'}</p>
          <p className={`text-xs font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
            {product.inStock ? "✓ Stock" : "✗ Agotado"}
          </p>
        </div>
      </div>
    </div>
  );

  // 🔥 SI NO HAY URL, devolver solo el contenido (sin enlace)
  if (!hasUrl) {
    return cardContent;
  }

  // 🔥 SI HAY URL, envolver en enlace
  return (
    <a
      href={productoURLOpencart}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {cardContent}
    </a>
  );
};

export default ProductCard;