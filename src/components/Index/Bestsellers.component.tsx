import React, { useState, useEffect } from 'react';
import ProductPreview from '../Product/ProductPreview.component';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import SkeletonProduct from '@/components/Skeletons/SkeletonProduct';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  image: { src: string };
}

interface BestsellersProps {
  title?: string;
  description?: string;
}

const Bestsellers: React.FC<BestsellersProps> = ({ title, description }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3.8;
  const gutter = 24;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      setLoading(true);
      try {
        const categoryId = 123; // Replace with your actual category ID
        // Here we use an empty filters array, but you can adjust as needed.
        const filters = JSON.stringify([]);
        const response = await fetch(
          `/api/category?action=fetchProductsByCategoryId&categoryId=${categoryId}&page=1&perPage=12&sortingOption=default&filters=${encodeURIComponent(filters)}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        const fetchedProducts = data.products || [];
        const formattedProducts = fetchedProducts.map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: { src: product.images?.[0]?.src || '/fallback-image.jpg' },
        }));
        setProducts(formattedProducts.slice(0, 12));
      } catch (error) {
        console.error('Error fetching Bestsellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const totalItems = loading ? 4 : products.length;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - itemsPerPage;

  const handlePrev = () => canGoPrev && setCurrentIndex(currentIndex - 1);
  const handleNext = () => canGoNext && setCurrentIndex(currentIndex + 1);

  return (
    <section className="container max-w-grid-desktop py-16 sm:px-4 md:px-0 mx-auto">
      <div className="flex justify-between mb-[40px]">
        <div className="flex px-[16px] lg:px-0 flex-col h-full">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">
            {title || 'Bestsellers'}
          </h2>
          <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
            {description || 'Poznaj nasze najpopularniejsze modele.'}
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
            transform: `translateX(-${
              (currentIndex % totalItems) * (100 / itemsPerPage)
            }%)`,
            gap: `${gutter}px`,
          }}
        >
          {(loading ? Array.from({ length: 4 }) : products).map(
            (product, idx) =>
              loading ? (
                <div
                  key={`skeleton-${idx}`}
                  className="flex-none"
                  style={{
                    width: `calc((100% / ${itemsPerPage}) - ${gutter}px)`,
                  }}
                >
                  <SkeletonProduct />
                </div>
              ) : (
                <div
                  key={(product as Product).id}
                  className="flex-none"
                  style={{
                    width: `calc((100% / ${itemsPerPage}) - ${gutter}px)`,
                  }}
                >
                  <ProductPreview
                    product={{
                      ...(product as Product),
                      images: [{ src: (product as Product).image.src }],
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
            items={products}
            renderItem={(product: Product) => (
              <ProductPreview
                product={{
                  ...product,
                  images: [{ src: product.image.src }],
                }}
              />
            )}
          />
        )}
      </div>
    </section>
  );
};

export default Bestsellers;
