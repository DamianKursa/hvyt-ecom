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

  const firstImage = product.images?.[0]?.src || '/fallback-image.jpg';
  const secondImage = product.images?.[1]?.src || firstImage;

  const productPrice = product?.variations?.nodes?.length
    ? `od ${parseFloat(product.variations.nodes[0].price || '0').toFixed(2)} zł`
    : `${parseFloat(product.price || '0').toFixed(2)} zł`;

  return (
    <div
      className="relative w-full h-[400px] flex flex-col justify-between group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        className="absolute top-2 right-2 w-10 h-10 bg-[#F8F6F7]/50 rounded-full shadow-lg flex items-center justify-center z-20"
        aria-label="Add to wishlist"
      >
        <Image
          src="/icons/wishlist.svg"
          alt="Add to wishlist"
          width={24}
          height={24}
        />
      </button>

      {/* Image Container */}
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

      {/* Title and Price */}
      <div className="mt-2 text-left ">
        <h3 className="text-[16px] font-semibold text-neutral-darkest">
          {product.name}
        </h3>
        <p className="text-base font-light text-neutral-darkest">
          {productPrice}
        </p>
      </div>

      {/* Clickable Overlay */}
      <Link href={`/produkt/${product.slug}`} legacyBehavior>
        <a
          className="absolute inset-0 z-10"
          aria-label={`View product ${product.name}`}
        ></a>
      </Link>
    </div>
  );
};

export default ProductPreview;
