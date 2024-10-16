import React from 'react';

const SkeletonNaszeKolekcje: React.FC = () => {
  return (
    <section className="w-full pt-[88px] py-16" style={{ backgroundColor: 'var(--color-beige)' }}>
      <div className="container mx-auto max-w-grid-desktop">
        <div className="hidden md:block">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 w-64 bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-6 w-40 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-full"></div>
          </div>

          {/* Skeleton Image Grid */}
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="relative w-full">
                <div className="h-[446px] bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="absolute bottom-4 left-4 h-8 w-48 bg-gray-300 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View Skeleton: Swiper */}
        <div className="md:hidden">
          <div className="flex gap-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="relative w-full">
                <div className="h-[446px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="absolute bottom-4 left-4 h-8 w-48 bg-gray-300 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkeletonNaszeKolekcje;
