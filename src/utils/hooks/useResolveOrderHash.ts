// src/hooks/useResolveOrderHash.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const useResolveOrderHash = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { 'wc-api': wcApi, order_hash } = router.query;
    // Check if both wc-api and order_hash exist in the URL
    if (wcApi === 'WC_Gateway_Przelewy24' && order_hash) {
      axios
        .get('https://wp.hvyt.pl/wp-json/custom/v1/resolve-order', {
          params: { order_hash },
        })
        .then(response => {
          const { order_id, order_key } = response.data;
          if (order_id && order_key) {
            // Redirect to your frontend thank-you page
            router.replace(`/dziekujemy?order_id=${order_id}&key=${order_key}`);
          }
        })
        .catch(err => {
          console.error('Error resolving order hash:', err);
          // Optionally, you can show an error message or redirect to a fallback page
        });
    }
  }, [router]);
};

export default useResolveOrderHash;
