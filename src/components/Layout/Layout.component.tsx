import React, {
  ReactNode,
  useContext,
  useEffect,
  Children,
  isValidElement,
} from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import Header from '@/components/Header/Header.component';
import Footer from '@/components/Footer/Footer.component';

import { CartContext } from '@/stores/CartProvider';
import { getFormattedCart } from '@/utils/functions/functions';
import { GET_CART } from '@/utils/gql/GQL_QUERIES';

interface ILayoutProps {
  children?: ReactNode;
  title: string;
}

interface LayoutChildProps {
  fullWidth?: boolean;
}

const Layout = ({ children, title }: ILayoutProps) => {
  const { setCart } = useContext(CartContext);
  const router = useRouter();

  const noMarginPages = ['/', '/o-nas', '/hvyt-objects'];
  const isFullWidthHero = noMarginPages.includes(router.pathname);

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const updatedCart = getFormattedCart(data);

      if (updatedCart && data?.cart?.contents?.nodes.length) {
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
          isFullWidthHero ||
          Children.toArray(children).some(
            (child) => isValidElement(child) && child.props.fullWidth,
          )
            ? 'w-full'
            : 'container mx-auto max-w-[1440px] py-16'
        }
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
