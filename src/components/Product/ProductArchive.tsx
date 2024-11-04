import React, { useState, useEffect } from 'react';
import ProductPreview from './ProductPreview.component';
import SkeletonProductPreview from './SkeletonProductPreview.component';
import { fetchProductsByCategoryId } from '../../utils/api/woocommerce';

interface ProductArchiveProps {
  categoryId: number;
  filters: { name: string; value: string }[];
  sortingOption: string;
}

const ProductArchive: React.FC<ProductArchiveProps> = ({
  categoryId,
  filters,
  sortingOption,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const perPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoaded(false); // Keep skeleton visible
      try {
        const { products: fetchedProducts, totalProducts } =
          await fetchProductsByCategoryId(categoryId, page, perPage);

        setProducts(fetchedProducts);
        setTotalPages(Math.ceil(totalProducts / perPage));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoaded(true); // Hide skeleton only after data is set
      }
    };

    fetchProducts();
  }, [categoryId, filters, sortingOption, page]);

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

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductArchive;
