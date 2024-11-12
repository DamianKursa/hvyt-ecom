// SingleProductDetails.tsx
import React from 'react';
import ExpandableSection from '@/components/UI/ExpandableSection';
import ToggleSection from '@/components/UI/ToggleSection';
import { Product } from '@/utils/functions/interfaces';
import { cleanHTML } from '@/utils/cleanHTML';

interface SingleProductDetailsProps {
  product: Product;
}

const SingleProductDetails: React.FC<SingleProductDetailsProps> = ({
  product,
}) => {
  return (
    <div className="product-details">
      {/* Szczegóły produktu - Rendered as Toggle */}
      {product.meta_data?.find((meta) => meta.key === 'szczegoly_produktu') && (
        <ToggleSection
          title="Szczegóły produktu"
          content={cleanHTML(
            product.meta_data.find((meta) => meta.key === 'szczegoly_produktu')
              ?.value || '',
          )}
        />
      )}

      {/* Wymiary - Rendered as Expandable Section */}
      {product.meta_data?.find((meta) => meta.key === 'wymiary') && (
        <ExpandableSection
          title="Wymiary"
          content={cleanHTML(
            product.meta_data.find((meta) => meta.key === 'wymiary')?.value ||
              '',
          )}
        />
      )}

      {/* Informacje dodatkowe - Rendered as Expandable Section */}
      {product.meta_data?.find(
        (meta) => meta.key === 'informacje_dodatkowe',
      ) && (
        <ExpandableSection
          title="Informacje dodatkowe"
          content={cleanHTML(
            product.meta_data.find(
              (meta) => meta.key === 'informacje_dodatkowe',
            )?.value || '',
          )}
        />
      )}

      {/* Karta produktu i model 3D - Rendered as Expandable Section */}
      {product.meta_data?.find((meta) => meta.key === 'karta') && (
        <ExpandableSection
          title="Karta produktu i model 3D"
          content={cleanHTML(
            product.meta_data.find((meta) => meta.key === 'karta')?.value || '',
          )}
        />
      )}
    </div>
  );
};

export default SingleProductDetails;
