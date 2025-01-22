import React from 'react';
import ToggleSection from '@/components/UI/ToggleSection';
import ExpandableSection from '@/components/UI/ExpandableSection';
import { Product } from '@/utils/functions/interfaces';
import { cleanHTML } from '@/utils/cleanHTML';

interface SingleProductDetailsProps {
  product: Product;
}

const SingleProductDetails: React.FC<SingleProductDetailsProps> = ({
  product,
}) => {
  return (
    <div className="product-details mx-4 md:mx-0">
      {/* Szczegóły produktu */}
      {product.meta_data?.find((meta) => meta.key === 'szczegoly_produktu') && (
        <ToggleSection
          title="Szczegóły produktu"
          content={cleanHTML(
            product.meta_data.find((meta) => meta.key === 'szczegoly_produktu')
              ?.value || '',
          )}
        />
      )}

      {/* Wymiary */}
      {product.meta_data?.find((meta) => meta.key === 'wymiary') && (
        <ExpandableSection
          isWymiary={true}
          title="Wymiary"
          content={cleanHTML(
            product.meta_data.find((meta) => meta.key === 'wymiary')?.value ||
              '',
          )}
        />
      )}

      {/* Informacje dodatkowe */}
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

      {/* Karta produktu i model 3D */}
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
