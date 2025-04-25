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
    // If a variation is selected, use its price—but only treat sale_price > 0 as a real sale
    const base = getNumber(selectedVariation.price);
    const rawSale = getNumber(selectedVariation.sale_price);
    salePrice = rawSale > 0 ? rawSale : base;
    const rawReg = getNumber(selectedVariation.regular_price);
    regularPrice = rawReg > 0 ? rawReg : base;
  } else if (variations.length > 0) {
    // No variation picked yet: look at first VARIATION
    const first = variations[0];
    const rawSale = first.sale_price ?? 0;
    salePrice = rawSale > 0 ? rawSale : getNumber(first.price);
    const rawReg = first.regular_price ?? salePrice;
    regularPrice = rawReg > 0 ? rawReg : salePrice;
  } else {
    // Simple product
    const prodSale = getNumber(product.sale_price ?? product.salePrice);
    const prodBase = getNumber(product.price);
    salePrice = prodSale > 0 ? prodSale : prodBase;
    const prodReg = getNumber(product.regular_price ?? product.regularPrice);
    regularPrice = prodReg > 0 ? prodReg : salePrice;
  }

  // Only show if there's a real discount
  if (salePrice >= regularPrice) return null;

  return (
    <p className="w-full text-[18px] text-gray-400 mt-1 mb-4">
      Najniższa cena w okresie 30 dni przed obniżką: {regularPrice.toFixed(2)}{' '}
      zł
    </p>
  );
};

export default LowestPriceInfo;
