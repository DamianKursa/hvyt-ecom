import React, { useState, useContext } from 'react';
import { CartContext } from '@/stores/CartProvider';

interface DiscountCodeProps {
  cartTotal: number;
  setCartTotal: React.Dispatch<React.SetStateAction<number>>;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({
  cartTotal,
  setCartTotal,
}) => {
  const { applyCoupon, removeCoupon, cart } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(cart?.coupon?.code || '');
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>({ message: '', type: 'success', visible: false });
  const [isLoading, setIsLoading] = useState(false);
  const handleApplyCode = async () => {
    if (!code.trim()) {
      setSnackbar({
        message: 'Proszę wprowadzić kod rabatowy',
        type: 'error',
        visible: true,
      });
      return;
    }

    setIsLoading(true);
    setSnackbar((prev) => ({ ...prev, visible: false }));

    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), cartTotal }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setSnackbar({
          message: data.message || 'Niepoprawny kod rabatowy',
          type: 'error',
          visible: true,
        });
        return;
      }

      const { discountValue, discountType } = data;

      let discountApplied = 0;
      if (discountType === 'percent') {
        discountApplied = (cartTotal * discountValue) / 100;
      } else if (discountType === 'fixed') {
        discountApplied = discountValue;
      }

      applyCoupon({ code, discountValue: discountApplied, discountType });
      setCartTotal(cartTotal - discountApplied);

      setSnackbar({
        message: 'Kod rabatowy został dodany',
        type: 'success',
        visible: true,
      });
    } catch (error) {
      console.error('Error validating discount code:', error);
      setSnackbar({
        message: 'Wystąpił błąd. Spróbuj ponownie później.',
        type: 'error',
        visible: true,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  const handleRemoveCode = () => {
    setCode('');
    removeCoupon();
    setSnackbar({
      message: 'Kod rabatowy został usunięty',
      type: 'success',
      visible: true,
    });
    setTimeout(
      () => setSnackbar((prev) => ({ ...prev, visible: false })),
      3000,
    );
  };

  return (
    <div
      className={`border ${
        isOpen
          ? 'border-2 border-dark-pastel-red rounded-[24px] bg-beige-light'
          : 'border-neutral-light rounded-[24px]'
      } px-4 py-3 transition-all duration-300 ease-in-out mb-[33px]`}
    >
      {/* Dropdown Header */}
      <button
        className="flex justify-between items-center w-full text-lg font-medium text-neutral-darkest focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="discount-input-section"
      >
        <div className="flex items-center">
          <img
            src="/icons/discount.svg"
            alt="Discount Icon"
            className="w-5 h-5 mr-2"
          />
          Posiadasz kod rabatowy?
        </div>
        <img
          src={`/icons/arrow-${isOpen ? 'up' : 'down'}.svg`}
          alt="Toggle Icon"
          className="w-4 h-4"
        />
      </button>

      {/* Expanded Input Section */}
      {isOpen && (
        <div id="discount-input-section" className="mt-4">
          {cart?.coupon ? (
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
              <span className="text-neutral-darkest font-medium">
                Kod: {cart.coupon.code}
              </span>
              <button
                onClick={handleRemoveCode}
                className="text-red-500 hover:underline text-sm"
              >
                Usuń kod
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <input
                id="discount-code"
                type="text"
                placeholder="Wpisz kod"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent border-b border-neutral-light placeholder-black text-neutral-darkest focus:outline-none px-2"
                disabled={isLoading}
              />
              <button
                onClick={handleApplyCode}
                className={`ml-4 px-4 py-2 border ${
                  !code.trim()
                    ? 'border-neutral-light text-neutral-light'
                    : 'border-black text-black'
                } rounded-full focus:outline-none ${
                  !code.trim() || isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={!code.trim() || isLoading}
              >
                {isLoading ? 'Ładowanie...' : 'Zapisz'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inline Message for Success or Error */}
      {snackbar.visible && (
        <div
          className={`mt-4 px-4 py-2 rounded-lg flex items-center ${
            snackbar.type === 'success' ? 'bg-[#2A5E45]' : 'bg-red-500'
          } text-white`}
        >
          <span>{snackbar.message}</span>
        </div>
      )}
    </div>
  );
};

export default DiscountCode;
