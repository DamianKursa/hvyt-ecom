import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const ProductPreview = ({ product }) => {
  // State to track if the image has finished loading
  const [isLoading, setIsLoading] = useState(true);

  // State to track if the product is added to the wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);

  // State to toggle wishlist button hover
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);

  // State to track whether the user is hovering over the product
  const [isHovered, setIsHovered] = useState(false);

  // Clean up the product price and prefix with "od" if it's a variable product
  const productPrice = product?.variations?.nodes?.length
    ? `od ${parseFloat(product.variations.nodes[0].price).toFixed(2)} zł`
    : `${parseFloat(product.price).toFixed(2)} zł`;

  // Product images: first and second (if available)
  const firstImage = product.image?.sourceUrl;
  const secondImage = product?.galleryImages?.nodes?.[1]?.sourceUrl || firstImage; // Use the second image if available

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="relative w-full h-[400px] flex flex-col justify-between group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative w-full h-[350px] overflow-hidden rounded-lg shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-100 animate-pulse"></div>
        )}

        {/* Product Image: changes to the second image on hover */}
        <Image
          src={isHovered ? secondImage : firstImage}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className={`rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Wishlist Button */}
        <button
          className="absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition-colors bg-[#F8F6F7]/50"
          onMouseEnter={() => setIsWishlistHovered(true)}
          onMouseLeave={() => setIsWishlistHovered(false)}
          onClick={handleWishlistClick}
          style={{
            backgroundColor: 'rgba(248, 246, 247, 0.5)', // #F8F6F7 at 50% opacity
          }}
        >
          <Image
            src={
              isWishlisted
                ? '/icons/heart-filled.svg' // Heart filled for the "added" state
                : isWishlistHovered
                ? '/icons/heart-dark-pastel.svg' // Dark pastel heart on hover
                : '/icons/heart.svg' // Black outline heart for normal state
            }
            alt="Wishlist"
            width={24}
            height={24}
            className="transition-colors duration-300 ease-in-out" // Ensures smooth color transition
          />
        </button>

        {/* Bottom-right hover icon */}
        {isHovered && (
          <div className="absolute bottom-2 right-2 z-20">
            <Image
              src="/icons/product-preview-icon.svg"
              alt="Preview Icon"
              width={34}
              height={24}
            />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-2 text-left">
        <h3 className="text-[16px] font-semibold text-neutral-darkest">{product.name}</h3>
        <p className="text-base font-light text-neutral-darkest">{productPrice}</p>
      </div>

      {/* Clickable link wrapping the entire component */}
      <Link href={`/produkt/${product.slug}`}>
        <span className="absolute inset-0 z-10" aria-label={`View product ${product.name}`}></span>
      </Link>
    </div>
  );
};

export default ProductPreview;
