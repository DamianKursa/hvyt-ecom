import React, { useState } from 'react';
import Image from 'next/image';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import ModalImageGallery from '../UI/ModalGalleryImage';

interface ImageType {
  id: string;
  sourceUrl: string;
}

interface SingleProductGalleryProps {
  images: ImageType[];
}

const SingleProductGallery: React.FC<SingleProductGalleryProps> = ({
  images,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const toggleGallery = () => {
    setIsExpanded(!isExpanded);
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const firstImage = images[0] || null;
  const twoImagesRow = images.length > 2 ? images.slice(1, 3) : images.slice(1);
  const fullWidthImageThird = images.length > 3 ? images[3] : null;
  const remainingImages = images.length > 4 ? images.slice(4) : [];
  const showToggle = remainingImages.length > 0;

  return (
    <div className="product-gallery relative bg-[#f7f5f3]">
      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden my-8 max-w-full">
        <ResponsiveSlider
          items={images}
          renderItem={(image) => (
            <div
              key={image.id}
              className="relative w-full h-[430px] overflow-hidden cursor-pointer"
              onClick={() => openModal(images.indexOf(image))}
            >
              <Image
                src={image.sourceUrl}
                alt={`Product Image ${image.id}`}
                layout="fill"
                objectFit="cover"
                quality={100}
                className="rounded-[16px]"
              />
            </div>
          )}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {/* First Image (Full Width) */}
        {firstImage && (
          <div
            className="relative w-full h-[540px] overflow-hidden mb-4 cursor-pointer"
            onClick={() => openModal(0)}
          >
            <Image
              src={firstImage.sourceUrl}
              alt="Full Product Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="rounded-[16px]"
            />
          </div>
        )}

        {/* Two Square Images Row */}
        {twoImagesRow.length > 0 && (
          <div
            className={`grid ${
              twoImagesRow.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            } gap-2 mb-4`}
          >
            {twoImagesRow.map((image, index) => (
              <div
                key={image.id}
                className="relative w-full h-[430px] overflow-hidden cursor-pointer"
                onClick={() => openModal(index + 1)}
              >
                <Image
                  src={image.sourceUrl}
                  alt={`Product Image ${image.id}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-[16px]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Full-Width Third Image */}
        {fullWidthImageThird && (
          <div
            className="relative w-full h-[540px] overflow-hidden mb-4 cursor-pointer"
            onClick={() => openModal(3)}
          >
            <Image
              src={fullWidthImageThird.sourceUrl}
              alt="Full Product Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="rounded-[16px]"
            />
          </div>
        )}

        {/* Remaining Images with Fading Effect & Clickable Modal */}
        <div className="relative">
          {remainingImages.length > 0 && (
            <div
              className={`relative w-full ${
                isExpanded ? 'h-[540px]' : 'h-[250px]'
              } overflow-hidden mb-4 transition-all duration-500 cursor-pointer`}
              onClick={() => openModal(4)}
            >
              <Image
                src={remainingImages[0].sourceUrl}
                alt={`Product Image ${remainingImages[0].id}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="rounded-lg cursor-pointer"
              />

              {/* Fading Effect (Starts at 30%) */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
                  <div
                    className="absolute bottom-0 left-0 w-full h-[250px]"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(247, 245, 243, 0) 30%, #f7f5f3 100%)',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Toggle to expand or collapse */}
          {!isExpanded && showToggle && (
            <div className="absolute bottom-0 left-0 w-full flex justify-center items-center">
              <button
                onClick={toggleGallery}
                className="relative z-20 mt-4 px-6 py-2 text-lg font-light text-neutral-darkest  border border-neutral-dark rounded-full "
              >
                Więcej zdjęć +
              </button>
            </div>
          )}

          {/* Additional images (Modal Enabled) */}
          <div
            className={`grid grid-cols-2 gap-2 mb-4 transition-opacity duration-500 ${
              isExpanded ? '' : 'max-h-[0px] overflow-hidden'
            }`}
          >
            {remainingImages.slice(1).map((image, index) => (
              <div
                key={image.id}
                className="relative w-full h-[430px] overflow-hidden cursor-pointer"
                onClick={() => openModal(index + 5)}
              >
                <Image
                  src={image.sourceUrl}
                  alt={`Product Image ${image.id}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-[16px]"
                />
              </div>
            ))}
          </div>

          {isExpanded && (
            <div className="flex justify-center mt-6">
              <button
                onClick={toggleGallery}
                className="px-6 py-2 text-lg font-light text-neutral-darkest border border-neutral-dark rounded-full"
              >
                Mniej zdjęć −
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render the ModalImageGallery if modal is open */}
      {isModalOpen && (
        <ModalImageGallery
          images={images.map((image) => image.sourceUrl)}
          selectedImageIndex={selectedImageIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SingleProductGallery;
