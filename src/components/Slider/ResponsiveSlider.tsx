import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface ResponsiveSliderProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const ResponsiveSlider = <T extends {}>({
  items,
  renderItem,
}: ResponsiveSliderProps<T>) => {
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
            <div className="relative w-full h-auto rounded-lg">
              {renderItem(item)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Control */}
      <div className="px-[16px] absolute left-0 right-0 bottom-[-30px] h-[1px] bg-pastel-beige flex">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-full transition-all duration-500 ${
              index === activeIndex
                ? 'bg-dark-pastel-red flex-grow'
                : 'bg-neutral-light flex-1'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsiveSlider;
