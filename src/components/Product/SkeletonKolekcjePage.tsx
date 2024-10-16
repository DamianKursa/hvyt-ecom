import React from 'react';

const SkeletonKolekcjePage: React.FC = () => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto max-w-grid-desktop">
        {/* First Row - 3 Columns, First Column Takes 2 Columns */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Large Skeleton for the first item (2 columns wide) */}
          <div className="col-span-2 relative">
            <div className="w-full h-[445px] bg-gray-300 animate-pulse rounded-lg"></div> {/* Large Image */}
            <div className="absolute bottom-4 left-4 h-8 w-32 bg-gray-300 animate-pulse rounded-md"></div> {/* Title Placeholder */}
          </div>

          {/* Two Smaller Skeletons for the second and third items */}
          <div className="col-span-1 relative">
            <div className="w-full h-[445px] bg-gray-300 animate-pulse rounded-lg"></div> {/* Image */}
            <div className="absolute bottom-4 left-4 h-8 w-24 bg-gray-300 animate-pulse rounded-md"></div> {/* Title Placeholder */}
          </div>
          <div className="col-span-1 relative">
            <div className="w-full h-[445px] bg-gray-300 animate-pulse rounded-lg"></div> {/* Image */}
            <div className="absolute bottom-4 left-4 h-8 w-24 bg-gray-300 animate-pulse rounded-md"></div> {/* Title Placeholder */}
          </div>
        </div>

        {/* Rest of the Rows - 4 Columns */}
        <div className="grid grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="col-span-1 relative">
              <div className="w-full h-[445px] bg-gray-300 animate-pulse rounded-lg"></div> {/* Image */}
              <div className="absolute bottom-4 left-4 h-8 w-24 bg-gray-300 animate-pulse rounded-md"></div> {/* Title Placeholder */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkeletonKolekcjePage;
