import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WhishlistContext';

interface Product {
  name: string;
  price: string;
  slug: string;
  regular_price?: string;
  sale_price?: string;
  categorySlug?: string;
  images: { src: string }[];
  variations?: {
    nodes: {
      price: string;
    }[];
  };
  attributes?: Array<{ name: string; options?: string[]; option?: string }>;
}

interface ProductPreviewProps {
  product: Product;
  containerClass?: string;
  imageClass?: string;
  isSmall?: boolean;
  alwaysShowIcons?: boolean;
}

/**
 * Determines the product type icon based on the product slug or the "Rodzaj" attribute.
 */
const getProductTypeIcon = (product: Product): string | null => {
  const slugLower = product.slug.toLowerCase();

  const attributes = Array.isArray(product.attributes)
    ? product.attributes
    : Object.entries(product.attributes || {}).map(([key, value]) => ({
        name: key.replace(/^pa_/, '').replace(/-/g, ' '), // Normalize attribute names
        options: (value as { options?: string[] })?.options || [],
        option: (value as { option?: string })?.option || '',
      }));

  if (slugLower.includes('klamka')) return '/icons/kolekcja/klamka.svg';
  if (slugLower.includes('wieszak')) return '/icons/kolekcja/wieszak.svg';

  // Look for the "Rodzaj" attribute
  const rodzajAttr = attributes.find(
    (attr) => attr.name.toLowerCase() === 'rodzaj',
  );
  const value: string =
    rodzajAttr?.options?.[0]?.toLowerCase() ||
    rodzajAttr?.option?.toLowerCase() ||
    '';

  if (value.includes('relingi')) return '/icons/kolekcja/uchwyt.svg';
  if (value.includes('krawędziowe')) return '/icons/kolekcja/krawędziowy.svg';
  if (value.includes('gałki')) return '/icons/kolekcja/gałka.svg';
  if (value.includes('t-bar')) return '/icons/kolekcja/t-bar.svg';
  if (value.includes('podluzne')) return '/icons/kolekcja/uchwyt.svg';
  if (value.includes('muszlowe')) return '/icons/kolekcja/krawędziowy.svg';

  return slugLower.includes('uchwyt') ? '/icons/kolekcja/uchwyt.svg' : null;
};

const getProductColorSwatch = (product: Product): string | null => {
  const attributes = Array.isArray(product.attributes)
    ? product.attributes
    : Object.entries(product.attributes || {}).map(([key, value]) => ({
        name: key.replace(/^pa_/, '').replace(/-/g, ' '),
        options: (value as { options?: string[] })?.options || [],
        option: (value as { option?: string })?.option || '',
      }));

  const colorAttr = attributes.find(
    (attr) => attr.name.toLowerCase() === 'kolor',
  );
  const value: string =
    colorAttr?.options?.[0]?.toLowerCase() ||
    colorAttr?.option?.toLowerCase() ||
    '';

  const colorMapping: Record<string, string> = {
    złoty: '#eded87',
    srebrny: '#c6c6c6',
    czarny: '#000000',
    szary: '#a3a3a3',
    różowy: '#edbbd8',
    pozostałe: '#c11d51',
    niebieski: '#a4dae8',
    biały: '#fff',
  };

  return colorMapping[value] || null;
};

const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  containerClass = '',
  imageClass = '',
  isSmall = false,
  alwaysShowIcons = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const firstImage = product.images?.[0]?.src || '/fallback-image.jpg';
  const secondImage = product.images?.[1]?.src || firstImage;

  // Render logic
  const renderPrice = () => {
    // 1) variable products
    if (product.variations?.nodes?.length) {
      const vPrice = parseFloat(product.variations.nodes[0].price || '0');
      return <span>od {vPrice.toFixed(2)} zł</span>;
    }

    // 2) simple products
    const regular = parseFloat(product.regular_price || '0');
    const sale = parseFloat(
      product.sale_price !== undefined ? product.sale_price : product.price,
    );

    // on sale?
    if (sale < regular) {
      return (
        <>
          <span className="text-gray-500 line-through mr-2">
            {regular.toFixed(2)} zł
          </span>
          <span className="text-dark-pastel-red font-bold">
            {sale.toFixed(2)} zł
          </span>
        </>
      );
    }

    // not on sale
    return <span>{sale.toFixed(2)} zł</span>;
  };

  const truncatedName =
    product.name.length > 25
      ? `${product.name.substring(0, 25)}...`
      : product.name;

  const imageSize = isSmall ? 250 : 350;
  const cardHeight = isSmall ? '300px' : '400px';

  const handleWishlistClick = () => {
    isInWishlist(product.slug)
      ? removeFromWishlist(product.slug)
      : addToWishlist(product);
  };

  const typeIcon = getProductTypeIcon(product);
  const colorSwatch = getProductColorSwatch(product);

  return (
    <div
      className={`relative w-full h-[${cardHeight}] flex flex-col justify-between group ${containerClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
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
              ? '/icons/heart-added.svg'
              : '/icons/wishlist.svg'
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
        className={`relative w-full h-[${imageSize}px] overflow-hidden rounded-[16px] flex justify-center items-center ${imageClass}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-100 animate-pulse"></div>
        )}

        <Image
          src={isHovered ? secondImage : firstImage}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="transition-all duration-300 ease-in-out r"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Icon Box Overlay: Positioned 10px from bottom, left & right */}
        {(isHovered || alwaysShowIcons) &&
          (typeIcon || (!isHovered && colorSwatch)) && (
            <div className="absolute bottom-[10px] left-[10px] right-[10px] z-30 flex justify-between items-center pointer-events-none">
              {/* Left side: Color Swatch (Only when not hovered) */}
              {!isHovered && colorSwatch && (
                <div
                  className="w-[25px] h-[25px] rounded-md border border-gray-300"
                  style={{ backgroundColor: colorSwatch }}
                />
              )}
              {/* Right side: Product Type Icon */}
              {typeIcon && (
                <div
                  className="h-[24px] flex-shrink-0"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                  }}
                >
                  <Image
                    src={typeIcon}
                    alt="Product Type Icon"
                    height={24}
                    width={0}
                    style={{
                      objectFit: 'contain',
                      height: '24px',
                      width: 'auto',
                      minWidth: '24px',
                      maxWidth: '100%',
                    }}
                  />
                </div>
              )}
            </div>
          )}
      </div>

      {/* Title and Price */}
      <div className="mt-2 text-left">
        <h3 className="text-[16px] font-semibold">{product.name}</h3>
        <p className="text-base font-light">{renderPrice()}</p>
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
