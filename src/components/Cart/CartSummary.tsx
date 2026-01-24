import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DiscountCode from '@/components/Cart/DiscountCode';
import { getCurrency, Language } from '@/utils/i18n/config';
import { useI18n } from '@/utils/hooks/useI18n';

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
  disabled = false,
}) => {
  const [totalPrice, setTotalPrice] = useState(totalProductsPrice);
  const [loading, setLoading] = useState(false);
  // Local loading state to disable the button during submission or for timeout
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const { t, getPath } = useI18n();

  const currency = getCurrency(router?.locale as Language ?? 'pl');

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
    price.toFixed(2).replace('.', ',') + ` ${currency.symbol}`;

  const handleButtonClick = async () => {
    if (disabled) return; // twarda blokada, gdy koszyk niepoprawny

    if (isCheckoutPage) {
      if (localLoading) return;
      setLocalLoading(true);
      try {
        await onCheckout();
        setTimeout(() => setLocalLoading(false), 10000);
      } catch (error) {
        setLocalLoading(false);
      }
    } else {
      router.push(getPath('/checkout'));
    }
  };

  return (
    <aside
      className={`${isCheckoutPage ? 'w-full mt-8 md:rounded-[24px]' : ' rounded-[24px] lg:w-4/12 mt-8'
        } bg-beige p-6  shadow-lg`}
    >
      {!isCheckoutPage && (
        <h2 className="text-[32px] font-bold mb-6 text-neutral-darkest">
          {t.cart.summary.title}
        </h2>
      )}

      {isCheckoutPage ? (
        <div className="flex justify-between text-[20px] mb-6">
          <span className="text-neutral-darkest font-bold">{t.cart.summary.productsValue}</span>
          <span className="font-semibold text-neutral-darkest">
            {formatPrice(totalProductsPrice)}
          </span>
        </div>
      ) : (
        <div className="flex justify-between text-[20px] mb-6">
          <span className="text-neutral-darkest font-bold">{t.cart.summary.productsTotal}</span>
          <span className="font-semibold text-neutral-darkest">
            {formatPrice(totalProductsPrice)}
          </span>
        </div>
      )}

      {totalProductsPrice > totalPrice && (
        <div className="flex justify-between text-lg mb-6">
          <span className="text-neutral-darkest font-medium">{t.cart.summary.discountValue}</span>
          <span className="font-semibold text-neutral-darkest">
            {formatPrice(totalProductsPrice - totalPrice)}
          </span>
        </div>
      )}

      <DiscountCode cartTotal={totalPrice} setCartTotal={setTotalPrice} />

      {isCheckoutPage && (
        <div className="flex justify-between text-lg mb-6">
          <span className="text-neutral-darkest font-medium">
            {t.cart.summary.shipping}
          </span>
          <span className="font-semibold text-neutral-darkest">
            {loading ? (
              <div className="loader-pulse w-16 h-6 rounded"></div>
            ) : shippingPrice > 0 ? (
              formatPrice(shippingPrice)
            ) : (
              t.cart.summary.shippingFree
            )}
          </span>
        </div>
      )}

      <div className="flex justify-between items-top mb-6">
        <div className="flex flex-col">
          <span className=" text-neutral-darkest font-medium text-[18px]">{t.cart.summary.total}</span>
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
            <p>{t.cart.summary.vatInfo}</p>
          </span>
        </span>
      </div>

      <button
        onClick={handleButtonClick}
        disabled={localLoading || disabled}
        aria-disabled={disabled}
        className={`w-full py-4 text-white text-lg font-light rounded-full transition-colors
    ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-neutral-dark'}
    ${localLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {localLoading
          ? t.common.processing
          : isCheckoutPage
            ? t.cart.summary.placeOrder
            : t.cart.summary.proceedToCheckout}
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
