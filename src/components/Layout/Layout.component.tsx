// components/Layout/Layout.component.tsx
import React, { ReactNode, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header/Header.component';
import Footer from '@/components/Footer/Footer.component';

import { CartContext } from '@/stores/CartProvider';

interface ILayoutProps {
  children?: ReactNode;
  title: string;
  description?: string;
}

const Layout: React.FC<ILayoutProps> = ({ children, title, description }) => {
  const { cart, addCartItem } = useContext(CartContext);
  const router = useRouter();

  const noMarginPages = ['/', '/o-nas', '/hvyt-objects', '/blog', '/kolekcje'];
  const fullWidthCategories = [
    'uchwyty-meblowe',
    'klamki',
    'wieszaki',
    'produkt',
    'meble',
  ];

  const isFullWidthHero =
    noMarginPages.includes(router.pathname) ||
    fullWidthCategories.some((slug) => router.asPath.includes(`/${slug}`));

  useEffect(() => {
    if (!cart) {
      const storedCart = localStorage.getItem('woocommerce-cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
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
      <Head>
        <title>{title}</title>
        {description && (
          <meta
            id="meta-description"
            name="description"
            content={description}
          />
        )}
      </Head>

      <Header title={title} />

      <main
        className={
          isFullWidthHero
            ? 'w-full sm:px-4 md:px-0'
            : 'container mx-auto max-w-[1440px] mt-0 lg:mt-[88px] py-16'
        }
      >
        {children}
        <Analytics />
      </main>

      <Footer />
      <SpeedInsights />
    </>
  );
};

export default Layout;
