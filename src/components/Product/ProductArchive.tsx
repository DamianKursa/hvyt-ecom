import React from 'react';
import ProductPreview from './ProductPreview.component';
import SkeletonProductPreview from '../Skeletons/SkeletonProductPreview.component';

interface ProductArchiveProps {
  products: any[]; // Products passed from CategoryPage
  totalProducts: number; // Total products passed from CategoryPage
  loading: boolean; // Indicates whether the parent is fetching new data
  perPage?: number; // Number of products per page
  currentPage: number; // Current page number
  onPageChange: (page: number) => void; // Callback for page change
}

const ProductArchive: React.FC<ProductArchiveProps> = ({
  products,
  totalProducts,
  loading,
  perPage = 12,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalProducts / perPage);

  const handlePageClick = (pageNum: number) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    return Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;
      return (
        <button
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          className={`px-2 py-1 rounded ${
            currentPage === pageNumber
              ? 'bg-black text-white'
              : 'bg-gray-200 text-black'
          }`}
        >
          {pageNumber}
        </button>
      );
    });
  };

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: perPage }).map((_, index) => (
              <SkeletonProductPreview key={index} />
            ))
          : products.map((product) => (
              <ProductPreview key={product.id} product={product} />
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-8 space-x-2">
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 ${
              currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-300'
            }`}
            aria-label="Previous page"
          >
            <img
              src="/icons/arrow-left-pagination.svg"
              alt="Previous"
              className="w-4 h-4"
            />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 ${
              currentPage === totalPages ? 'opacity-50' : 'hover:bg-gray-300'
            }`}
            aria-label="Next page"
          >
            <img
              src="/icons/arrow-right-pagination.svg"
              alt="Next"
              className="w-4 h-4"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductArchive;
