// Layout.tsx
import React, { ReactNode, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

// Components
import Header from '@/components/Header/Header.component';
import Footer from '@/components/Footer/Footer.component';

// State
import { CartContext } from '@/stores/CartProvider';
import { getFormattedCart } from '@/utils/functions/functions';
import { GET_CART } from '@/utils/gql/GQL_QUERIES';

interface ILayoutProps {
  children?: ReactNode;
  title: string;
}

const Layout = ({ children, title }: ILayoutProps) => {
  const { setCart } = useContext(CartContext);
  const router = useRouter();

  // Define fixed pages and dynamic category slugs for full width
  const noMarginPages = ['/', '/o-nas', '/hvyt-objects'];
  const fullWidthCategories = ['uchwyty-meblowe', 'klamki', 'wieszaki']; // Add category slugs here

  // Check if the current route should have full-width hero or layout
  const isFullWidthHero =
    noMarginPages.includes(router.pathname) ||
    fullWidthCategories.some((slug) => router.asPath.includes(`/${slug}`));

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const updatedCart = getFormattedCart(data);
      if (updatedCart) {
        localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Header title={title} />

      <main
        className={
          isFullWidthHero
            ? 'w-full sm:px-4 md:px-0'
            : 'container mx-auto max-w-[1440px] mt-0 lg:mt-[115px] py-16'
        }
      >
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Layout;
