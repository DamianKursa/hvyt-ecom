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
    name: string,
    newVariation: string,
    newPrice?: number,
  ) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
}

export const CartContext = createContext<CartContextProps>({
  cart: { products: [], totalProductsCount: 0, totalProductsPrice: 0 },
  addCartItem: () => {},
  updateCartItem: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  updateCartVariation: () => {},
  applyCoupon: () => {},
  removeCoupon: () => {},
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
    name: string,
    newVariation: string,
    newPrice?: number,
  ) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const product = updatedCart.products.find(
        (item) => item.cartKey === cartKey,
      );

      if (product) {
        const cleanName = name.replace(/^Atrybut produktu:\s*/, '').trim();

        product.attributes = {
          ...product.attributes,
          [cleanName]: newVariation,
        };

        if (typeof newPrice !== 'undefined') {
          product.price = newPrice;
          product.totalPrice = newPrice * product.qty;
        }

        product.variationOptions = product.variationOptions || {};

        return recalculateCartTotals(updatedCart);
      }

      return prevCart;
    });
  };

  const removeCartItem = (cartKey: string) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        products: prevCart.products.filter((item) => item.cartKey !== cartKey),
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
