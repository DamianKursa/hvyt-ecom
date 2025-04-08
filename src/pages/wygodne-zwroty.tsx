import { useEffect } from 'react';
import Layout from '@/components/Layout/Layout.component';

const WygodneZwroty = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://cdn.allekurier.pl/mail-box/banner.js?hid=59c63e5c-3a7e-4b8e-8165-999687ba3bc4';
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Layout title="Wygodne zwroty">
      <div
        id="ak_returns_banner_59c63e5c-3a7e-4b8e-8165-999687ba3bc4"
        style={{ marginBottom: '20px' }}
      >
        [BANER-WZ]
      </div>
    </Layout>
  );
};

export default WygodneZwroty;
