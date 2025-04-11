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
        className="relative bg-white rounded-lg shadow-lg p-8 mx-4 md:mx-0 px-4 md:px-0 flex items-center justify-center overflow-auto"
        style={
          {
            // Allow vertical scroll if the image exceeds viewport height
          }
        }
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-black text-2xl hover:text-gray-700 z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div
          className="relative flex items-center justify-center"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative', // necessary when using layout="fill"
            maxHeight: '100vh', // ensures modal does not exceed viewport height
          }}
        >
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
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
