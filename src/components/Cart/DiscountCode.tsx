import React, { useState } from 'react';
import Snackbar from '@/components/UI/Snackbar.component'; // Adjust the path to your Snackbar component
import { validateDiscountCode } from '@/utils/api/woocommerce'; // Adjust the path as needed

interface DiscountCodeProps {
  cartTotal: number;
  setCartTotal: (value: number) => void;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({
  cartTotal,
  setCartTotal,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Toggle input visibility
  const [code, setCode] = useState('');
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>({ message: '', type: 'success', visible: false });
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyCode = async () => {
    if (!code) {
      setSnackbar({
        message: 'Proszę wprowadzić kod rabatowy',
        type: 'error',
        visible: true,
      });
      return;
    }

    setIsLoading(true);
    setSnackbar({ ...snackbar, visible: false }); // Hide previous messages

    try {
      const { valid, discountValue } = await validateDiscountCode(code);

      if (valid) {
        setDiscount(discountValue);
        setCartTotal(cartTotal - discountValue);
        setSnackbar({
          message: 'Kod rabatowy został dodany',
          type: 'success',
          visible: true,
        });
      } else {
        setDiscount(0);
        setSnackbar({
          message: 'Podany kod nie istnieje',
          type: 'error',
          visible: true,
        });
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      setSnackbar({
        message: 'Wystąpił błąd. Spróbuj ponownie później.',
        type: 'error',
        visible: true,
      });
    } finally {
      setIsLoading(false);
      // Automatically hide the snackbar after 3 seconds
      setTimeout(() => setSnackbar({ ...snackbar, visible: false }), 3000);
    }
  };

  return (
    <div
      className={`border ${
        isOpen
          ? 'border-2 border-dark-pastel-red rounded-[24px] bg-white'
          : 'border-neutral-light rounded-full'
      } px-4 py-3 transition-all duration-300 ease-in-out mb-[33px]`}
    >
      {/* Dropdown Header */}
      <button
        className="flex justify-between items-center w-full text-lg font-medium text-neutral-darkest focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
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
        <div className="mt-4 flex items-center">
          {/* Input Field */}
          <input
            id="discount-code"
            type="text"
            placeholder="Wpisz kod"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent border-b border-neutral-light placeholder-black text-neutral-darkest focus:outline-none px-2"
            disabled={isLoading}
          />

          {/* Button */}
          <button
            onClick={handleApplyCode}
            className={`ml-4 px-4 py-2 border border-black text-black rounded-full focus:outline-none ${
              !code ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!code || isLoading}
          >
            {isLoading ? 'Ładowanie...' : 'Zapisz'}
          </button>
        </div>
      )}

      {/* Snackbar for Messages */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        visible={snackbar.visible}
      />
    </div>
  );
};

export default DiscountCode;
