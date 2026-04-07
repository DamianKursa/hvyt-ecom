import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';
import Head from 'next/head';
import { useI18n } from '@/utils/hooks/useI18n';
import { useRouter } from 'next/router';

const ZwrotyReklamacjePage = () => {

    const postSlug = {
      pl: 'zwroty-next',
      en: 'returns-next'
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
    <Layout title={t.pageReturns.layoutTitle}>
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/zwroty-i-reklamacje`}
        />
      </Head>
      <section className="w-full">
            {pageData && ! isLoading ? <div 
            className="page-content container mx-auto max-w-[1440px] px-4 md:px-0 mt-16 md:mt-4"
            dangerouslySetInnerHTML={{ __html: pageData?.content || '' }}
          /> : (<p className="max-w-4xl mx-auto px-4 text-center">{t.modal.loading}...</p>)}

      </section>
    </Layout>
  );
};

export default ZwrotyReklamacjePage;
