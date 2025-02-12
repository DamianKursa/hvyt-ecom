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

  useEffect(() => {
    const processContent = (content: string): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const imageSources: string[] = [];

      // Add icons to links
      doc.querySelectorAll('a').forEach((link) => {
        const icon = document.createElement('img');
        icon.src = '/icons/download-single.svg';
        icon.alt = 'Download';
        icon.classList.add('w-5', 'h-5', 'ml-2', 'inline-block');
        icon.setAttribute('data-icon', 'true'); // Add distinguishing attribute
        link.appendChild(icon);
      });

      // Process and validate images (exclude icons)
      let validImageIndex = 0; // Track index of valid images in `imageSources`
      doc.querySelectorAll('img').forEach((img) => {
        if (img.hasAttribute('data-icon')) return; // Skip icons

        const imageSrc = img.getAttribute('src');
        if (imageSrc && imageSrc.trim() !== '') {
          imageSources.push(imageSrc.trim());
          img.classList.add('product-image', 'cursor-pointer', 'mt-6');
          img.setAttribute('data-src', imageSrc.trim());
          img.setAttribute('data-index', validImageIndex.toString()); // Use validImageIndex
          validImageIndex++; // Increment only for valid images
        } else {
          console.warn('Image with missing src detected, skipping:', img);
          img.remove();
        }
      });
      setModalImages(imageSources); // Update modal images
      return doc.body.innerHTML;
    };

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

      if (imageUrl && modalImages[index]) {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
      } else {
        console.warn('Invalid image clicked or not found in modalImages.');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="product-details mx-4 md:mx-0" onClick={handleImageClick}>
      {product.meta_data?.find((meta) => meta.key === 'szczegoly_produktu') && (
        <ToggleSection
          title="Szczegóły produktu"
          content={cleanHTML(
            product.meta_data.find((meta) => meta.key === 'szczegoly_produktu')
              ?.value || '',
          )}
        />
      )}

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

      {product.meta_data?.find((meta) => meta.key === 'karta') && (
        <ExpandableSection
          title="Karta produktu i model 3D"
          content={processedContent}
        />
      )}

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
