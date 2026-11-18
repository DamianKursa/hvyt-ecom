import React, { useEffect, useState } from 'react';

export type GalleryMedia = {
  src: string;
  type?: 'image' | 'video';
  poster?: string;
};

interface ModalImageGalleryProps {
  images: Array<string | GalleryMedia>;
  selectedImageIndex: number;
  onClose: () => void;
}

function normalizeSlide(slide: string | GalleryMedia) {
  if (typeof slide === 'string') {
    return { src: slide, type: 'image' as const, poster: undefined };
  }
  return {
    src: slide.src,
    type: slide.type === 'video' ? ('video' as const) : ('image' as const),
    poster: slide.poster,
  };
}

const ModalImageGallery: React.FC<ModalImageGalleryProps> = ({
  images,
  selectedImageIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;
  const showArrows = images.length > 1;

  const handleNext = () => canGoNext && setCurrentIndex((i) => i + 1);
  const handlePrevious = () => canGoPrev && setCurrentIndex((i) => i - 1);

  // ESC + arrows + body scroll lock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && canGoNext) setCurrentIndex((i) => i + 1);
      if (e.key === 'ArrowLeft' && canGoPrev) setCurrentIndex((i) => i - 1);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [canGoNext, canGoPrev, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const slide = images[currentIndex] ? normalizeSlide(images[currentIndex]) : null;
  if (!slide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Media gallery"
    >
      <div
        className="
          relative inline-block bg-white rounded-[25px] overflow-hidden shadow-lg mx-4
          p-0
          max-w-[90vw] max-h-[90vh]
        "
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-black hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className={`flex items-center justify-center ${slide.type === 'video' ? 'bg-black' : ''}`}>
          {slide.type === 'video' ? (
            <video
              key={slide.src}
              src={slide.src}
              poster={slide.poster}
              controls
              autoPlay
              playsInline
              className="
                block
                w-auto h-auto
                max-w-[90vw] max-h-[90vh]
                bg-black
              "
            />
          ) : (
            <img
              key={slide.src}
              src={slide.src}
              alt={`Image ${currentIndex + 1} of ${images.length}`}
              className="
                block
                w-auto h-auto
                max-w-[90vw] max-h-[90vh]
                object-contain
                transition-opacity duration-300 ease-in-out
                opacity-100
              "
              draggable={false}
            />
          )}
        </div>

        {showArrows && (
          <button
            onClick={handlePrevious}
            className={`absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg ${canGoPrev ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } z-10`}
            disabled={!canGoPrev}
            aria-label="Previous"
          >
            <img src="/icons/arrow-left.svg" alt="Previous" className="h-6 w-6" />
          </button>
        )}

        {showArrows && (
          <button
            onClick={handleNext}
            className={`absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg ${canGoNext ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } z-10`}
            disabled={!canGoNext}
            aria-label="Next"
          >
            <img src="/icons/arrow-right.svg" alt="Next" className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalImageGallery;
