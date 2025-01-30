import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DiscountCode from '@/components/Cart/DiscountCode';

interface CartSummaryProps {
  totalProductsPrice: number;
  shippingPrice?: number;
  onCheckout: () => void;
  isCheckoutPage?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalProductsPrice,
  shippingPrice = 0,
  onCheckout,
  isCheckoutPage = false,
}) => {
  const [totalPrice, setTotalPrice] = useState(totalProductsPrice);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const updatedTotal = isCheckoutPage
        ? totalProductsPrice + shippingPrice
        : totalProductsPrice;
      setTotalPrice(updatedTotal);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [totalProductsPrice, shippingPrice, isCheckoutPage]);

  const formatPrice = (price: number) =>
    price.toFixed(2).replace('.', ',') + ' zł';

  const handleButtonClick = () => {
    if (isCheckoutPage) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  };

  return (
    <aside
      className={`${
        isCheckoutPage ? 'w-full mt-8' : 'lg:w-4/12 mt-8'
      } bg-beige p-6 rounded-[24px] shadow-lg`}
    >
      <h2 className="text-[32px] font-bold mb-6 text-neutral-darkest">
        Podsumowanie
      </h2>

      <div className="flex justify-between text-[20px] mb-6">
        <span className="text-neutral-darkest font-bold">Razem produkty</span>
        <span className="font-semibold text-neutral-darkest">
          {formatPrice(totalProductsPrice)}
        </span>
      </div>

      {isCheckoutPage && (
        <div className="flex justify-between text-lg mb-6">
          <span className="text-neutral-darkest font-medium">
            Koszt dostawy
          </span>
          <span className="font-semibold text-neutral-darkest">
            {loading ? (
              <div className="loader-pulse w-16 h-6 rounded"></div>
            ) : shippingPrice > 0 ? (
              formatPrice(shippingPrice)
            ) : (
              'Darmowa'
            )}
          </span>
        </div>
      )}

      <DiscountCode cartTotal={totalPrice} setCartTotal={setTotalPrice} />

      <div className="flex justify-between items-top mb-6">
        <div className="flex flex-col">
          <span className="text-base text-neutral-darkest font-bold">Suma</span>
        </div>
        <span className="text-2xl font-bold text-dark-pastel-red">
          {loading ? (
            <div className="loader-pulse w-20 h-8 rounded"></div>
          ) : (
            <p className="text-end">{formatPrice(totalPrice)}</p>
          )}
          <span className="text-sm text-black font-light">
            <p>kwota zawiera 23% VAT</p>
          </span>
        </span>
      </div>

      <button
        onClick={handleButtonClick}
        className="w-full py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-neutral-dark transition"
      >
        {isCheckoutPage ? 'Zamawiam i Płacę' : 'Przejdź do kasy'}
      </button>

      <style jsx>{`
        .loader-pulse {
          background: #f0f0f0; /* Lighter gray color */
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
      `}</style>
    </aside>
  );
};

export default CartSummary;
