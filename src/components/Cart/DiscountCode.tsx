import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '@/stores/CartProvider';

const toNum = (v: any): number => {
  if (v === null || v === undefined) return NaN;
  const s = String(v).replace(/\s|\u00A0|zł|PLN/gi, '').replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

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
  const [isEditing, setIsEditing] = useState(false);

  const coupon = cart?.coupon;
  const allowedCats: number[] = coupon?.allowedCats ?? [];

  // Helper: detect if cart has discounted items (on_sale flag or price < regular_price)
  const hasDiscountedItems = React.useCallback(() => {
    if (!cart?.products?.length) return false;
    return cart.products.some((p: any) => {
      const price = toNum(p.price);
      const reg = toNum(p.regular_price);
      const salePrice = toNum(p.sale_price ?? 0);
      if (p.on_sale === true || p.on_sale === 'true') return true;
      // Treat sale_price>0 as discounted even if regular_price is missing
      if (Number.isFinite(salePrice) && salePrice > 0 && (!Number.isFinite(reg) || salePrice < reg)) return true;
      if (Number.isFinite(price) && Number.isFinite(reg) && price < reg) return true;
      return false;
    });
  }, [cart?.products]);

  useEffect(() => {
    if (!cart?.coupon) return;
    if (hasDiscountedItems()) {
      removeCoupon();
      setCode('');
      setCartTotal(cart.totalProductsPrice);
      setSnackbar({ message: 'Kod nie działa na produkty z promocji — usunięto.', type: 'error', visible: true });
      const t = setTimeout(() => setSnackbar(prev => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [cart?.products]);

  // Start editing: restore totals, clear coupon, open input with current code
  const handleStartEditing = () => {
    const back = Number(cart?.coupon?.discountValue ?? 0);
    if (back) setCartTotal((prev) => Math.max(prev + back, 0));
    setCode(cart?.coupon?.code || '');
    setCodeError('');
    removeCoupon();
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setCodeError('Uzupełnij kod rabatowy');
      return;
    }
    setCodeError('');

    setIsLoading(true);
    setSnackbar((prev) => ({ ...prev, visible: false }));

    // Early guard: do not allow coupons on promotional items
    if (hasDiscountedItems()) {
      const msg = 'Kod nie działa na produkty z promocji.';
      setCodeError(msg);
      setSnackbar({ message: msg, type: 'error', visible: true });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          cartTotal,
          hasSaleItems: hasDiscountedItems(),
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
        const discounted = hasDiscountedItems();
        const msg = discounted
          ? 'Kod nie działa na produkty z promocji.'
          : (data.message || 'Niepoprawny kod rabatowy');
        setCodeError(msg);
        setSnackbar({ message: msg, type: 'error', visible: true });
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

      // If all (eligible) items are discounted, stop and show message
      const nonSaleSubtotal = cart!.products.reduce((sum, p: any) => {
        const price = Number(p.price);
        const reg = Number(p.regular_price ?? price);
        const salePrice = Number(p.sale_price ?? 0);
        const isOnSale = p.on_sale === true || (salePrice > 0 && salePrice < reg) || price < reg;
        return isOnSale ? sum : sum + price * Number(p.qty);
      }, 0);
      if (nonSaleSubtotal <= 0 && hasDiscountedItems()) {
        const msg = 'Kod nie działa na produkty z promocji.';
        setCodeError(msg);
        return;
      }

      // Compute actually applied discount amount
      const appliedDiscount = discountType === 'percent'
        ? (eligibleSubtotal * Number(discountValue)) / 100
        : Number(discountValue);

      // Clamp to not exceed eligible subtotal
      const appliedDiscountClamped = Math.max(0, Math.min(appliedDiscount, eligibleSubtotal));

      if (appliedDiscountClamped <= 0 && hasDiscountedItems()) {
        const msg = 'Kod nie działa na produkty z promocji.';
        setCodeError(msg);
        return;
      }

      // Store applied amount in context so UI can show it directly
      applyCoupon({
        code,
        discountValue: appliedDiscountClamped,
        discountType,
        allowedCats,
      });
      setIsEditing(false);

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
    setIsEditing(false);
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
          onClick={() =>
            setIsOpen((prev) => {
              const next = !prev;
              if (!next) setIsEditing(false);
              return next;
            })
          }
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
            {(cart?.coupon && !isEditing) ? (
              <div className="p-2 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-darkest font-medium">
                    {cart.coupon.code}
                  </span>
                  <div className="flex items-center space-x-4">
                    <button onClick={handleStartEditing} className="focus:outline-none">
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
                    disabled={!code.trim() || isLoading || hasDiscountedItems()}
                    className={`w-1/2 md:w-auto md:ml-4 px-4 py-2 border ${(!code.trim() || isLoading || hasDiscountedItems()) ? 'border-neutral-light text-neutral-light' : 'border-black text-black'} rounded-full focus:outline-none ${(!code.trim() || isLoading || hasDiscountedItems()) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                {hasDiscountedItems() && !codeError && (
                  <div className="flex items-center text-[#A83232] text-sm mt-1">
                    <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
                    <span>Kod nie działa na produkty z promocji.</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {cart?.coupon?.discountValue != null && (
        <div className="flex justify-between items-center">
          <span className="text-neutral-darkest font-medium text-[18px]">Wartość rabatu</span>
          <span className="font-semibold text-neutral-darkest">
            - {Number(cart.coupon.discountValue).toFixed(2).replace('.', ',')} zł
          </span>
        </div>
      )}

      {/* Inline Message for Success only */}
      {snackbar.visible && snackbar.type === 'success' && (
        <div
          className="mt-4 mb-4 px-4 py-2 rounded-lg flex items-center bg-[#2A5E45] text-white"
        >
          <img src="/icons/circle-check.svg" alt="Success" className="w-4 h-4 mr-2" />
          <span>{snackbar.message}</span>
        </div>
      )}
    </>
  );
};

export default DiscountCode;
