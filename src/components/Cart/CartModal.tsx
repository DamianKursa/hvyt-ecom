import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CartContext } from '@/stores/CartProvider';
import { fetchCrossSellProducts } from '@/utils/api/woocommerce';

interface RecommendedProduct {
  id: string;
  name: string;
  price: string;
  image: { src: string };
}

interface CartModalProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: string;
  };
  quantity: number; // Ensure this is defined
  total: string;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ product, onClose }) => {
  const router = useRouter();
  const { cart } = useContext(CartContext);

  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      try {
        const { products: fetchedProducts } = await fetchCrossSellProducts(
          product.id,
        );
        const formattedProducts: RecommendedProduct[] = fetchedProducts.map(
          (prod: any) => ({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: { src: prod.images[0]?.src || '/fallback-image.jpg' },
          }),
        );
        setRecommendedProducts(formattedProducts.slice(0, 4)); // Limit to 4 products
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [product.id]);

  const totalItemCount = cart?.totalProductsCount || 0;
  const totalPrice = cart?.totalProductsPrice?.toFixed(2) || '0.00';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative shadow-lg min-w-[830px]">
        {/* Header with Title and Close Button */}
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
        <div className="flex justify-between mb-8">
          <button
            onClick={onClose}
            className="w-[48%] py-3 border border-black text-black font-semibold rounded-full hover:bg-gray-100 transition"
          >
            Kontynuuj zakupy
          </button>
          <button
            onClick={() => router.push('/koszyk')}
            className="w-[48%] py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition"
          >
            Przejdź do koszyka
          </button>
        </div>

        {/* Recommended Products */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Uzupełnij zamówienie</h3>
          <div className="grid grid-cols-4 gap-2">
            {loading ? (
              <p>Ładowanie...</p>
            ) : (
              recommendedProducts.map((item) => (
                <div key={item.id} className="flex flex-col items-center">
                  <Image
                    src={item.image.src}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <p className="text-sm mt-2 text-center">{item.name}</p>
                  <p className="text-sm font-semibold">{item.price} zł</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
