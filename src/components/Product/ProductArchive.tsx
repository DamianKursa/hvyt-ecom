import React from 'react';
import ProductPreview from './ProductPreview.component';
import SkeletonProductPreview from '../Skeletons/SkeletonProductPreview.component';
import clsx from 'clsx';
interface ProductArchiveProps {
  products: any[];
  totalProducts: number;
  loading: boolean;
  perPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    if (totalPages === 0) return null;

    return Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;
      return (
        <button
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          className={clsx(
            'w-8 h-8 flex items-center justify-center',
            currentPage === pageNumber
              ? 'text-black font-bold'
              : ' text-gray-700 hover:bg-gray-100'
          )}
        /* … */
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
            className="p-2"
            aria-label="Previous page"
          >
            <img
              src={
                currentPage === 1
                  ? '/icons/arrow-left-pagination.svg'
                  : '/icons/arrow-left-black-pagination.svg'
              }
              alt="Previous"
              className="w-4 h-4"
            />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2"
            aria-label="Next page"
          >
            <img
              src={
                currentPage === totalPages
                  ? '/icons/arrow-right-pagination.svg'
                  : '/icons/arrow-right-black-pagination.svg'
              }
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
