// CartProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Category {
  id: number;
  name: string;
  slug: string;
}
export interface Product {
  cartKey: string;
  name: string;
  qty: number;
  price: number;
  regular_price?: number | string;
  sale_price?: number | string;
  on_sale?: boolean;
  stock_status?: 'instock' | 'outofstock' | string;
  manage_stock?: boolean;
  totalPrice: number;
  image: string;
  productId: number;
  slug?: string;
  variationId?: number;
  categories?: Category[];
  attributes?: { [key: string]: string };
  variationOptions?: { [key: string]: { option: string; price: number }[] };
  baselinker_variations?: {
    id: number;
    price: number;
    image?: { src: string };
    stock_quantity?: string | number | null;
    attributes: { name: string; option: string }[];
  }[];
  availableStock?: number;
  short_description?: string;
  meta_data?: Array<{
    id?: number;
    key: string;
    value: any;
  }>;
  yoast_head_json?: {
    title?: string;
    description?: string;
    canonical?: string;
    [key: string]: any;
  };
}

export interface Coupon {
  code: string;
  discountValue: number;
  discountType?: 'percent' | 'fixed';
  allowedCats?: number[];
}

export interface Cart {
  products: Product[];
  totalProductsCount: number;
  totalProductsPrice: number;
  coupon?: Coupon;
}

interface CartContextProps {
  cart: Cart | null;
  addCartItem: (product: Product) => void;
  updateCartItem: (cartKey: string, quantity: number) => void;
  removeCartItem: (cartKey: string) => void;
  clearCart: () => void;
  updateCartVariation: (
    cartKey: string,
    attributeName: string,
    newValue: string,
    newVariationId: number
  ) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
}

export const CartContext = createContext<CartContextProps>({
  cart: { products: [], totalProductsCount: 0, totalProductsPrice: 0 },
  addCartItem: () => { },
  updateCartItem: () => { },
  removeCartItem: () => { },
  clearCart: () => { },
  updateCartVariation: () => { },
  applyCoupon: () => { },
  removeCoupon: () => { },
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>({
    products: [],
    totalProductsCount: 0,
    totalProductsPrice: 0,
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('woocommerce-cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('woocommerce-cart', JSON.stringify(cart));
  }, [cart]);

  const recalculateCartTotals = (updatedCart: Cart): Cart => {
    const totalProductsPrice = updatedCart.products.reduce(
      (total, product) => total + product.totalPrice,
      0,
    );
    const discountValue = updatedCart.coupon?.discountValue || 0;
    const totalPriceWithDiscount = totalProductsPrice - discountValue;
    const totalProductsCount = updatedCart.products.reduce(
      (count, product) => count + product.qty,
      0,
    );

    return {
      ...updatedCart,
      totalProductsPrice:
        totalPriceWithDiscount >= 0 ? totalPriceWithDiscount : 0,
      totalProductsCount,
    };
  };

  const addCartItem = (product: Product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const existingProduct = updatedCart.products.find(
        (item) => item.cartKey === product.cartKey,
      );

      if (existingProduct) {
        existingProduct.qty += product.qty;
        existingProduct.totalPrice += product.totalPrice;
      } else {
        updatedCart.products.push({
          ...product,
          attributes: product.attributes || {},
          variationOptions: product.variationOptions || {},
          // Persist sale/pricing flags for coupon logic
          regular_price: (product as any).regular_price,
          sale_price: (product as any).sale_price ?? undefined,
          on_sale:
            (product as any).on_sale ?? (() => {
              const toNum = (v: any) => {
                const s = String(v ?? '').replace(/\s|\u00A0|zł|PLN/gi, '').replace(',', '.');
                const n = Number(s);
                return Number.isFinite(n) ? n : NaN;
              };
              const rp = toNum((product as any).regular_price ?? product.price);
              const sp = toNum((product as any).sale_price ?? 0);
              return Number.isFinite(rp) && Number.isFinite(sp) && sp > 0 && sp < rp;
            })(),
          availableStock: typeof product.availableStock !== 'undefined' ? product.availableStock : Number((product as any).stock_quantity ?? 0),
        });
      }

      return recalculateCartTotals(updatedCart);
    });
  };

  const updateCartItem = (cartKey: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const product = updatedCart.products.find(
        (item) => item.cartKey === cartKey,
      );

      if (product) {
        product.qty = quantity;
        product.totalPrice = product.price * quantity;
      }

      return recalculateCartTotals(updatedCart);
    });
  };

  const updateCartVariation = (
    cartKey: string,
    attributeName: string,  // e.g. “Atrybut produktu: Rozstaw”
    newValue: string,       // e.g. “160 mm”
    newVariationId: number  // 12345
  ) => {
    setCart(prev => {
      const updatedCart = { ...prev };

      // 1 find the old line
      const idx = updatedCart.products.findIndex(p => p.cartKey === cartKey);
      if (idx === -1) return prev;

      const oldItem = updatedCart.products[idx];

      // 2 no change? do nothing
      if (oldItem.variationId === newVariationId) return prev;

      // 3 look‑up the full variation chosen in the modal
      const chosen = oldItem.baselinker_variations?.find(
        v => v.id === newVariationId
      );
      if (!chosen) return prev; // safety

      // 4 build the *new* cart line
      const newItem: Product = {
        ...oldItem,
        cartKey: String(chosen.id),      // <- new key
        variationId: chosen.id,
        price: chosen.price,
        totalPrice: chosen.price * oldItem.qty,
        image:
          chosen.image?.src ||
          oldItem.image ||
          '/fallback-image.jpg',
        regular_price: oldItem.regular_price,
        sale_price: oldItem.sale_price,
        on_sale: oldItem.on_sale,
        availableStock: Number(chosen.stock_quantity ?? 0),
        attributes: {
          ...oldItem.attributes,
          [attributeName]: newValue,
        },
      };

      // 5 replace the array element
      updatedCart.products.splice(idx, 1, newItem);
      return recalculateCartTotals(updatedCart);
    });
  };
  const removeCartItem = (cartKey: string) => {
    setCart((prevCart) => {
      const remaining = prevCart.products.filter((p) => p.cartKey !== cartKey);

      let newCoupon = prevCart.coupon;
      if (newCoupon?.allowedCats && newCoupon.allowedCats.length) {
        const stillHas = remaining.some((p) =>
          p.categories?.some((c) => newCoupon!.allowedCats!.includes(c.id)),
        );
        if (!stillHas) {
          newCoupon = undefined;
        }
      }

      const updatedCart = {
        ...prevCart,
        products: remaining,
        coupon: newCoupon,
      };
      return recalculateCartTotals(updatedCart);
    });
  };

  const clearCart = () => {
    setCart({
      products: [],
      totalProductsCount: 0,
      totalProductsPrice: 0,
    });
  };

  const applyCoupon = (coupon: Coupon) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart, coupon };
      return recalculateCartTotals(updatedCart);
    });
  };

  const removeCoupon = () => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart, coupon: undefined };
      return recalculateCartTotals(updatedCart);
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addCartItem,
        updateCartItem,
        removeCartItem,
        clearCart,
        updateCartVariation,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
