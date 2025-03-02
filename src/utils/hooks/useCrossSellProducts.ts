import { useState, useEffect } from 'react';

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
      if (!productId) {
        console.warn('Product ID is null. Skipping fetch.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `/api/woocommerce?action=fetchCrossSellProducts&productId=${productId}`
        );
        if (!res.ok) {
          throw new Error('Error fetching cross-sell products');
        }
        const data = await res.json();
        const formattedProducts = data.products.map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          images: [{ src: product.images?.[0]?.src || '/fallback-image.jpg' }],
        }));
        setProducts(formattedProducts.slice(0, 12)); // Limit to 12 products
      } catch (error) {
        console.error('Error in useCrossSellProducts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  return { products, loading };
};

export default useCrossSellProducts;
