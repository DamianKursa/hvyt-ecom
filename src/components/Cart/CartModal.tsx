import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CartContext } from '@/stores/CartProvider';
import ProductPreview from '@/components/Product/ProductPreview.component';

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
  crossSellProducts: RecommendedProduct[]; // Cross-sell products from the hook
  loading: boolean; // Loading state from the hook
}

const CartModal: React.FC<CartModalProps> = ({
  product,
  quantity,
  total,
  onClose,
  crossSellProducts,
  loading,
}) => {
  const router = useRouter();
  const { cart } = React.useContext(CartContext);

  const totalItemCount = cart?.totalProductsCount || 0;
  const totalPrice = cart?.totalProductsPrice.toFixed(2) || '0.00';

  return (
    <div className="fixed inset-0 bg-[#363132] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-beige-light rounded-2xl px-8 py-10 md:px-12 md:py-14 w-full max-w-[830px] min-w-[90%] md:min-w-[830px] relative shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Twój koszyk</h2>
          <button className="text-2xl font-bold text-black" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Product Summary */}
        <div className="flex items-center mb-4">
          <div className="w-[90px] h-[90px] relative">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="ml-4">
            <p className="font-semibold text-normal">{product.name}</p>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="flex items-center mb-8 space-x-3">
          <div className="flex font-semibold items-center bg-beige-dark p-2 rounded-full">
            <Image
              src="/icons/cart.svg"
              alt="Cart Icon"
              width={24}
              height={24}
            />
            <span className="text-medium font-bold ml-1">
              ({totalItemCount})
            </span>
          </div>
          <span className="text-regular font-light text-black">
            Suma produktów w koszyku:
          </span>
          <span className="text-regular font-light">{totalPrice}zł</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <button
            onClick={onClose}
            className="w-full md:w-1/2 py-3 border border-black text-black rounded-full hover:bg-gray-100 transition"
          >
            Kontynuuj zakupy
          </button>
          <button
            onClick={() => router.push('/koszyk')}
            className="w-full md:w-1/2 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Przejdź do koszyka
          </button>
        </div>

        {/* Recommended Products */}
        <div className="pt-10 border-t border-[#DAD3C8]">
          <h3 className="text-lg font-semibold mb-4">Uzupełnij zamówienie</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {loading ? (
              <p className="text-center text-gray-500">Ładowanie...</p>
            ) : crossSellProducts.slice(0, 3).length > 0 ? ( // Display only the first 3 products
              crossSellProducts
                .slice(0, 3)
                .map((item) => (
                  <ProductPreview key={item.id} isSmall product={item} />
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
