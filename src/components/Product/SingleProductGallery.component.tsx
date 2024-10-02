import React from 'react';
import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  sourceUrl: string;
}

interface SingleProductGalleryProps {
  images: GalleryImage[];
}

const SingleProductGallery: React.FC<SingleProductGalleryProps> = ({ images }) => {
  const [showAllImages, setShowAllImages] = useState(false);

  const toggleImageGallery = () => {
    setShowAllImages(!showAllImages);
  };

  // Select images for the initial layout
  const fullImage = images[0]; // First image is the full image
  const twoImagesRow = images.slice(1, 3); // Second and third images
  const remainingImages = images.slice(3); // Remaining images for the full gallery

  return (
    <div className="product-gallery">
      {/* Full Image */}
      <div className="relative w-full h-80 overflow-hidden mb-4">
        <Image
          src={fullImage?.sourceUrl}
          alt={`Full Product Image`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Two Images Row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {twoImagesRow.map((image) => (
          <div key={image.id} className="relative w-full h-40 overflow-hidden">
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

      {/* Toggle button */}
      <button
        onClick={toggleImageGallery}
        className="mt-4 text-blue-500 hover:underline"
      >
        {showAllImages ? 'Zamknij zdjęcia' : 'Wiecej zdjęć'}
      </button>

      {/* Show all images in a grid when the button is clicked */}
      {showAllImages && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {remainingImages.map((image) => (
            <div key={image.id} className="relative w-full h-40 overflow-hidden">
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
    </div>
  );
};

export default SingleProductGallery;
