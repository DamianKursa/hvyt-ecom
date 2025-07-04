import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WhishlistContext';

/** Ensures we never get NaN from parseFloat */
const safeParse = (v: unknown): number => {
  const n = typeof v === 'string' || typeof v === 'number' ? parseFloat(v as any) : NaN;
  return isNaN(n) ? 0 : n;
};

interface Product {
  name: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  date_on_sale_from?: string;
  date_on_sale_to?: string;
  slug: string;
  categorySlug?: string;
  images: { src: string }[];
  on_sale?: boolean;
  variations?: {
    nodes: {
      price: string;
      on_sale?: boolean;
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
  if (value.includes('krawędziowe')) return '/icons/kolekcja/krawedziowy.svg';
  if (value.includes('gałki')) return '/icons/kolekcja/gałka.svg';
  if (value.includes('t-bar')) return '/icons/kolekcja/t-bar.svg';
  if (value.includes('podluzne')) return '/icons/kolekcja/uchwyt.svg';
  if (value.includes('muszlowe')) return '/icons/kolekcja/krawedziowy.svg';

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

  // ─── derive prices safely ───
  const variationPrices = product.variations?.nodes
    ?.map((v) => safeParse(v.price))
    .filter((p) => p > 0) || [];

  const basePrice = variationPrices.length > 0
    ? Math.min(...variationPrices)
    : safeParse(product.price);

  // prefer explicit regular_price, else basePrice
  const regular = product.regular_price != null && product.regular_price !== ''
    ? safeParse(product.regular_price)
    : basePrice;

  // prefer explicit sale_price, else basePrice
  const salePrice = product.sale_price != null && product.sale_price !== ''
    ? safeParse(product.sale_price)
    : basePrice;

  // ─── now your existing date/gating logic ───
  const saleFrom = product.date_on_sale_from
    ? new Date(product.date_on_sale_from)
    : null;
  const saleTo = product.date_on_sale_to
    ? new Date(product.date_on_sale_to)
    : null;
  const now = new Date();
  const isSaleActive =
    salePrice < regular &&
    (product.on_sale !== undefined
      ? product.on_sale
      : ((!saleFrom || now >= saleFrom) && (!saleTo || now <= saleTo)));

  const discountPct = isSaleActive
    ? Math.round(((regular - salePrice) / regular) * 100)
    : 0;

  const productPrice = product?.variations?.nodes?.length
    ? `od ${parseFloat(product.variations.nodes[0].price || '0').toFixed(2)} zł`
    : `${parseFloat(product.price || '0').toFixed(2)} zł`;

  const fullName = product.name;
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
      {/* — discount badge top-left — */}
      {isSaleActive && discountPct > 0 && (
        <div
          className="absolute top-2 left-2 px-2 py-1 rounded-full text-white text-sm font-bold z-20"
          style={{ backgroundColor: '#661F30' /* same as your sale color */ }}
        >
          -{discountPct}%
        </div>
      )}
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

      {/* Title + Price */}
      <div className="mt-2 text-left">
        <h3
          className="text-[16px] font-semibold whitespace-normal break-words"
          style={{ hyphens: 'auto' }}
        >
          {fullName}
        </h3>
        <div className="mt-1 flex items-baseline">
          {/* — date-gated price display — */}
          <div className="mt-1 flex items-baseline">
            {!isSaleActive ? (
              <span className="text-base font-bold text-neutral-darkest">
                {regular.toFixed(2)} zł
              </span>
            ) : (
              <>
                <span className="text-gray-500 line-through mr-2">
                  {regular.toFixed(2)} zł
                </span>
                <span className="text-base font-bold text-dark-pastel-red">
                  {salePrice.toFixed(2)} zł
                </span>
              </>
            )}
          </div>
        </div>
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
