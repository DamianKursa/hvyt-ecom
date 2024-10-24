// Imports
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

  // Define the pages that should not have a margin
  const noMarginPages = ['/', '/o-nas','/hvyt-objects'];

  // Check if the current page should have a margin or not
  const hasMargin = !noMarginPages.includes(router.pathname);

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);

      if (!updatedCart && !data?.cart?.contents?.nodes.length) {
        // Should we clear the localStorage if we have no remote cart?
        return;
      }

      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));

      // Update cart data in React Context.
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
      
      {/* Main content area with conditional margin-top */}
      <main className={hasMargin ? 'mt-[120px]' : ''}>
        {children}
      </main>
      
      {/* Footer and Sticky Navigation */}
      <Footer />
      <Stickynav />
    </>
  );
};

export default Layout;
