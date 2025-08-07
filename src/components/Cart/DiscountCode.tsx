import React, { useState, useContext, useEffect } from 'react';
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
  const [codeError, setCodeError] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>({ message: '', type: 'success', visible: false });
  const [isLoading, setIsLoading] = useState(false);

  const coupon = cart?.coupon;
  const allowedCats: number[] = coupon?.allowedCats ?? [];

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setCodeError('Uzupełnij kod rabatowy');
      return;
    }
    setCodeError('');

    setIsLoading(true);
    setSnackbar((prev) => ({ ...prev, visible: false }));

    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          cartTotal,
          items: cart!.products.map((item) => ({
            id: item.productId,
            price: item.price,
            quantity: item.qty,
            // send whatever categories you already have (if any)
            categories: item.categories?.map((c) => c.id) || [],
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        console.log('Coupon debug:', data.debug);
        setCodeError(data.message || 'Niepoprawny kod rabatowy');
        return;
      }

      // pull the category restrictions out of the API response
      const {
        discountValue,
        discountType,
        allowedCats = [], // 👈 default to empty array
      } = data;

      // Normalize category ids from API (strings or numbers → numbers)
      const allowedCatIds: number[] = (allowedCats as any[])
        .map((id) => Number(id))
        .filter((n) => Number.isFinite(n));

      // Determine subtotal eligible for discount (respect category restrictions if present)
      const eligibleSubtotal = allowedCatIds.length > 0
        ? cart!.products.reduce((sum, p) => {
          const rawCats: any[] = (p as any).categories || [];
          // Support both shapes: [number] or [{ id, name }]
          const catIds: number[] = rawCats
            .map((c) => (typeof c === 'number' ? c : c?.id))
            .map((id) => Number(id))
            .filter((n) => Number.isFinite(n));

          const inAllowed = catIds.some((id) => allowedCatIds.includes(id));
          return inAllowed ? sum + Number(p.price) * Number(p.qty) : sum;
        }, 0)
        : Number(cartTotal);

      // Compute actually applied discount amount
      const appliedDiscount = discountType === 'percent'
        ? (eligibleSubtotal * Number(discountValue)) / 100
        : Number(discountValue);

      // Clamp to not exceed eligible subtotal
      const appliedDiscountClamped = Math.max(0, Math.min(appliedDiscount, eligibleSubtotal));

      // Store applied amount in context so UI can show it directly
      applyCoupon({
        code,
        discountValue: appliedDiscountClamped,
        discountType,
        allowedCats,
      });

      setCodeError('');

      // Update local total (defensively keep it ≥ 0)
      setCartTotal((prev) => Math.max(prev - appliedDiscountClamped, 0));

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
      setTimeout(
        () => setSnackbar((prev) => ({ ...prev, visible: false })),
        3000,
      );
    }
  };

  const handleRemoveCode = () => {
    // restore total by adding back the applied discount, if known
    const back = Number(cart?.coupon?.discountValue ?? 0);
    if (back) {
      setCartTotal((prev) => Math.max(prev + back, 0));
    }

    setCode('');
    removeCoupon();
    setSnackbar({
      message: 'Kod rabatowy został usunięty',
      type: 'success',
      visible: true,
    });
    // Close the panel after removal
    setIsOpen(false);
    setTimeout(
      () => setSnackbar((prev) => ({ ...prev, visible: false })),
      3000,
    );
  };
  useEffect(() => {
    // 1) Guard: if there's no cart or no coupon, bail out
    if (!cart?.coupon) return;

    // 2) Only consider category‐restricted coupons
    const allowedCats = cart.coupon.allowedCats || [];
    if (allowedCats.length === 0) return;

    // 3) Check if any product still matches one of those categories
    const stillHas = cart.products.some((p) =>
      p.categories?.some((cat) => allowedCats.includes(cat.id)),
    );

    // 4) If not, clear the coupon
    if (!stillHas) {
      removeCoupon();
      setCode('');
      setCartTotal(cart.totalProductsPrice);
      setSnackbar({
        message: 'Kod rabatowy usunięty – brak produktów z wymaganej kategorii',
        type: 'error',
        visible: true,
      });
      setTimeout(
        () => setSnackbar((prev) => ({ ...prev, visible: false })),
        3000,
      );
    }
  }, [
    // 5) DEP: only watch cart?.products
    cart?.products,
  ]);

  return (
    <>
      <div
        className={`border border-[#DAD3C8] rounded-[24px] px-4 py-3 transition-all duration-300 ease-in-out mb-[33px] ${cart?.coupon ? 'bg-beige' : isOpen ? 'bg-white' : 'bg-beige'}`}
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
              <div className="p-2 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-darkest font-medium">
                    {cart.coupon.code}
                  </span>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setIsOpen(true)} className="focus:outline-none">
                      <img src="/icons/edit.svg" alt="Edit" className="w-5 h-5" />
                    </button>
                    <button onClick={handleRemoveCode} className="focus:outline-none">
                      <img src="/icons/trash-black.svg" alt="Remove" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-row items-center gap-4">
                  <input
                    id="discount-code"
                    type="text"
                    placeholder="Wpisz kod"
                    value={code}
                    onChange={e => {
                      setCode(e.target.value);
                      if (codeError) setCodeError('');
                    }}
                    disabled={isLoading}
                    className={`w-1/2 md:flex-1 border-b ${codeError ? 'border-[#A83232]' : 'border-neutral'} focus:border-black outline-none px-2 py-2`}
                  />
                  <button
                    onClick={handleApplyCode}
                    disabled={!code.trim() || isLoading}
                    className={`w-1/2 md:w-auto md:ml-4 px-4 py-2 border ${(!code.trim() || isLoading) ? 'border-neutral-light text-neutral-light' : 'border-black text-black'} rounded-full focus:outline-none ${(!code.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Ładowanie...' : 'Zapisz'}
                  </button>
                </div>
                {codeError && (
                  <div className="flex items-center text-[#A83232] text-sm mt-1">
                    <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
                    <span>{codeError}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {cart?.coupon?.discountValue != null && (
        <div className="flex justify-between items-center">
          <span className="text-neutral-darkest font-medium">Wartość rabatu</span>
          <span className="font-semibold text-neutral-darkest">
            {Number(cart.coupon.discountValue).toFixed(2)} zł
          </span>
        </div>
      )}

      {/* Inline Message for Success or Error */}
      {snackbar.visible && (
        <div
          className={`mt-4 mb-4 px-4 py-2 rounded-lg flex items-center ${snackbar.type === 'success' ? 'bg-[#2A5E45]' : 'bg-red-500'} text-white`}
        >
          {snackbar.type === 'success' && (
            <img src="/icons/circle-check.svg" alt="Success" className="w-4 h-4 mr-2" />
          )}
          <span>{snackbar.message}</span>
        </div>
      )}
    </>
  );
};

export default DiscountCode;
