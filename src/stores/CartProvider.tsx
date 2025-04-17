// CartProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

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
  attributes?: { [key: string]: string };
  variationOptions?: { [key: string]: { option: string; price: number }[] };
  baselinker_variations?: {
    id: number;
    price: number;
    attributes: { name: string; option: string }[];
  }[];
  availableStock?: number;
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
    newVariationId?: number,
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
    newVariationId?: number,
  ) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const product = updatedCart.products.find(
        (item) => item.cartKey === cartKey,
      );
      if (product) {
        // Clean the attribute name (for example, "Rozstaw")
        const cleanedName = name.replace(/^Atrybut produktu:\s*/, '').trim();

        // Get the current attributes, defaulting to an empty object if undefined.
        const attributes = product.attributes ?? {};

        // Remove any keys that match the cleaned attribute.
        Object.keys(attributes).forEach((attrKey) => {
          const currentCleaned = attrKey
            .replace(/^Atrybut produktu:\s*/, '')
            .trim();
          if (currentCleaned.toLowerCase() === cleanedName.toLowerCase()) {
            delete attributes[attrKey];
          }
        });

        // Update the product attributes with the cleaned key.
        product.attributes = {
          ...attributes,
          [cleanedName]: newVariation,
        };

        // Update product price if newPrice is provided.
        if (typeof newPrice !== 'undefined') {
          product.price = newPrice;
          product.totalPrice = newPrice * product.qty;
        }

        // Update the variation ID if a new one is provided.
        if (newVariationId) {
          product.variationId = newVariationId;
          product.cartKey = newVariationId.toString();
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
