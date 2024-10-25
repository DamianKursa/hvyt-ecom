import React, { useState, useEffect } from 'react';
import ProductPreview from './ProductPreview.component';
import SkeletonProductPreview from './SkeletonProductPreview.component';
import { fetchProductsByCategoryId } from '../../utils/api/woocommerce';

interface ProductArchiveProps {
  categoryId: number;
  filters: { name: string; value: string }[];
  sortingOption: string;
}

const ProductArchive: React.FC<ProductArchiveProps> = ({ categoryId, filters, sortingOption }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {/* Product Previews Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonProductPreview key={index} />)
          : products.map((product) => <ProductPreview key={product.id} product={product} />)}
      </div>
    </div>
  );
};

export default ProductArchive;
