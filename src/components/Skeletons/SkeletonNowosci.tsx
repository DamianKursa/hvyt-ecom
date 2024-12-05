import React from 'react';

const SkeletonNowosci: React.FC = () => {
  return (
    <section className="container mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] py-16">
      {/* Header Skeleton */}
      <div className="px-[16px] flex flex-col items-start mb-8 md:hidden">
        <div className="h-8 bg-gray-300 animate-pulse rounded-md w-48 mb-4"></div>{' '}
        {/* Title */}
        <div className="h-4 bg-gray-300 animate-pulse rounded-md w-full mb-2"></div>{' '}
        {/* Content */}
        <div className="h-4 bg-gray-300 animate-pulse rounded-md w-2/3"></div>{' '}
        {/* Content */}
        <div className="h-10 bg-gray-300 animate-pulse rounded-full w-32 mt-4"></div>{' '}
        {/* Button */}
      </div>

      {/* Desktop View Skeleton */}
      <div className="hidden md:flex gap-6 h-[650px]">
        {/* First Column Skeleton */}
        <div className="flex flex-col w-1/2">
          <div className="flex flex-col h-full mb-[120px]">
            <div className="h-8 bg-gray-300 animate-pulse rounded-md w-48 mb-4"></div>{' '}
            {/* Title */}
            <div className="h-4 bg-gray-300 animate-pulse rounded-md w-full mb-2"></div>{' '}
            {/* Content */}
            <div className="h-4 bg-gray-300 animate-pulse rounded-md w-2/3"></div>{' '}
            {/* Content */}
            <div className="h-10 bg-gray-300 animate-pulse rounded-full w-32 mt-[40px]"></div>{' '}
            {/* Button */}
          </div>
          <div className="flex gap-6">
            <div className="w-full h-[250px] bg-gray-300 animate-pulse rounded-lg"></div>{' '}
            {/* Image 1 */}
            <div className="w-full h-[250px] bg-gray-300 animate-pulse rounded-lg"></div>{' '}
            {/* Image 2 */}
          </div>
        </div>

        {/* Second Column Skeleton */}
        <div className="flex flex-col w-1/2">
          <div className="flex gap-6 h-full">
            <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg"></div>{' '}
            {/* Image 3 */}
            <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg"></div>{' '}
            {/* Image 4 */}
          </div>
        </div>
      </div>

      {/* Mobile View Skeleton */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="relative w-full h-[350px] bg-gray-300 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkeletonNowosci;
