import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DiscountCode from '@/components/Cart/DiscountCode';

interface CartSummaryProps {
  totalProductsPrice: number;
  shippingPrice?: number;
  onCheckout: () => Promise<void> | void;
  isCheckoutPage?: boolean;
  disabled?: boolean; // Add this line
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalProductsPrice,
  shippingPrice = 0,
  onCheckout,
  isCheckoutPage = false,
}) => {
  const [totalPrice, setTotalPrice] = useState(totalProductsPrice);
  const [loading, setLoading] = useState(false);
  // Local loading state to disable the button during submission or for timeout
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const updatedTotal = totalProductsPrice; // Only products total (without shipping)
      setTotalPrice(updatedTotal);

      setTotalPrice(updatedTotal);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [totalProductsPrice, shippingPrice, isCheckoutPage]);

  const formatPrice = (price: number) =>
    price.toFixed(2).replace('.', ',') + ' zł';

  const handleButtonClick = async () => {
    if (isCheckoutPage) {
      // Prevent multiple clicks if already processing
      if (localLoading) return;
      // Disable the button immediately
      setLocalLoading(true);
      try {
        await onCheckout();
      } catch (error) {
        console.error('Error during checkout:', error);
      } finally {
        // Keep the button disabled for 10 seconds
        setTimeout(() => {
          setLocalLoading(false);
        }, 10000);
      }
    } else {
      router.push('/checkout');
    }
  };

  return (
    <aside
      className={`${isCheckoutPage ? 'w-full mt-8 md:rounded-[24px]' : ' rounded-[24px] lg:w-4/12 mt-8'
        } bg-beige p-6  shadow-lg`}
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
            <p className="text-end">
              {formatPrice(
                isCheckoutPage ? totalPrice + shippingPrice : totalPrice,
              )}
            </p>
          )}
          <span className="text-sm text-black font-light">
            <p>kwota zawiera 23% VAT</p>
          </span>
        </span>
      </div>

      <button
        onClick={handleButtonClick}
        disabled={localLoading}
        className={`w-full py-4 bg-black text-white text-lg font-light rounded-full hover:bg-neutral-dark transition-colors ${localLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {localLoading
          ? 'Przetwarzanie...'
          : isCheckoutPage
            ? 'Zamawiam i Płacę'
            : 'Przejdź do kasy'}
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
