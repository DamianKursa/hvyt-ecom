// Layout.tsx
import React, { ReactNode, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Components
import Header from '@/components/Header/Header.component';
import Footer from '@/components/Footer/Footer.component';

// State
import { CartContext } from '@/stores/CartProvider';

interface ILayoutProps {
  children?: ReactNode;
  title: string;
}

const Layout: React.FC<ILayoutProps> = ({ children, title }) => {
  const { cart, addCartItem } = useContext(CartContext);
  const router = useRouter();

  // Define routes for full-width or modified layout
  const noMarginPages = ['/', '/o-nas', '/hvyt-objects', '/blog'];
  const fullWidthCategories = ['uchwyty-meblowe', 'klamki', 'wieszaki'];

  const isFullWidthHero =
    noMarginPages.includes(router.pathname) ||
    fullWidthCategories.some((slug) => router.asPath.includes(`/${slug}`));

  // Load cart from localStorage and sync with context if needed
  useEffect(() => {
    if (!cart) {
      const storedCart = localStorage.getItem('woocommerce-cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);

        // Check if parsedCart.products is an array and add items to the cart
        if (Array.isArray(parsedCart.products)) {
          parsedCart.products.forEach((product: any) => {
            addCartItem(product);
          });
        }
      }
    }
  }, [cart, addCartItem]);

  return (
    <>
      <Header title={title} />

      <main
        className={
          isFullWidthHero
            ? 'w-full sm:px-4 md:px-0'
            : 'container mx-auto max-w-[1440px] mt-0 lg:mt-[88px] py-16'
        }
      >
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Layout;
