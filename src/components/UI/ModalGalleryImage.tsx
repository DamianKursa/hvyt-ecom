import React, { useState } from 'react';
import Image from 'next/image';

interface ModalImageGalleryProps {
  images: string[];
  selectedImageIndex: number;
  onClose: () => void;
}

const ModalImageGallery: React.FC<ModalImageGalleryProps> = ({
  images,
  selectedImageIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const handlePrevious = () => {
    if (canGoPrev) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1,
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(46, 23, 18, 0.5)' }} // Custom background color with opacity
    >
      <div className="relative bg-white rounded-lg shadow-lg p-[75px] max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-black text-2xl hover:text-gray-700 z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Image Display */}
        <div className="relative flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            layout="intrinsic"
            width={800} // Adjust based on typical image width
            height={600} // Adjust to maintain aspect ratio
            objectFit="contain"
            className="rounded-lg"
            priority
          />
        </div>

        {/* Previous button - positioned 40px away from the image, within the modal padding */}
        <button
          onClick={handlePrevious}
          className={`absolute left-[75px] top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg ${
            canGoPrev
              ? 'bg-black text-white'
              : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'
          } z-10`}
          disabled={!canGoPrev}
          aria-label="Previous Image"
          style={{ marginRight: '40px' }} // Margin to ensure 40px space from the image
        >
          <img src="/icons/arrow-left.svg" alt="Previous" className="h-6 w-6" />
        </button>

        {/* Next button - positioned 40px away from the image, within the modal padding */}
        <button
          onClick={handleNext}
          className={`absolute right-[75px] top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg ${
            canGoNext
              ? 'bg-black text-white'
              : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'
          } z-10`}
          disabled={!canGoNext}
          aria-label="Next Image"
          style={{ marginLeft: '40px' }} // Margin to ensure 40px space from the image
        >
          <img src="/icons/arrow-right.svg" alt="Next" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ModalImageGallery;
