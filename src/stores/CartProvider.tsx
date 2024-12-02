import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  cartKey: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
  image: string;
  productId: number;
  attributes?: { [key: string]: string };
  variationOptions?: { [key: string]: string[] };
}

export interface Coupon {
  code: string;
  discountValue: number;
}

export interface Cart {
  products: Product[];
  totalProductsCount: number;
  totalProductsPrice: number;
  coupon?: Coupon; // Include coupon in cart
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
  ) => void;
  applyCoupon: (coupon: Coupon) => void; // Add method to apply coupon
  removeCoupon: () => void; // Add method to remove coupon
}

export const CartContext = createContext<CartContextProps>({
  cart: { products: [], totalProductsCount: 0, totalProductsPrice: 0 },
  addCartItem: () => {},
  updateCartItem: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  updateCartVariation: () => {},
  applyCoupon: () => {}, // Initialize coupon methods
  removeCoupon: () => {}, // Initialize coupon methods
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>({
    products: [],
    totalProductsCount: 0,
    totalProductsPrice: 0,
  });

  // Load the cart (including coupon) from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('woocommerce-cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save the entire cart, including the coupon, to localStorage
  useEffect(() => {
    localStorage.setItem('woocommerce-cart', JSON.stringify(cart));
  }, [cart]);

  const recalculateCartTotals = (updatedCart: Cart) => {
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
        updatedCart.products.push(product);
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
  ) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const product = updatedCart.products.find(
        (item) => item.cartKey === cartKey,
      );

      if (product) {
        product.attributes = {
          ...product.attributes,
          [name]: newVariation,
        };
      }

      return updatedCart;
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
