// pages/_app.tsx
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';
import { useEffect, useState } from 'react';
import { CartProvider } from '@/stores/CartProvider';
import { UserProvider } from '@/context/UserContext';
import { WishlistProvider } from '@/context/WhishlistContext';
import client from '@/utils/apollo/ApolloClient';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import axios from 'axios';
import type { AppProps } from 'next/app';

import '@/styles/globals.css';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Check if the current URL has the wc‑API query parameter
    if (router.query['wc-api']) {
      setShowOverlay(true);
      // If an order_hash is also provided, resolve the order details
      if (router.query.order_hash) {
        axios
          .get(`https://wp.hvyt.pl/wp-json/custom/v1/resolve-order`, {
            params: { order_hash: router.query.order_hash },
          })
          .then((response) => {
            const { order_id, order_key } = response.data;
            if (order_id && order_key) {
              // Redirect to your frontend thank-you page
              router.push(`/dziekujemy?order_id=${order_id}&key=${order_key}`);
            } else {
              setShowOverlay(false);
            }
          })
          .catch((err) => {
            console.error('Error resolving order hash:', err);
            setShowOverlay(false);
          });
      } else {
        // If no order_hash exists, you might hide the overlay after a short delay.
        setTimeout(() => {
          setShowOverlay(false);
        }, 3000);
      }
    }
  }, [router.query, router]);

  return (
    <ApolloProvider client={client}>
      {showOverlay && <LoadingOverlay />}
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
