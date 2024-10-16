import { useState } from 'react';
import Image from 'next/image';

const SingleProductGallery = ({ images }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleGallery = () => {
    setIsExpanded(!isExpanded);
  };

  // Select images for the initial layout
  const firstImage = images[0]; // First image is full width
  const twoImagesRow = images.length > 2 ? images.slice(1, 3) : []; // Second row (two square images if available)
  const fullWidthImageThird = images.length > 3 ? images[3] : null; // Third row (full-width image if available)
  const fullWidthImageFourth = images.length > 4 ? images[4] : null; // Fourth row (full-width image if available)
  const remainingImages = images.length > 5 ? images.slice(5) : []; // Remaining images for the expanded gallery

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
        <div className="grid grid-cols-2 gap-2 mb-4">
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

      {/* Full-Width Fourth Image */}
      {fullWidthImageFourth && (
        <div className="relative w-full h-[540px] overflow-hidden mb-4">
          <Image
            src={fullWidthImageFourth.sourceUrl}
            alt="Full Product Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      {/* Remaining Images (Initially hidden) */}
      <div
        className={`grid grid-cols-2 gap-2 mb-4 transition-opacity duration-300 ${
          isExpanded ? '' : 'max-h-[900px] fade-bottom'
        }`}
      >
        {remainingImages.map((image) => (
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

      {/* Floating Toggle Button */}
      {!isExpanded && remainingImages.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full flex justify-center items-center">
          <div
            className="w-full h-48 bg-gradient-to-t from-white to-transparent absolute bottom-0 z-10"
            style={{ height: '150px' }} // Adjust the fade effect height here
          />
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
  );
};

export default SingleProductGallery;
