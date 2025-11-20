import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '@/stores/CartProvider';

const toNum = (v: any): number => {
  if (v === null || v === undefined) return NaN;
  const s = String(v).replace(/\s|\u00A0|zł|PLN/gi, '').replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

type CouponRules = {
  allowedCats: number[];
  allowedProductIds: number[];
  applicableProductIds: number[];
  eligibleProductIds: number[];
  excludedCats: number[];
  excludedProductIds: number[];
  excludeSaleItems: boolean;
  excludeCategoriesOnSale: number[];
};

const normalizeNumberArray = (input: any): number[] => {
  if (!Array.isArray(input)) return [];

  return Array.from(
    new Set(
      input
        .map((value) => {
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : NaN;
          }
          if (value && typeof value === 'object') {
            const maybe =
              (value as any).id ??
              (value as any).term_id ??
              (value as any).value ??
              (value as any).slug ??
              value;
            if (typeof maybe === 'number') {
              return maybe;
            }
            if (typeof maybe === 'string') {
              const parsed = Number(maybe);
              return Number.isFinite(parsed) ? parsed : NaN;
            }
          }
          return NaN;
        })
        .filter((n): n is number => Number.isFinite(n)),
    ),
  );
};

const getProductCategoryIds = (product: any): number[] => {
  if (!product || !Array.isArray(product.categories)) return [];
  return normalizeNumberArray(
    product.categories.map((cat: any) => {
      if (typeof cat === 'number') return cat;
      if (cat && typeof cat === 'object') {
        return cat.id ?? cat.term_id ?? cat.value ?? cat.slug ?? cat;
      }
      return cat;
    }),
  );
};

const isProductOnSale = (product: any): boolean => {
  if (!product) return false;
  if (product.on_sale === true || product.on_sale === 'true') return true;

  const price = toNum(product.price);
  const regular = toNum(product.regular_price ?? product.price);
  const salePrice = toNum(product.sale_price);

  if (Number.isFinite(salePrice) && salePrice > 0) {
    if (!Number.isFinite(regular)) return true;
    if (salePrice < (regular as number)) return true;
  }
  if (Number.isFinite(price) && Number.isFinite(regular) && price < regular) {
    return true;
  }
  return false;
};

const matchesCouponRules = (
  product: any,
  rules: CouponRules,
  options: { ignoreSale?: boolean } = {},
): boolean => {
  if (!product) return false;
  const pid = Number(product.productId ?? product.id);
  if (!Number.isFinite(pid)) return false;

  const {
    allowedCats,
    allowedProductIds,
    applicableProductIds,
    excludedCats,
    excludedProductIds,
    excludeSaleItems,
    excludeCategoriesOnSale,
    eligibleProductIds,
  } = rules;

  if (excludedProductIds.length && excludedProductIds.includes(pid)) {
    return false;
  }

  if (allowedProductIds.length && !allowedProductIds.includes(pid)) {
    return false;
  }

  if (!options.ignoreSale && eligibleProductIds.length && !eligibleProductIds.includes(pid)) {
    return false;
  }

  if (
    applicableProductIds.length &&
    !applicableProductIds.includes(pid) &&
    allowedProductIds.length === 0 &&
    allowedCats.length === 0
  ) {
    return false;
  }

  const categoryIds = getProductCategoryIds(product);

  if (excludedCats.length && categoryIds.some((id) => excludedCats.includes(id))) {
    return false;
  }

  if (allowedCats.length && !categoryIds.some((id) => allowedCats.includes(id))) {
    return false;
  }

  if (!options.ignoreSale) {
    const sale = isProductOnSale(product);
    if (excludeSaleItems && sale) {
      return false;
    }
    if (
      excludeCategoriesOnSale.length &&
      sale &&
      categoryIds.some((id) => excludeCategoriesOnSale.includes(id))
    ) {
      return false;
    }
  }

  return true;
};

const filterEligibleProducts = (
  products: any[] | undefined,
  rules: CouponRules,
  options: { ignoreSale?: boolean } = {},
) => {
  if (!Array.isArray(products)) return [];
  return products.filter((product) => matchesCouponRules(product, rules, options));
};

const buildRulesFromCouponData = (data: any): CouponRules => {
  const allowedCats = normalizeNumberArray(data?.allowedCats ?? data?.allowed_categories ?? []);
  const allowedProductIds = normalizeNumberArray(
    data?.allowedProductIds ?? data?.allowed_products ?? [],
  );
  const applicableProductIds = normalizeNumberArray(
    data?.applicableProductIds ??
      (allowedProductIds.length ? allowedProductIds : data?.eligibleProductIds ?? []),
  );
  const eligibleProductIds = normalizeNumberArray(data?.eligibleProductIds ?? []);
  const excludedCats = normalizeNumberArray(data?.excludedCats ?? []);
  const excludedProductIds = normalizeNumberArray(data?.excludedProductIds ?? []);
  const excludeSaleItems = Boolean(
    data?.excludeSaleItems ?? data?.exclude_sale_items ?? false,
  );
  const excludeCategoriesOnSale = normalizeNumberArray(
    data?.excludeCategoriesOnSale ??
      data?.exclude_categories_on_sale ??
      [],
  );

  return {
    allowedCats,
    allowedProductIds,
    applicableProductIds,
    eligibleProductIds,
    excludedCats,
    excludedProductIds,
    excludeSaleItems,
    excludeCategoriesOnSale,
  };
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
  const couponRules = React.useMemo(
    () => (coupon ? buildRulesFromCouponData(coupon) : buildRulesFromCouponData({})),
    [coupon],
  );

  const productsMatchingRules = React.useMemo(
    () =>
      coupon ? filterEligibleProducts(cart?.products, couponRules) : [],
    [cart?.products, coupon, couponRules],
  );

  const productsMatchingRulesIgnoringSale = React.useMemo(
    () =>
      coupon
        ? filterEligibleProducts(cart?.products, couponRules, { ignoreSale: true })
        : [],
    [cart?.products, coupon, couponRules],
  );

  useEffect(() => {
    if (!cart?.coupon) return;
    if (productsMatchingRules.length > 0) return;

    removeCoupon();
    setCode('');
    setCartTotal(cart.totalProductsPrice);

    const hadMatchesIgnoringSale = productsMatchingRulesIgnoringSale.length > 0;
    const saleRestrictionActive =
      couponRules.excludeSaleItems ||
      (couponRules.excludeCategoriesOnSale?.length ?? 0) > 0;
    const message =
      saleRestrictionActive && hadMatchesIgnoringSale
        ? 'Kod nie działa na produkty z promocji — usunięto.'
        : 'Kod rabatowy usunięty – brak produktów spełniających warunki';

    setSnackbar({ message, type: 'error', visible: true });
    const timeout = setTimeout(
      () => setSnackbar((prev) => ({ ...prev, visible: false })),
      3000,
    );

    return () => clearTimeout(timeout);
  }, [
    cart?.coupon,
    cart?.products,
    cart?.totalProductsPrice,
    couponRules,
    productsMatchingRules.length,
    productsMatchingRulesIgnoringSale.length,
    removeCoupon,
    setCartTotal,
  ]);

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

    const sanitizedCode = code.trim();

    setIsLoading(true);
    setSnackbar((prev) => ({ ...prev, visible: false }));

    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: sanitizedCode,
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
        const msg =
          data?.debug === 'only_sale_products_in_scope'
            ? 'Kod nie działa na produkty z promocji.'
            : data.message || 'Niepoprawny kod rabatowy';
        setCodeError(msg);
        setSnackbar({ message: msg, type: 'error', visible: true });
        return;
      }

      const { discountValue, discountType } = data;
      const rulesFromApi = buildRulesFromCouponData(data);

      const eligibleProducts = filterEligibleProducts(
        cart!.products,
        rulesFromApi,
      );
      const eligibleProductsIgnoringSale = filterEligibleProducts(
        cart!.products,
        rulesFromApi,
        { ignoreSale: true },
      );

      const saleRestrictionActive =
        rulesFromApi.excludeSaleItems ||
        (rulesFromApi.excludeCategoriesOnSale?.length ?? 0) > 0;
      const saleOnly =
        saleRestrictionActive &&
        eligibleProductsIgnoringSale.length > eligibleProducts.length;
      const noMatchMessage = saleOnly
        ? 'Kod nie działa na produkty z promocji.'
        : 'Brak produktów spełniających warunki kodu.';

      if (!eligibleProducts.length) {
        setCodeError(noMatchMessage);
        setSnackbar({ message: noMatchMessage, type: 'error', visible: true });
        return;
      }

      const eligibleSubtotal = eligibleProducts.reduce((sum, p: any) => {
        const price = Number(p.price);
        const qty = Number(p.qty);
        if (!Number.isFinite(price) || !Number.isFinite(qty)) {
          return sum;
        }
        return sum + price * qty;
      }, 0);

      if (!Number.isFinite(eligibleSubtotal) || eligibleSubtotal <= 0) {
        setCodeError(noMatchMessage);
        setSnackbar({ message: noMatchMessage, type: 'error', visible: true });
        return;
      }

      const numericDiscount = Number(discountValue);
      const appliedDiscount =
        discountType === 'percent'
          ? (eligibleSubtotal * numericDiscount) / 100
          : numericDiscount;

      const appliedDiscountClamped = Math.max(
        0,
        Math.min(appliedDiscount, eligibleSubtotal),
      );

      if (!Number.isFinite(appliedDiscountClamped) || appliedDiscountClamped <= 0) {
        setCodeError(noMatchMessage);
        setSnackbar({ message: noMatchMessage, type: 'error', visible: true });
        return;
      }

      applyCoupon({
        code: sanitizedCode,
        discountValue: appliedDiscountClamped,
        discountType,
        allowedCats: rulesFromApi.allowedCats,
        allowedProductIds: rulesFromApi.allowedProductIds,
        applicableProductIds: rulesFromApi.applicableProductIds,
        eligibleProductIds: rulesFromApi.eligibleProductIds,
        excludedCats: rulesFromApi.excludedCats,
        excludedProductIds: rulesFromApi.excludedProductIds,
        excludeSaleItems: rulesFromApi.excludeSaleItems,
        excludeCategoriesOnSale: rulesFromApi.excludeCategoriesOnSale,
      });
      setIsEditing(false);

      setCodeError('');

      // Update local total (defensively keep it ≥ 0)
      setCartTotal((prev) => Math.max(prev - appliedDiscountClamped, 0));

      const limitedDiscount =
        eligibleProducts.length < (cart?.products?.length ?? 0);
      const eligibleNames = eligibleProducts
        .map((p: any) => p.name)
        .filter(Boolean);
      const formattedNames =
        eligibleNames.length > 0
          ? eligibleNames.slice(0, 3).join(', ') +
            (eligibleNames.length > 3 ? '…' : '')
          : '';
      const successMessage =
        limitedDiscount && formattedNames
          ? `Kod rabatowy został dodany - rabat naliczono dla: ${formattedNames}.`
          : 'Kod rabatowy został dodany';

      setSnackbar({
        message: successMessage,
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
