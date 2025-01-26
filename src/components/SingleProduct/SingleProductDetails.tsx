import React, { useState, useEffect } from 'react';
import ToggleSection from '@/components/UI/ToggleSection';
import ExpandableSection from '@/components/UI/ExpandableSection';
import { Product } from '@/utils/functions/interfaces';
import { cleanHTML } from '@/utils/cleanHTML';
import ModalImageGallery from '../UI/ModalGalleryImage';

interface SingleProductDetailsProps {
  product: Product;
}

const SingleProductDetails: React.FC<SingleProductDetailsProps> = ({
  product,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [processedContent, setProcessedContent] = useState<string>('');

  // Process content when product metadata changes
  useEffect(() => {
    const processContent = (content: string): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const imageSources: string[] = [];

      // Add icons to links
      doc.querySelectorAll('a').forEach((link) => {
        const icon = `<img src="/icons/download-single.svg" alt="Download" class="w-5 h-5 ml-2" />`;
        link.innerHTML += icon;
      });

      // Add unique classes and validate image src
      doc.querySelectorAll('img').forEach((img, index) => {
        const imageSrc = img.getAttribute('src');
        if (imageSrc && imageSrc.trim() !== '') {
          imageSources.push(imageSrc.trim());
          img.classList.add('product-image', 'cursor-pointer', 'mt-6');
          img.setAttribute('data-src', imageSrc.trim());
          img.setAttribute('data-index', index.toString());
        } else {
          console.warn('Image with missing src detected, skipping:', img);
          img.remove();
        }
      });

      setModalImages(imageSources); // Update modalImages only once
      return doc.body.innerHTML;
    };

    // Process the content if `product.meta_data` and `karta` exist
    const kartaContent = product.meta_data?.find(
      (meta) => meta.key === 'karta',
    )?.value;
    if (kartaContent) {
      setProcessedContent(processContent(kartaContent));
    }
  }, [product.meta_data]);

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (
      target.tagName === 'IMG' &&
      target.classList.contains('product-image')
    ) {
      const imageUrl = target.getAttribute('data-src');
      const index = parseInt(target.getAttribute('data-index') || '0', 10);

      if (imageUrl) {
        console.log('Image clicked:', imageUrl, index);
        setSelectedImageIndex(index);
        setIsModalOpen(true);
      } else {
        console.warn('Image src is invalid, skipping modal open.');
      }
    }
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  return (
    <div className="product-details mx-4 md:mx-0" onClick={handleImageClick}>
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
          content={processedContent}
        />
      )}

      {/* Modal */}
      {isModalOpen && modalImages.length > 0 && (
        <ModalImageGallery
          images={modalImages}
          selectedImageIndex={selectedImageIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SingleProductDetails;
