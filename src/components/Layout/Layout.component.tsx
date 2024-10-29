import { ReactNode, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

// Components
import Header from '@/components/Header/Header.component';
import Footer from '@/components/Footer/Footer.component';
import Stickynav from '@/components/Footer/Stickynav.component';

// State
import { CartContext } from '@/stores/CartProvider';

// Utils
import { getFormattedCart } from '@/utils/functions/functions';

// GraphQL
import { GET_CART } from '@/utils/gql/GQL_QUERIES';

interface ILayoutProps {
  children?: ReactNode;
  title: string;
}

const Layout = ({ children, title }: ILayoutProps) => {
  const { setCart } = useContext(CartContext);
  const router = useRouter();

  // Define the pages that should have the Hero as full width
  const noMarginPages = ['/', '/o-nas', '/hvyt-objects'];
  const isFullWidthHero = noMarginPages.includes(router.pathname);
  const hasMargin = !isFullWidthHero;

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const updatedCart = getFormattedCart(data);

      if (!updatedCart && !data?.cart?.contents?.nodes.length) {
        return;
      }

      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Header title={title} />
      
      {isFullWidthHero ? (
        <main className="w-full sm:px-4 md:px-0">{children}</main>
      ) : (
        <div className="max-w-[1440px] mx-auto">
          <main className={`${hasMargin ? 'mt-[120px]' : ''} sm:mx-4 md:mx-0`}>
            {children}
          </main>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default Layout;
