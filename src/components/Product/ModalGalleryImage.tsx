import React, { useState } from 'react';
import Image from 'next/image';

interface ModalImageGalleryProps {
  images: string[];
  selectedImageIndex: number;
  onClose: () => void;
}

const ModalImageGallery: React.FC<ModalImageGalleryProps> = ({ images, selectedImageIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative">
        <button
          className="absolute top-2 right-2 text-white"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white"
          onClick={handlePrevious}
        >
          ←
        </button>
        <div className="relative w-[600px] h-[400px]">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
          onClick={handleNext}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ModalImageGallery;
