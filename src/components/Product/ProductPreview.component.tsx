import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  name: string;
  price: string;
  slug: string;
  images: { src: string }[];
  variations?: {
    nodes: {
      price: string;
    }[];
  };
}

interface ProductPreviewProps {
  product: Product;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Handle missing images by providing a fallback
  const firstImage = product.images?.[0]?.src || '/fallback-image.jpg';
  const secondImage = product.images?.[1]?.src || firstImage;

  // Handle variations and prices more safely
  const productPrice = product?.variations?.nodes?.length
    ? `od ${parseFloat(product.variations.nodes[0].price || '0').toFixed(2)} zł`
    : `${parseFloat(product.price || '0').toFixed(2)} zł`;

  return (
    <div
      className="relative w-full h-[400px] flex flex-col justify-between group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[350px] overflow-hidden rounded-lg shadow-lg flex justify-center items-center">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-100 animate-pulse"></div>
        )}

        <Image
          src={isHovered ? secondImage : firstImage}
          alt={product.name}
          width={350}
          height={350}
          className="object-cover w-full h-full transition-all duration-300 ease-in-out"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      <div className="mt-2 text-left">
        <h3 className="text-[16px] font-semibold text-neutral-darkest">{product.name}</h3>
        <p className="text-base font-light text-neutral-darkest">{productPrice}</p>
      </div>

      <Link href={`/produkt/${product.slug}`} legacyBehavior>
        <a className="absolute inset-0 z-10" aria-label={`View product ${product.name}`}></a>
      </Link>
    </div>
  );
};

export default ProductPreview;
