import React from 'react';

const SkeletonCollectionPage: React.FC = () => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto max-w-grid-desktop">
        {/* Header Skeleton */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Text Section */}
          <div>
            <div className="h-8 bg-gray-300 animate-pulse rounded-md w-48 mb-4"></div>
            {/* Title */}
            <div className="h-4 bg-gray-300 animate-pulse rounded-md w-full mb-2"></div>
            {/* Content */}
            <div className="h-4 bg-gray-300 animate-pulse rounded-md w-2/3"></div>
            {/* Content */}
          </div>
          {/* Image Skeleton */}
          <div className="relative w-full h-96 bg-gray-300 animate-pulse rounded-lg"></div>
          {/* Featured Image */}
        </div>

        {/* Slider Section Skeleton */}
        <div className="grid grid-cols-6 gap-4 mb-12">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-full h-[205px] bg-gray-300 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>

        {/* Product Preview Section Skeleton */}
        <div className="grid grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="col-span-1">
              <div className="w-full h-[300px] bg-gray-300 animate-pulse rounded-lg"></div>
              {/* Product Image */}
              <div className="mt-4 h-4 bg-gray-300 animate-pulse rounded-md w-full"></div>
              {/* Product Title */}
              <div className="mt-2 h-4 bg-gray-300 animate-pulse rounded-md w-2/3"></div>
              {/* Product Attributes */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkeletonCollectionPage;
