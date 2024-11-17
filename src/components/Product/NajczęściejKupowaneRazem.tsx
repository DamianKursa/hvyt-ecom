import React, { useState } from 'react';
import ProductPreview from '../Product/ProductPreview.component';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';

interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  images: { src: string }[];
}

interface NajczesciejKupowaneProps {
  products: RecommendedProduct[]; // Cross-sell products from the hook
  loading: boolean; // Loading state from the hook
}

const fallbackProducts: RecommendedProduct[] = [
  {
    id: '1',
    slug: 'product-slug-1',
    name: 'Sample Product 1',
    price: '15,90',
    images: [{ src: 'https://via.placeholder.com/300' }],
  },
  {
    id: '2',
    slug: 'product-slug-2',
    name: 'Sample Product 2',
    price: '15,90',
    images: [{ src: 'https://via.placeholder.com/300' }],
  },
];

const NajczesciejKupowane: React.FC<NajczesciejKupowaneProps> = ({
  products,
  loading,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3.8;
  const gutter = 24;

  const displayedProducts = loading ? fallbackProducts : products;

  const totalItems = displayedProducts.length;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - itemsPerPage;

  const handlePrev = () => canGoPrev && setCurrentIndex(currentIndex - 1);
  const handleNext = () => canGoNext && setCurrentIndex(currentIndex + 1);

  return (
    <section className="container max-w-grid-desktop py-16 sm:px-4 md:px-0 mx-auto">
      <div className="flex justify-between mb-[40px]">
        <div className="flex px-[16px] lg:px-0 flex-col h-full">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">
            Najczęściej kupowane razem
          </h2>
          <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
            Sprawdź produkty, które idealnie pasują z wybranym produktem.
          </p>
        </div>

        {/* Custom Navigation - Desktop Only */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={handlePrev}
            className={`p-3 rounded-full shadow-lg ${
              canGoPrev
                ? 'bg-black text-white'
                : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canGoPrev}
          >
            <img
              src="/icons/arrow-left.svg"
              alt="Previous"
              className="h-6 w-6"
            />
          </button>
          <button
            onClick={handleNext}
            className={`p-3 rounded-full shadow-lg ${
              canGoNext
                ? 'bg-black text-white'
                : 'bg-neutral-lighter text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canGoNext}
          >
            <img src="/icons/arrow-right.svg" alt="Next" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${(currentIndex % totalItems) * (100 / itemsPerPage)}%)`,
            gap: `${gutter}px`,
          }}
        >
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none"
              style={{
                width: `calc((100% / ${itemsPerPage}) - ${gutter}px)`,
                transition: 'all 0.3s ease',
              }}
            >
              <ProductPreview
                product={{
                  ...product,
                  images: [{ src: product.images[0].src }],
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden">
        <ResponsiveSlider
          items={displayedProducts}
          renderItem={(product: RecommendedProduct) => (
            <ProductPreview
              product={{ ...product, images: [{ src: product.images[0].src }] }}
            />
          )}
        />
      </div>
    </section>
  );
};

export default NajczesciejKupowane;
