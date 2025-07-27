// File: components/Bestsellers.tsx

import React, { useState } from 'react';
import useSWR from 'swr';
import ProductPreview from '../Product/ProductPreview.component';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import SkeletonProduct from '@/components/Skeletons/SkeletonProduct';

interface Product {
  id: number | string;
  slug: string;
  name: string;
  price: string;
  images: { src: string }[];
}

interface BestsellersProps {
  title?: string;
  description?: string;
  perPage?: number;
}

const itemsPerPage = 3.8;
const gutter = 24;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) return Promise.reject(res);
    return res.json();
  });

const Bestsellers: React.FC<BestsellersProps> = ({
  title,
  description,
  perPage = 12,
}) => {
  // SWR will call our updated API route
  const apiUrl = `/api/bestsellers?perPage=${perPage}`;

  const { data, error } = useSWR(apiUrl, fetcher, {
    refreshInterval: 3_600_000, // revalidate every hour
    dedupingInterval: 600_000, // dedupe within 10 minutes
  });

  const loading = !data && !error;
  const products: Product[] = data
    ? (data.products as any[]).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      images: Array.isArray(p.images)
        ? p.images.map((img: any) => ({ src: img.src }))
        : [{ src: '/fallback-image.jpg' }],
    }))
    : [];

  const displayedProducts = products.slice(0, perPage);
  const totalItems = loading ? 4 : displayedProducts.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - itemsPerPage;

  const handlePrev = () => canGoPrev && setCurrentIndex((i) => i - 1);
  const handleNext = () => canGoNext && setCurrentIndex((i) => i + 1);

  return (
    <section className="container max-w-grid-desktop py-16 px-0 md:px-4 lg:px-4 xl:px-4 2xl:px-0 mx-auto">
      <div className="flex justify-between mb-[40px]">
        <div className="flex px-[16px] lg:px-0 flex-col h-full">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">
            {title || 'Bestsellers'}
          </h2>
          <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
            {description || 'Poznaj nasze najchętniej kupowane produkty.'}
          </p>
        </div>
        {/* Desktop navigation arrows */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={handlePrev}
            className={`p-3 rounded-full shadow-lg ${canGoPrev
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
            className={`p-3 rounded-full shadow-lg ${canGoNext
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
            transform: `translateX(-${(currentIndex % totalItems) * (100 / itemsPerPage)
              }%)`,
            gap: `${gutter}px`,
          }}
        >
          {(loading ? Array.from({ length: 4 }) : displayedProducts).map(
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
                  <ProductPreview product={product as Product} />
                </div>
              ),
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonProduct key={`skeleton-mobile-${index}`} />
            ))}
          </div>
        ) : (
          <ResponsiveSlider
            items={displayedProducts}
            renderItem={(product: Product) => (
              <ProductPreview product={product} />
            )}
          />
        )}
      </div>
    </section>
  );
};

export default Bestsellers;
