// ResponsiveSlider.tsx

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface SliderItem {
  src: string;
  alt: string;
  title?: string;
}

interface ResponsiveSliderProps<T extends SliderItem> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  showTitle?: boolean;
}

const ResponsiveSlider = <T extends SliderItem>({
  items,
  renderItem,
  showTitle = true,
}: ResponsiveSliderProps<T>) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <div className="relative">
      <Swiper
        spaceBetween={16}
        slidesPerView={1.2}
        onSlideChange={handleSlideChange}
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              {renderItem(item)}
              {showTitle && item.title && (
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {item.title}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Control - Positioned below the slider */}
      <div className="flex mt-8">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-[1.5px] flex-1 transition-all duration-500 ${
              index === activeIndex ? 'bg-dark-pastel-red' : 'bg-neutral-light'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsiveSlider;
