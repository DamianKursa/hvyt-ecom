// src/hooks/useResolveOrderHash.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const useResolveOrderHash = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { 'wc-api': wcApi, order_hash } = router.query;

    // Proceed only if the wc-api parameter and order_hash exist
    if (wcApi && order_hash) {
      // Call the custom WordPress REST endpoint to resolve the order details.
      axios
        .get(`https://wp.hvyt.pl/wp-json/custom/v1/resolve-order`, {
          params: { order_hash },
        })
        .then(response => {
          const { order_id, order_key } = response.data;
          if (order_id && order_key) {
            // Redirect to your frontend thank-you page with the order details.
            router.push(`/dziekujemy?order_id=${order_id}&key=${order_key}`);
          }
        })
        .catch(err => {
          console.error('Error resolving order hash:', err);
          // Optionally, handle error (show a message, etc.)
        });
    }
  }, [router]);
};

export default useResolveOrderHash;
