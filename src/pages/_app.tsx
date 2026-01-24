// pages/_app.tsx
import Script from 'next/script';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';
import { useEffect, useState } from 'react';
import { CartProvider } from '@/stores/CartProvider';
import { UserProvider } from '@/context/UserContext';
import { WishlistProvider } from '@/context/WhishlistContext';
import { LanguageProvider } from '@/context/LanguageContext';
import client from '@/utils/apollo/ApolloClient';
import LoadingOverlay from '@/components/UI/LoadingOverlay';
import axios from 'axios';
import type { AppProps } from 'next/app';
import { ExternalIdProvider } from '@/context/ExternalIdContext';

import '@/styles/globals.css';
import 'nprogress/nprogress.css';

// Konfiguracja NProgress przy zmianie tras
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  // Obsługa przekierowania na podstawie parametrów w URL (np. dla zamówień)
  useEffect(() => {
    if (router.query['wc-api']) {
      setShowOverlay(true);

      if (router.query.order_hash) {
        axios
          .get(`https://wp.hvyt.pl/wp-json/custom/v1/resolve-order`, {
            params: { order_hash: router.query.order_hash },
          })
          .then((response) => {
            const { order_id, order_key } = response.data;
            if (order_id && order_key) {
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
        setTimeout(() => {
          setShowOverlay(false);
        }, 3000);
      }
    }
  }, [router.query, router]);

  // Przesyłanie zdarzenia pageview do dataLayer po zmianie trasy
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'pageview',
          page: url,
        });
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){
            if(f.fbq) return;
            n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq) f._fbq=n;
            n.push=n; n.loaded=!0; n.version='2.0';
            n.queue=[]; t=b.createElement(e); t.async=!0;
            t.src=v; s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(
            window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js'
          );
          fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      {/* Ładowanie Cookiebot tylko w środowisku produkcyjnym */}
      {process.env.NODE_ENV === 'production' && (
        <Script
          id="Cookiebot"
          strategy="afterInteractive"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="feef7cd9-8bc1-4184-80c9-90153c1244ea"
          data-blockingmode="auto"
          type="text/javascript"
        />
      )}

      <ApolloProvider client={client}>
        {showOverlay && <LoadingOverlay />}
        <LanguageProvider>
          <CartProvider>
            <ExternalIdProvider>
              <UserProvider>
                <WishlistProvider>
                  <Component {...pageProps} />
                </WishlistProvider>
              </UserProvider>
            </ExternalIdProvider>
          </CartProvider>
        </LanguageProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
