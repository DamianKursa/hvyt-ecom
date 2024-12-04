import React from 'react';

const SkeletonProduct: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] flex flex-col justify-between group">
      <div className="relative w-full h-[350px] overflow-hidden rounded-lg shadow-lg bg-gray-200 animate-pulse"></div>
      <div className="mt-2 text-left space-y-2">
        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/4"></div>
      </div>
    </div>
  );
};

export default SkeletonProduct;
