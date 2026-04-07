import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Head from 'next/head';
import { useI18n } from '@/utils/hooks/useI18n';
import { useRouter } from 'next/router';

const DostawaPage = () => {

  const postSlug = {
    pl: 'dostawa-next',
    en: 'delivery-next'
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
    <Layout title={`Hvyt | ${t.pageDelivery.title}`}>
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}${getPath('/dostawa')}`}
        />
      </Head>
      <section className="w-full py-16 px-4 md:px-0 bg-light-beige">
        <div className="container mx-auto max-w-grid-desktop">
          {/* Delivery Section */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(860px,1fr)_minmax(500px,1fr)] rounded-[24px] bg-pastel-brown gap-4 md:p-4 md:p-0">
            {/* Content Section */}
            <div className="my-[75px] flex flex-col justify-between px-4 md:px-10 min-w-0 md:min-w-[860px]">
              {/* Heading */}
              <div className="text-left mb-[40px]">
                <h1 className="text-[40px] md:text-[56px] font-bold text-neutral-darkest">
                  {t.pageDelivery.title}
                </h1>
              </div>
                {pageData && ! isLoading?         <div 
                    className="page-content"
                    dangerouslySetInnerHTML={{ __html: pageData?.content_raw || '' }}
                  /> : (<p className="px-4">{t.modal.loading}...</p>)}
            </div>

            {/* Image Section */}
            <div className="overflow-hidden rounded-[24px] relative min-w-0 md:min-w-[500px] h-64 md:h-auto">
              <Image
                src="/images/hvyt(1).png"
                alt="Dostawa"
                layout="fill"
                objectFit="cover"
                className="rounded-[16px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DostawaPage;
