// ResponsiveSlider.tsx

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
  return (
    <Swiper spaceBetween={16} slidesPerView={1.2} className="w-full">
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
  );
};

export default ResponsiveSlider;
