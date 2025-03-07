// pages/_app.tsx

import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';

// Context Providers
import { CartProvider } from '@/stores/CartProvider';
import { UserProvider } from '@/context/UserContext';
import { WishlistProvider } from '@/context/WhishlistContext';
import client from '@/utils/apollo/ApolloClient';

// Types
import type { AppProps } from 'next/app';

// Styles
import '@/styles/globals.css';
import 'nprogress/nprogress.css';

// Import custom hook to resolve order hash if present in URL.
import useResolveOrderHash from '@/utils/hooks/useResolveOrderHash';

// NProgress
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  // Check for wc‑API order hash and resolve order if needed.
  useResolveOrderHash();

  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <UserProvider>
          <WishlistProvider>
            <Component {...pageProps} />
          </WishlistProvider>
        </UserProvider>
      </CartProvider>
    </ApolloProvider>
  );
}

export default MyApp;
