import { useState, useEffect } from 'react';
import { getCurrentLanguage } from '../i18n/config';

export interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  images: { src: string }[];
}

const useCrossSellProducts = (productId: string | null) => {
  
  const lang = getCurrentLanguage();

  const [prodId, setProdId] = useState<string|null>(productId);
  
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!prodId) {
      console.warn('Product ID is null. Skipping fetch.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/woocommerce?action=fetchCrossSellProducts&productId=${prodId}&lang=${lang}`
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
      setProducts(formattedProducts.slice(0, 12)); 
    } catch (error) {
      console.error('Error in useCrossSellProducts:', error);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchProducts();
  }, [prodId]);

  return { products, loading, setProdId };
};

export default useCrossSellProducts;
