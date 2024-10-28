import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface ResponsiveSliderProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  showTitle?: boolean; // Control title overlay
}

const ResponsiveSlider = <T extends {}>({ items, renderItem, showTitle = false }: ResponsiveSliderProps<T>) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  if (!isClient) return null;

  return (
    <div className="container mx-auto max-w-full px-4 relative">
      <Swiper
        spaceBetween={16}
        slidesPerView={1.2}
        onSlideChange={handleSlideChange}
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="overflow-hidden relative">
            <div className="relative w-full h-[350px] rounded-lg overflow-hidden">
              {renderItem(item)}
              {/* Only show title if `showTitle` is true and item has a `title` property */}
              {showTitle && (item as any).title && (
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {(item as any).title}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Control - Positioned 30px below the boxes */}
      <div className="absolute left-0 right-0 bottom-[-30px] h-[1px] bg-pastel-beige flex">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-full transition-all duration-500 ${
              index === activeIndex ? 'bg-dark-pastel-red flex-grow' : 'bg-neutral-light flex-1'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsiveSlider;
