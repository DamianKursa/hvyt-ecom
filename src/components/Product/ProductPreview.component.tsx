import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WhishlistContext'; // Import WishlistContext

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
  containerClass?: string;
  imageClass?: string;
  isSmall?: boolean; // New prop to support smaller dimensions
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  containerClass = '',
  imageClass = '',
  isSmall = false, // Default to false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist(); // Use wishlist context

  const firstImage = product.images?.[0]?.src || '/fallback-image.jpg';
  const secondImage = product.images?.[1]?.src || firstImage;

  // Display discounted or base price depending on product variations
  const productPrice = product?.variations?.nodes?.length
    ? `od ${parseFloat(product.variations.nodes[0].price || '0').toFixed(2)} zł`
    : `${parseFloat(product.price || '0').toFixed(2)} zł`;

  // Truncate long product names for better display
  const truncatedName =
    product.name.length > 25
      ? `${product.name.substring(0, 25)}...`
      : product.name;

  // Adjust styles dynamically based on `isSmall` prop
  const imageSize = isSmall ? 250 : 350;
  const cardHeight = isSmall ? '300px' : '400px';

  // Handle wishlist toggle
  const handleWishlistClick = () => {
    if (isInWishlist(product.slug)) {
      removeFromWishlist(product.slug); // Remove product by slug
    } else {
      addToWishlist(product); // Add the full product object to the wishlist
    }
  };

  return (
    <div
      className={`relative w-full h-[${cardHeight}] flex flex-col justify-between group ${containerClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick} // Attach wishlist toggle logic
        className="absolute top-2 right-2 w-10 h-10 bg-[#F8F6F7]/50 rounded-full shadow-lg flex items-center justify-center z-20"
        aria-label={
          isInWishlist(product.slug)
            ? 'Remove from wishlist'
            : 'Add to wishlist'
        }
      >
        <Image
          src={
            isInWishlist(product.slug)
              ? '/icons/heart-added.svg' // Wishlist added icon
              : '/icons/wishlist.svg' // Default wishlist icon
          }
          alt={
            isInWishlist(product.slug)
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
          width={24}
          height={24}
        />
      </button>

      {/* Image Container */}
      <div
        className={`relative w-full h-[${imageSize}px] overflow-hidden rounded-lg  flex justify-center items-center ${imageClass}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-100 animate-pulse"></div>
        )}

        <Image
          src={isHovered ? secondImage : firstImage}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          quality={100} // Ensures high-quality images
          className="transition-all duration-300 ease-in-out"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)} // Optional: add error handling if needed
        />
      </div>

      {/* Title and Price */}
      <div className="mt-2 text-left">
        <h3
          className="text-[16px] font-semibold text-neutral-darkest"
          title={product.name}
        >
          {truncatedName}
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
