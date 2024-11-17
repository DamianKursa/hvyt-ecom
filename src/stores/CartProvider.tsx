import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  cartKey: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
  image: string | { sourceUrl?: string; title: string };
  productId: number;
  attributes?: { [key: string]: string };
  variationOptions?: { [key: string]: string[] }; // Added for variations
}

export interface Cart {
  products: Product[];
  totalProductsCount: number;
  totalProductsPrice: number;
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
}

export const CartContext = createContext<CartContextProps>({
  cart: { products: [], totalProductsCount: 0, totalProductsPrice: 0 },
  addCartItem: () => {},
  updateCartItem: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  updateCartVariation: () => {},
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

  useEffect(() => {
    localStorage.setItem('woocommerce-cart', JSON.stringify(cart));
  }, [cart]);

  const recalculateCartTotals = (updatedCart: Cart) => {
    const totalProductsPrice = updatedCart.products.reduce(
      (total, product) => total + product.totalPrice,
      0,
    );
    const totalProductsCount = updatedCart.products.reduce(
      (count, product) => count + product.qty,
      0,
    );

    return { ...updatedCart, totalProductsPrice, totalProductsCount };
  };

  const normalizeProductImage = (image: string | { sourceUrl?: string }) =>
    typeof image === 'string'
      ? image
      : image?.sourceUrl || '/fallback-image.jpg';

  const addCartItem = (product: Product) => {
    console.log('Adding Product to Cart:', product); // Debugging log
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const normalizedProduct = {
        ...product,
        image: normalizeProductImage(product.image),
        variationOptions: product.variationOptions || {}, // Ensure variation options are passed
      };
      const existingProduct = updatedCart.products.find(
        (item) => item.cartKey === product.cartKey,
      );

      if (existingProduct) {
        existingProduct.qty += normalizedProduct.qty;
        existingProduct.totalPrice += normalizedProduct.totalPrice;
      } else {
        updatedCart.products.push(normalizedProduct);
      }

      return recalculateCartTotals(updatedCart);
    });
  };

  const updateCartVariation = (
    cartKey: string,
    name: string,
    newVariation: string,
  ) => {
    console.log(`Updating variation for ${name} to ${newVariation}`); // Debugging log
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

      return recalculateCartTotals(updatedCart);
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addCartItem,
        updateCartItem: () => {},
        removeCartItem: () => {},
        clearCart: () => {},
        updateCartVariation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
