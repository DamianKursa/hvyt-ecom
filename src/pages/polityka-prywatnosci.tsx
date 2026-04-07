import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout/Layout.component';
import { useRouter } from 'next/router';
import { useI18n } from '@/utils/hooks/useI18n';

const PolitykaPrywatnosci = () => {

  const postSlug = {
    pl: 'polityka-prywatnosci-next',
    en: 'privacy-policy-next'
  };

  const {t, getPath} = useI18n();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  
  useEffect(()=> {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/pages/page?slug=${postSlug[router.locale as keyof typeof postSlug]}`);
        const data = await response.json();
        setPageData(data);
        
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, [router.locale]);

  return (
    <Layout title={`${t.privacyPolicy.title} | HVYT`}>
      <Head>
        <title>{t.privacyPolicy.title.toLocaleUpperCase()}</title>
        <meta
          name="description"
          content={t.privacyPolicy.subtitle}
        />

        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}${getPath('/polityka-prywatnosci')}`}
        />
      </Head>
      <div className="max-w-4xl mx-auto px-4">
        {pageData && ! isLoading?         <div 
            className="page-content"
            dangerouslySetInnerHTML={{ __html: pageData?.content || '' }}
          /> : (<p className="max-w-4xl mx-auto px-4 text-center">{t.modal.loading}...</p>)}
      </div>

      <style>{`
        .policyList {
          counter-reset: item;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .policyList > li {
          counter-increment: item;
          position: relative;
          margin-bottom: 0.75em;
          padding-left: 2em;
        }

        .policyList > li::before {
          content: counter(item) '. ';
          position: absolute;
          left: 0;
        }

        .policyList > li ol {
          counter-reset: subitem;
          list-style: none;
          margin: 0.5em 0 0;
          padding: 0;
        }

        .policyList > li ol > li {
          counter-increment: subitem;
          position: relative;
          margin-bottom: 0.5em;
          padding-left: 2em;
        }

        .policyList > li ol > li::before {
          content: counter(item) '.' counter(subitem) ' ';
          position: absolute;
          left: 0;
        }
      `}</style>
    </Layout>
  );
};

export default PolitykaPrywatnosci;
