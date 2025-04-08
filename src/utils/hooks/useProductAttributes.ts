import { useState } from 'react';
import { Product, Variation } from '@/utils/functions/interfaces';

const useProductAttributes = (product: Product | null) => {
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null,
  );

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));


    const matchedVariation = product?.baselinker_variations?.find((variation) =>
      variation.attributes.every(
        (attr) =>
          selectedAttributes[attr.name] === attr.option ||
          (attr.name === attributeName && value === attr.option),
      ),
    );

    setSelectedVariation(
      matchedVariation
        ? {
            ...matchedVariation,
            id: matchedVariation.id.toString(),
            price: matchedVariation.price.toString(),
            regular_price: matchedVariation.regular_price.toString(),
            sale_price: matchedVariation.sale_price.toString(),
            image: {
              sourceUrl: matchedVariation.image.src,
            },
          }
        : null,
    );
  };

  return {
    selectedAttributes,
    selectedVariation,
    handleAttributeChange,
  };
};

export default useProductAttributes;
