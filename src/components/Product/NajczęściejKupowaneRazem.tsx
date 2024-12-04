import React, { useState } from 'react';
import ProductPreview from './ProductPreview.component';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import useCrossSellProducts, {
  RecommendedProduct,
} from '@/utils/hooks/useCrossSellProducts';
import SkeletonProduct from '@/components/Skeletons/SkeletonProduct';

interface NajczesciejKupowaneProps {
  productId: string; // ID of the product to fetch cross-sell products
}

const NajczesciejKupowane: React.FC<NajczesciejKupowaneProps> = ({
  productId,
}) => {
  const { products, loading } = useCrossSellProducts(productId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 340; // Fixed width for each item in pixels
  const gutter = 24; // Gap between items in pixels

  const displayedProducts = products || [];
  const totalItems = displayedProducts.length;

  const sliderWidth = totalItems * (itemWidth + gutter) - gutter; // Total slider width
  const visibleWidth = 4 * (itemWidth + gutter) - gutter; // Visible slider width (4 items)

  const canGoPrev = currentIndex > 0;
  const canGoNext = (currentIndex + 1) * visibleWidth < sliderWidth;

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
            transform: `translateX(-${currentIndex * visibleWidth}px)`,
            gap: `${gutter}px`,
            width: `${sliderWidth}px`, // Set the total slider width dynamically
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex-none"
                  style={{
                    minWidth: `${itemWidth}px`,
                    maxWidth: `${itemWidth}px`,
                  }}
                >
                  <SkeletonProduct />
                </div>
              ))
            : displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-none"
                  style={{
                    minWidth: `${itemWidth}px`,
                    maxWidth: `${itemWidth}px`,
                  }}
                >
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
                </div>
              ))}
        </div>
      </div>

      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonProduct key={index} />
            ))}
          </div>
        ) : (
          <ResponsiveSlider
            items={displayedProducts}
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
