import React, { useState } from 'react';
import ProductPreview from './ProductPreview.component';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import SkeletonProduct from '@/components/Skeletons/SkeletonProduct';
import { RecommendedProduct } from '@/utils/hooks/useCrossSellProducts';

interface NajczesciejKupowaneProps {
  productId: string; // still available if needed for tracking purposes
  crossSellProducts: RecommendedProduct[];
  crossSellLoading: boolean;
}

const NajczesciejKupowane: React.FC<NajczesciejKupowaneProps> = ({
  productId,
  crossSellProducts,
  crossSellLoading,
}) => {
  // Use the passed props instead of calling the hook internally.
  const products = crossSellProducts;
  const loading = crossSellLoading;

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 350; // Fixed width for each item
  const gutter = 24; // Gap between items

  const displayedProducts = loading
    ? Array.from({ length: 4 }) // Show 4 skeletons during loading
    : products || []; // Show products after data is loaded

  const totalItems = displayedProducts.length;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - 1;

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentIndex((prev) => prev + 1);
  };

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
            aria-disabled={!canGoPrev}
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
            aria-disabled={!canGoNext}
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
            transform: `translateX(-${currentIndex * (itemWidth + gutter)}px)`,
            gap: `${gutter}px`,
            width: `${totalItems * (itemWidth + gutter) - gutter}px`,
          }}
        >
          {displayedProducts.map((product, idx) =>
            loading ? (
              <div
                key={`skeleton-${idx}`}
                className="flex-none"
                style={{ width: `${itemWidth}px` }}
              >
                <SkeletonProduct />
              </div>
            ) : (
              <div
                key={(product as RecommendedProduct).id}
                className="flex-none"
                style={{ width: `${itemWidth}px` }}
              >
                <ProductPreview
                  product={{
                    ...(product as RecommendedProduct),
                    images: [
                      {
                        src:
                          (product as RecommendedProduct).images?.[0]?.src ||
                          'https://via.placeholder.com/300',
                      },
                    ],
                  }}
                />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonProduct key={`skeleton-mobile-${index}`} />
            ))}
          </div>
        ) : (
          <ResponsiveSlider
            items={products || []}
            renderItem={(product: RecommendedProduct) => (
              <ProductPreview
                product={{
                  ...product,
                  images: [
                    {
                      src:
                        product.images?.[0]?.src ||
                        'https://via.placeholder.com/300',
                    },
                  ],
                }}
              />
            )}
          />
        )}
      </div>
    </section>
  );
};

export default NajczesciejKupowane;
