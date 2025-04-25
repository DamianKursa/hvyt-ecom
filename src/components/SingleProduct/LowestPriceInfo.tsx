import React from 'react';

export interface LowestPriceInfoProps {
  product: {
    price: string | number;
    sale_price?: string | number;
    salePrice?: string | number;
    regular_price?: string | number;
    regularPrice?: string | number;
    baselinker_variations?: Array<{
      price: number;
      sale_price?: number;
      regular_price?: number;
    }>;
  };
  selectedVariation?: {
    price?: string | number;
    sale_price?: string | number;
    regular_price?: string | number;
  } | null;
}

const LowestPriceInfo: React.FC<LowestPriceInfoProps> = ({
  product,
  selectedVariation = null,
}) => {
  const getNumber = (val: unknown): number =>
    typeof val === 'string' || typeof val === 'number'
      ? parseFloat(val as any) || 0
      : 0;

  const variations = product.baselinker_variations ?? [];

  let salePrice = 0;
  let regularPrice = 0;

  if (selectedVariation) {
    salePrice = getNumber(
      selectedVariation.sale_price ?? selectedVariation.price,
    );
    regularPrice = getNumber(selectedVariation.regular_price ?? salePrice);
  } else if (variations.length > 0) {
    salePrice = getNumber(variations[0].price);
    regularPrice = getNumber(variations[0].regular_price ?? salePrice);
  } else {
    salePrice =
      getNumber(product.sale_price ?? product.salePrice) ||
      getNumber(product.price);
    regularPrice =
      getNumber(product.regular_price ?? product.regularPrice) || salePrice;
  }

  if (salePrice >= regularPrice) return null;

  return (
    <p className="w-full text-[18px] text-gray-400 mt-1 mb-4">
      Najniższa cena w okresie 30 dni przed obniżką: {regularPrice.toFixed(2)}{' '}
      zł
    </p>
  );
};

export default LowestPriceInfo;
