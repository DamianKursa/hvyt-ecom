// src/hooks/useResolveOrderHash.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const useResolveOrderHash = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { 'wc-api': wcApi, order_hash } = router.query;
    if (wcApi === 'WC_Gateway_Przelewy24' && order_hash) {
      axios
        .get(`/api/proxy-wc-webhook`, { params: { 'wc-api': wcApi, order_hash } })
        .then(response => {
          const { redirectUrl } = response.data;
          if (redirectUrl) {
            router.replace(redirectUrl);
          }
        })
        .catch(err => {
          console.error('Error resolving order hash:', err);
        });
    }
  }, [router]);
};

export default useResolveOrderHash;
