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
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrev) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(46, 23, 18, 0.5)' }}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg p-8 flex items-center justify-center overflow-auto"
        style={{
          maxWidth: '1440px', // Set modal max width to 1440px
          maxHeight: '90vh', // Allow vertical scroll if the image exceeds viewport height
        }}
      >
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
            layout="intrinsic" // Keeps the image's original dimensions
            width={1440} // Ensure the image does not exceed the modal's bounds
            height={0} // Auto height to maintain aspect ratio
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            priority
          />
        </div>

        {/* Previous button */}
        <button
          onClick={handlePrevious}
          className={`absolute left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg ${
            canGoPrev
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          } z-10`}
          disabled={!canGoPrev}
          aria-label="Previous Image"
        >
          <img src="/icons/arrow-left.svg" alt="Previous" className="h-6 w-6" />
        </button>

        {/* Next button */}
        <button
          onClick={handleNext}
          className={`absolute right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg ${
            canGoNext
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          } z-10`}
          disabled={!canGoNext}
          aria-label="Next Image"
        >
          <img src="/icons/arrow-right.svg" alt="Next" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ModalImageGallery;
