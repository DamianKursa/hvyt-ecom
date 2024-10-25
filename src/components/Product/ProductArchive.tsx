import React, { useState, useEffect } from 'react';
import ProductPreview from './ProductPreview.component';
import SkeletonProductPreview from './SkeletonProductPreview.component';
import { fetchProductsByCategoryId } from '../../utils/api/woocommerce';

interface ProductArchiveProps {
  categoryId: number;
  filters: { name: string; value: string }[];
  sortingOption: string;
  onRemoveFilter: (filter: { name: string; value: string }) => void;
}

const ProductArchive: React.FC<ProductArchiveProps> = ({ categoryId, filters, sortingOption, onRemoveFilter }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState('default');
  const [isArrowDown, setIsArrowDown] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsData = await fetchProductsByCategoryId(categoryId);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryId, filters, sortingOption]);

  const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSorting(e.target.value);
    setIsArrowDown(!isArrowDown);
  };

  return (
    <div>
      {/* Row with Active Filters and Sorting */}
      <div className="flex justify-between items-center mb-4">
        {/* Active Filters */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <span key={`${filter.name}-${filter.value}`} className="flex items-center text-[14px]">
              {filter.value}
              <button
                onClick={() => onRemoveFilter(filter)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        {/* Sorting Button */}
        <div className="relative w-[340px]">
          <button
            className="border rounded-[24px] w-[340px] text-[16px] p-[12px_20px] font-bold flex justify-between items-center"
            onClick={() => setIsArrowDown(!isArrowDown)}
          >
            Sortowanie
            <img
              src={isArrowDown ? '/icons/arrow-down.svg' : '/icons/arrow-up.svg'}
              alt="Arrow"
              className="w-[16px] h-[16px]"
            />
          </button>
          <select
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            value={sorting}
            onChange={handleSortingChange}
          >
            <option value="bestsellers">Bestsellers</option>
            <option value="newest">Najnowsze produkty</option>
            <option value="price-desc">Najwyższa cena</option>
            <option value="price-asc">Najniższa cena</option>
          </select>
        </div>
      </div>

      {/* Row with Product Previews */}
      <div className="grid grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonProductPreview key={index} />)
          : products.map((product) => <ProductPreview key={product.id} product={product} />)}
      </div>
    </div>
  );
};

export default ProductArchive;
