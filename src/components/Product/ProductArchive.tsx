import React, { useState, useEffect } from 'react';
import ProductPreview from './ProductPreview.component';
import SkeletonProductPreview from '../Skeletons/SkeletonProductPreview.component';
import {
  fetchProductsByCategoryId,
  fetchProductsWithFilters,
} from '../../utils/api/category';

interface ProductArchiveProps {
  categoryId: number;
  filters: { name: string; value: string }[];
  sortingOption: string;
  initialProducts: any[];
  totalProducts: number;
}

const ProductArchive: React.FC<ProductArchiveProps> = ({
  categoryId,
  filters,
  sortingOption,
  initialProducts,
  totalProducts: initialTotalProducts,
}) => {
  const perPage = 12;

  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [isLoaded, setIsLoaded] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(initialTotalProducts / perPage),
  );
  const [currentSorting, setCurrentSorting] = useState<string>('Sortowanie'); // Default sorting label

  // Reset products and pagination when category or initial products change
  useEffect(() => {
    setProducts(initialProducts || []);
    setTotalProducts(initialTotalProducts);
    setTotalPages(Math.ceil(initialTotalProducts / perPage));
    setPage(1); // Reset to the first page
    setCurrentSorting('Sortowanie'); // Reset sorting to default
  }, [initialProducts, categoryId, initialTotalProducts]);

  // Fetch products when filters, sorting, or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoaded(false);
      try {
        console.log('Fetching products with params:', {
          categoryId,
          page,
          perPage,
          filters,
          sortingOption: currentSorting,
        });

        if (filters.length > 0) {
          // Fetch products based on filters
          const {
            products: fetchedProducts,
            totalProducts: fetchedTotalProducts,
          } = await fetchProductsWithFilters(
            categoryId,
            filters,
            page,
            perPage,
          );

          setProducts(fetchedProducts || []);
          setTotalProducts(fetchedTotalProducts);
          setTotalPages(Math.ceil(fetchedTotalProducts / perPage));
        } else if (currentSorting !== 'Sortowanie') {
          // Fetch products based on sorting
          const sortingMap: Record<string, { orderby: string; order: string }> =
            {
              bestsellers: { orderby: 'popularity', order: 'desc' },
              'najnowsze produkty': { orderby: 'date', order: 'desc' },
              'najwyższa cena': { orderby: 'price', order: 'desc' },
              'najniższa cena': { orderby: 'price', order: 'asc' },
            };

          const sortingParams =
            sortingMap[currentSorting.toLowerCase()] || sortingMap.bestsellers;

          const {
            products: fetchedProducts,
            totalProducts: fetchedTotalProducts,
          } = await fetchProductsByCategoryId(
            categoryId,
            page,
            perPage,
            [],
            `${sortingParams.orderby}:${sortingParams.order}`,
          );

          setProducts(fetchedProducts || []);
          setTotalProducts(fetchedTotalProducts);
          setTotalPages(Math.ceil(fetchedTotalProducts / perPage));
        } else {
          // Default fetch without any sorting
          const {
            products: fetchedProducts,
            totalProducts: fetchedTotalProducts,
          } = await fetchProductsByCategoryId(
            categoryId,
            page,
            perPage,
            [],
            'default',
          );

          setProducts(fetchedProducts || []);
          setTotalProducts(fetchedTotalProducts);
          setTotalPages(Math.ceil(fetchedTotalProducts / perPage));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProducts();
  }, [categoryId, filters, currentSorting, page]);

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };

  const handleSortingChange = (newSorting: string) => {
    setCurrentSorting(newSorting);
    setPage(1); // Reset to the first page on sorting change
  };

  const renderPageNumbers = () => {
    if (totalPages === 0) return null;
    return Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageClick(index + 1)}
        className={`px-2 ${
          page === index + 1 ? 'font-bold text-black' : 'text-gray-500'
        }`}
      >
        {index + 1}
      </button>
    ));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoaded
          ? products.map((product) => (
              <ProductPreview key={product.id} product={product} />
            ))
          : Array.from({ length: perPage }).map((_, index) => (
              <SkeletonProductPreview key={index} />
            ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-8 space-x-2">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
          className="p-2"
          aria-label="Previous page"
        >
          <img
            src={
              page === 1
                ? '/icons/arrow-left-pagination.svg'
                : '/icons/arrow-left-black-pagination.svg'
            }
            alt="Previous"
            className="w-4 h-4"
          />
        </button>

        {renderPageNumbers()}

        <button
          onClick={() =>
            setPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={page === totalPages}
          className="p-2"
          aria-label="Next page"
        >
          <img
            src={
              page === totalPages
                ? '/icons/arrow-right-pagination.svg'
                : '/icons/arrow-right-black-pagination.svg'
            }
            alt="Next"
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>
  );
};

export default ProductArchive;
