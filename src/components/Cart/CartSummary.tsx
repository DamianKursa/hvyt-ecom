import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import DiscountCode from '@/components/Cart/DiscountCode'; // Adjust the path if needed

interface CartSummaryProps {
  totalProductsPrice: number;
  onCheckout: () => void; // Trigger order creation
  isCheckoutPage?: boolean; // Flag to determine if it's the checkout page
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalProductsPrice,
  onCheckout,
  isCheckoutPage = false,
}) => {
  const [totalPrice, setTotalPrice] = useState(totalProductsPrice);
  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    setTotalPrice(totalProductsPrice);
  }, [totalProductsPrice]);

  const formatPrice = (price: number) =>
    price.toFixed(2).replace('.', ',') + ' zł';

  const handleButtonClick = () => {
    if (isCheckoutPage) {
      onCheckout();
    } else {
      router.push('/checkout'); // Redirect to the checkout page
    }
  };

  return (
    <aside
      className={`${
        isCheckoutPage ? 'w-full mt-8' : 'lg:w-4/12 mt-8'
      } bg-beige p-6 rounded-[24px] shadow-lg`}
    >
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-neutral-darkest">
        Podsumowanie
      </h2>

      {/* Total Products */}
      <div className="flex justify-between text-lg mb-6">
        <span className="text-neutral-darkest font-medium">
          Wartość produktów
        </span>
        <span className="font-semibold text-neutral-darkest">
          {formatPrice(totalProductsPrice)}
        </span>
      </div>

      {/* Discount Code Section */}
      <DiscountCode cartTotal={totalPrice} setCartTotal={setTotalPrice} />

      {/* Total Price Section */}
      <div className="flex justify-between items-top mb-6">
        <div className="flex flex-col">
          <span className="text-lg text-neutral-darkest font-medium">Suma</span>
        </div>
        <span className="text-2xl font-bold text-dark-pastel-red">
          {formatPrice(totalPrice)}
          <span className="text-sm text-black font-light">
            <p>kwota zawiera 23% VAT</p>
          </span>
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleButtonClick}
        className="w-full py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-neutral-dark transition"
      >
        {isCheckoutPage ? 'Zamawiam i Płacę' : 'Przejdź do kasy'}
      </button>
    </aside>
  );
};

export default CartSummary;
