// Imports
import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';

// Context Providers
import { CartProvider } from '@/stores/CartProvider';
import { UserProvider } from '@/context/UserContext';
import { WishlistProvider } from '@/context/WhishlistContext'; // Import WishlistProvider
import client from '@/utils/apollo/ApolloClient';

// Types
import type { AppProps } from 'next/app';

// Styles
import '@/styles/globals.css';
import 'nprogress/nprogress.css';

// NProgress
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <UserProvider>
          <WishlistProvider>
            {' '}
            {/* Wrap with WishlistProvider */}
            <Component {...pageProps} />
          </WishlistProvider>
        </UserProvider>
      </CartProvider>
    </ApolloProvider>
  );
}

export default MyApp;
