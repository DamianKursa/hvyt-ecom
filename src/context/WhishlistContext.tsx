import React, { createContext, useContext, useState } from 'react';

interface Product {
  name: string;
  price: string;
  slug: string;
  images: { src: string }[];
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.find((item) => item.slug === product.slug)
        ? prev
        : [...prev, product],
    );
  };

  const removeFromWishlist = (slug: string) => {
    setWishlist((prev) => prev.filter((item) => item.slug !== slug));
  };

  const isInWishlist = (slug: string) =>
    wishlist.some((item) => item.slug === slug);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
