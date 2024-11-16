import React from 'react';

interface CartSummaryProps {
  totalProductsPrice: number;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalProductsPrice,
  onCheckout,
}) => {
  const formatPrice = (price: number) =>
    price.toFixed(2).replace('.', ',') + ' zł';

  return (
    <aside
      className="lg:w-4/12 bg-beige p-6 mt-8 rounded-[24px] shadow-lg"
      style={{ maxHeight: '400px' }}
    >
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-neutral-darkest">
        Podsumowanie
      </h2>

      {/* Total Products */}
      <div className="flex justify-between text-lg mb-6">
        <span className="text-neutral-darkest font-medium">Razem produkty</span>
        <span className="font-semibold text-neutral-darkest">
          {formatPrice(totalProductsPrice)}
        </span>
      </div>

      {/* Discount Code Section */}
      <div className="mb-6">
        <label
          htmlFor="discount-code"
          className="flex items-center text-lg font-medium text-neutral-darkest"
        >
          <img
            src="/icons/discount.svg"
            alt="Discount Icon"
            className="w-5 h-5 mr-2"
          />
          Posiadasz kod rabatowy?
        </label>
        <input
          id="discount-code"
          type="text"
          placeholder="Wpisz kod"
          className="mt-3 w-full border border-neutral-light rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neutral-light"
        />
      </div>

      {/* Total Price Section */}
      <div className="flex justify-between items-top mb-6">
        <div className="flex flex-col">
          <span className="text-lg text-neutral-darkest font-medium">Suma</span>
        </div>
        <span className="text-2xl font-bold text-dark-pastel-red">
          {formatPrice(totalProductsPrice)}
          <span className="text-sm text-black font-light">
            <p>kwota zawiera 23% VAT</p>
          </span>
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-neutral-dark transition"
      >
        Przejdź do kasy
      </button>
    </aside>
  );
};

export default CartSummary;
