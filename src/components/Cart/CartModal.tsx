import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CartContext } from '@/stores/CartProvider';
import ProductPreview from '@/components/Product/ProductPreview.component';
import { fetchCrossSellProducts } from '@/utils/api/woocommerce';

interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  images: { src: string }[];
}

interface CartModalProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: string;
  };
  quantity: number;
  total: string;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  product,
  quantity,
  total,
  onClose,
}) => {
  const router = useRouter();
  const { cart } = useContext(CartContext);
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);

  const totalItemCount = cart?.totalProductsCount || 0;
  const totalPrice = cart?.totalProductsPrice.toFixed(2) || '0.00';

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!product.id) return;
      try {
        const fetchedProducts = await fetchCrossSellProducts(product.id);

        if (Array.isArray(fetchedProducts)) {
          // Map to the expected structure for ProductPreview
          const formattedProducts = fetchedProducts.map((item: any) => ({
            id: item.id,
            slug: item.slug || '',
            name: item.name,
            price: item.price,
            images: [
              { src: item.images?.[0]?.src || '/path/to/fallback-image.jpg' },
            ],
          }));
          setRecommendedProducts(formattedProducts.slice(0, 3)); // Limit to 3 products
        } else if (fetchedProducts && Array.isArray(fetchedProducts.products)) {
          // Handle nested structure (e.g., { products: [...] })
          const formattedProducts = fetchedProducts.products.map(
            (item: any) => ({
              id: item.id,
              slug: item.slug || '',
              name: item.name,
              price: item.price,
              images: [
                { src: item.images?.[0]?.src || '/path/to/fallback-image.jpg' },
              ],
            }),
          );
          setRecommendedProducts(formattedProducts.slice(0, 3)); // Limit to 3 products
        } else {
          console.error(
            'Unexpected structure for fetched products:',
            fetchedProducts,
          );
        }
      } catch (error) {
        console.error('Error fetching cross-sell products:', error);
      }
    };

    fetchRecommendedProducts();
  }, [product.id]);

  return (
    <div className="fixed inset-0 bg-[#363132] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 md:p-12 w-full max-w-[830px] min-w-[90%] md:min-w-[830px] relative shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Twój koszyk</h2>
          <button
            className="text-2xl font-bold text-gray-500"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Product Summary */}
        <div className="flex items-center mb-6">
          <Image
            src={product.image}
            alt={product.name}
            width={64}
            height={64}
            className="rounded-md"
          />
          <div className="ml-4">
            <p className="font-semibold text-lg">{product.name}</p>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="flex items-center mb-6 space-x-3">
          <div className="flex items-center bg-gray-100 p-2 rounded-full">
            <Image
              src="/icons/cart.svg"
              alt="Cart Icon"
              width={20}
              height={20}
            />
            <span className="text-sm font-semibold ml-2">
              ({totalItemCount})
            </span>
          </div>
          <span className="text-lg font-semibold text-gray-700">
            Suma produktów w koszyku:
          </span>
          <span className="text-lg font-bold">{totalPrice}zł</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={onClose}
            className="w-full md:w-1/2 py-3 border border-black text-black font-semibold rounded-full hover:bg-gray-100 transition"
          >
            Kontynuuj zakupy
          </button>
          <button
            onClick={() => router.push('/koszyk')}
            className="w-full md:w-1/2 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition"
          >
            Przejdź do koszyka
          </button>
        </div>

        {/* Recommended Products */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Uzupełnij zamówienie</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {recommendedProducts.length > 0 ? (
              recommendedProducts.map((item) => (
                <ProductPreview key={item.id} product={item} />
              ))
            ) : (
              <p className="text-center text-gray-500">Brak rekomendacji</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
