import React, { useState } from 'react';
import ProductPreview from './ProductPreview.component';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import useCrossSellProducts, {
  RecommendedProduct,
} from '@/utils/hooks/useCrossSellProducts';

interface NajczesciejKupowaneProps {
  productId: string; // ID of the product to fetch cross-sell products
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
  productId,
}) => {
  // Fetch cross-sell products using the custom hook
  const { products, loading } = useCrossSellProducts(productId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3.8; // Number of items per full slider view
  const gutter = 24; // Gap between products in pixels

  // Display fetched products or fallback products
  const displayedProducts = loading ? fallbackProducts : products || [];
  const totalItems = displayedProducts.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - itemsPerPage;

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
      <div
        className={`hidden md:flex overflow-hidden ${
          displayedProducts.length < Math.ceil(itemsPerPage)
            ? 'justify-start'
            : ''
        }`}
      >
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
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
          {/* Add empty boxes to maintain spacing for fewer than itemsPerPage */}
          {Array.from(
            {
              length: Math.ceil(itemsPerPage - displayedProducts.length),
            },
            (_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex-none"
                style={{
                  width: `calc((100% / ${itemsPerPage}) - ${gutter}px)`,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Optional: Add a background or make this div invisible */}
                <div className="w-full h-full bg-transparent"></div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden">
        {loading ? (
          <p>Ładowanie...</p>
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
