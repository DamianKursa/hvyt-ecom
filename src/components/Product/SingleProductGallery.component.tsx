import React, { useState } from 'react';
import Image from 'next/image';

interface ImageType {
  id: string;
  sourceUrl: string;
}

interface SingleProductGalleryProps {
  images: ImageType[];
}

const SingleProductGallery: React.FC<SingleProductGalleryProps> = ({ images }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleGallery = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine available images and structure rows accordingly
  const firstImage = images[0] || null;
  const twoImagesRow = images.length > 2 ? images.slice(1, 3) : images.slice(1);
  const fullWidthImageThird = images.length > 3 ? images[3] : null;
  const remainingImages = images.length > 4 ? images.slice(4) : [];

  // Check if there are more than 4 images
  const showToggle = remainingImages.length > 0;

  return (
    <div className="product-gallery relative">
      {/* First Image (Full Width) */}
      {firstImage && (
        <div className="relative w-full h-[540px] overflow-hidden mb-4">
          <Image
            src={firstImage.sourceUrl}
            alt="Full Product Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      {/* Two Square Images Row */}
      {twoImagesRow.length > 0 && (
        <div className={`grid ${twoImagesRow.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-4`}>
          {twoImagesRow.map((image) => (
            <div key={image.id} className="relative w-full h-[430px] overflow-hidden">
              <Image
                src={image.sourceUrl}
                alt={`Product Image ${image.id}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* Full-Width Third Image */}
      {fullWidthImageThird && (
        <div className="relative w-full h-[540px] overflow-hidden mb-4">
          <Image
            src={fullWidthImageThird.sourceUrl}
            alt="Full Product Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      {/* Fading Section: Show 20% of the fourth image initially */}
      <div className="relative">
        {/* Fourth Image with fade */}
        {remainingImages.length > 0 && (
          <div className="relative w-full h-[540px] overflow-hidden mb-4">
            <Image
              src={remainingImages[0].sourceUrl}
              alt={`Product Image ${remainingImages[0].id}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            {!isExpanded && (
              <div
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent pointer-events-none"
                style={{ height: '80px' }} // Show only the top 20% of the fourth image
              />
            )}
          </div>
        )}

        {/* Additional images (hidden before expansion) */}
        <div
          className={`grid grid-cols-2 gap-2 mb-4 transition-opacity duration-300 ${
            isExpanded ? '' : 'max-h-[0px] overflow-hidden'
          }`}
        >
          {remainingImages.slice(1).map((image) => (
            <div key={image.id} className="relative w-full h-[430px] overflow-hidden">
              <Image
                src={image.sourceUrl}
                alt={`Product Image ${image.id}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Floating Toggle Button: Only visible if there are more than 4 images */}
        {!isExpanded && showToggle && (
          <div className="absolute bottom-0 left-0 w-full flex justify-center items-center">
            <button
              onClick={toggleGallery}
              className="relative z-20 mt-4 px-6 py-2 text-lg font-medium text-neutral-darkest bg-white/70 backdrop-blur-md border border-neutral-dark rounded-full shadow-lg"
            >
              Więcej zdjęć +
            </button>
          </div>
        )}

        {/* Expanded View Button */}
        {isExpanded && (
          <div className="flex justify-center mt-6">
            <button
              onClick={toggleGallery}
              className="px-6 py-2 text-lg font-medium text-neutral-darkest bg-white/70 backdrop-blur-md border border-neutral-dark rounded-full shadow-lg"
            >
              Mniej zdjęć −
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProductGallery;
