import { ReactNode, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

// Components
import Header from '@/components/Header/Header.component';
import Footer from '@/components/Footer/Footer.component';

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

/**
 * Renders layout for each page. Also passes along the title to the Header component.
 * @function Layout
 * @param {ReactNode} children - Children to be rendered by Layout component
 * @param {TTitle} title - Title for the page. Is set in <title>{title}</title>
 * @returns {JSX.Element} - Rendered component
 */

const Layout = ({ children, title }: ILayoutProps) => {
  const { setCart } = useContext(CartContext);
  const router = useRouter();

  // Define the pages that should have the Hero as full width
  const noMarginPages = ['/', '/o-nas', '/hvyt-objects'];

  // Determine if the current page should have the full-width Hero
  const isFullWidthHero = noMarginPages.includes(router.pathname);

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
      {/* Header */}
      <Header title={title} />

      {/* Conditionally apply max-width based on isFullWidthHero */}
      {isFullWidthHero ? (
        <main className={`${hasMargin ? 'mt-[120px]' : ''} px-4 md:px-0`}>
          {children}
        </main>
      ) : (
        <div className="max-w-[1440px] mx-auto">
          <main className={`${hasMargin ? 'mt-[120px]' : ''} px-4 md:px-0`}>
            {children}
          </main>
        </div>
      )}
      
      {/* Footer and Sticky Navigation */}
      <Footer />
    </>
  );
};

export default Layout;
