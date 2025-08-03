import React from 'react';

/**
 * Converts a WooCommerce date string ("YYYY-MM-DD HH:MM:SS") to a Date instance.
 * Returns null if the string is missing or invalid.
 */
const parseDate = (raw?: string): Date | null => {
  if (!raw) return null;
  const iso = raw.includes(' ') ? raw.replace(' ', 'T') : raw;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

export interface LowestPriceInfoProps {
  product: {
    price: string | number;
    sale_price?: string | number;
    salePrice?: string | number;
    regular_price?: string | number;
    regularPrice?: string | number;
    on_sale?: boolean;
    date_on_sale_from?: string;
    date_on_sale_to?: string;

    baselinker_variations?: Array<{
      price: number;
      sale_price?: number;
      regular_price?: number;
      date_on_sale_from?: string;
      date_on_sale_to?: string;
      on_sale?: boolean;

    }>;
  };
  selectedVariation?: {
    price?: string | number;
    sale_price?: string | number;
    regular_price?: string | number;
    date_on_sale_from?: string;
    date_on_sale_to?: string;
    on_sale?: boolean;
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

  // Does WooCommerce explicitly mark this as on‑sale?
  const onSaleFlag = selectedVariation
    ? Boolean(selectedVariation.on_sale)
    : variations.length > 0
      ? Boolean(variations[0]?.on_sale)
      : Boolean(product.on_sale);

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

  // ─── date gating ───
  const rawFrom =
    selectedVariation?.date_on_sale_from ??
    product.date_on_sale_from ??
    product.baselinker_variations?.[0]?.date_on_sale_from;
  const rawTo =
    selectedVariation?.date_on_sale_to ??
    product.date_on_sale_to ??
    product.baselinker_variations?.[0]?.date_on_sale_to;
  const now = new Date();
  const saleFrom = parseDate(rawFrom);
  const saleTo = parseDate(rawTo);
  const isSaleActive =
    onSaleFlag &&
    salePrice < regularPrice &&
    (!saleFrom || now >= saleFrom) &&
    (!saleTo || now <= saleTo);

  if (!isSaleActive) return null;

  return (
    <p className="w-full text-[16px] text-[#969394] mt-[-20px] mb-4">
      Najniższa cena w okresie 30 dni przed obniżką: {regularPrice.toFixed(2)}{' '}
      zł
    </p>
  );
};

export default LowestPriceInfo;
