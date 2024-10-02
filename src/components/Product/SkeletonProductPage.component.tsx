import React from 'react';

const SkeletonProductPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-wrap lg:flex-nowrap gap-6">
        {/* Left Side (70%): Product Images */}
        <div className="lg:w-7/12 flex flex-col gap-6">
          {/* Skeleton for the main image */}
          <div className="relative w-full h-80 bg-gray-300 animate-pulse rounded-lg mb-4"></div>

          {/* Skeleton for additional images */}
          <div className="flex justify-between">
            <div className="bg-gray-300 animate-pulse rounded-lg w-[48%] h-[300px]"></div>
            <div className="bg-gray-300 animate-pulse rounded-lg w-[48%] h-[300px]"></div>
          </div>
        </div>

        {/* Right Side (30%): Product Details */}
        <div className="lg:w-5/12 flex flex-col gap-6">
          <div className="h-8 bg-gray-300 animate-pulse rounded-md"></div> {/* Product Name Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-6 line-through bg-gray-300 animate-pulse rounded-md w-16"></div> {/* Regular Price Skeleton */}
          </div>
          <div className="h-4 bg-gray-300 animate-pulse rounded-md w-full"></div> {/* Description Skeleton */}

          {/* Attributes Skeleton */}
          <div className="flex flex-wrap gap-4 items-center">
            <h3 className="font-semibold text-lg bg-gray-300 animate-pulse rounded-md w-16"></h3>
            <div className="flex gap-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Rozstaw Attribute and Quantity Selector in Separate Row */}
          <div className="flex flex-wrap gap-6 items-center">
            <div className="relative flex-1">
              <select className="w-full py-2 px-4 border border-gray-300 rounded-md cursor-not-allowed bg-gray-200 animate-pulse">
                <option value="" disabled hidden>
                  Rozstaw
                </option>
              </select>
            </div>

            {/* Quantity Selector Skeleton */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2">
              <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <button className="w-full mt-4 py-3 border border-gray-300 text-gray-300 font-bold rounded-full flex items-center justify-center gap-2">
            <div className="h-5 bg-gray-300 animate-pulse rounded-full w-5"></div> {/* Cart icon skeleton */}
            <div className="h-5 bg-gray-300 animate-pulse rounded-md w-32"></div> {/* Button text skeleton */}
          </button>

          {/* Shipment/Return Info Skeleton */}
          <div className="mt-6 p-4 border border-gray-300 rounded-lg">
            <ul className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gray-300 animate-pulse rounded-full"></div>
                  <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div> {/* Placeholder for info text */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductPage;
