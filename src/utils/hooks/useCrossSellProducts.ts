import { useState, useEffect } from 'react';
import { fetchCrossSellProducts } from '@/utils/api/woocommerce';

export interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  images: { src: string }[];
}

const useCrossSellProducts = (productId: string | null) => {
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const { products: fetchedProducts } = await fetchCrossSellProducts(productId);
        const formattedProducts = fetchedProducts.map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          images: [{ src: product.images[0]?.src || '/fallback-image.jpg' }],
        }));
        setProducts(formattedProducts.slice(0, 12)); // Limit to 12 products
      } catch (error) {
        console.error('Error fetching cross-sell products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  return { products, loading };
};

export default useCrossSellProducts;
