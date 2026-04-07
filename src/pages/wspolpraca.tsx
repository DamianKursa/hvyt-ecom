import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import NaszeKolekcje from '@/components/Index/NaszeKolekcje';
import Head from 'next/head';
import { useI18n } from '@/utils/hooks/useI18n';
import { useRouter } from 'next/router';

const WspolpracaPage = () => {

  const postSlug = {
    pl: 'wspolpracuj-z-nami',
    en: 'work-with-us'
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

  const sectionRefs = {
    pracownie: useRef<HTMLDivElement>(null),
    partnerzy: useRef<HTMLDivElement>(null),
    blogerzy: useRef<HTMLDivElement>(null),
    produkty: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (section: keyof typeof sectionRefs) => {
    sectionRefs[section].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <Layout title={t.pageCooperation.title}>
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/wspolpraca`}
        />
      </Head>
      <section className="w-full px-4 md:px-0">
        <div className="container max-w-grid-desktop mx-auto">
          {pageData && ! isLoading? (<>
          {/* Header Section */}
          <div className="text-left mb-8 md:pt-0 pt-[64px]">
            <h1 className="text-[36px]  md:py-0 md:text-[56px] font-bold text-dark-pastel-red leading-tight mb-4">
              { pageData?.acf?.title }
            </h1>
            <p className="text-[16px] md:text-[18px] font-light text-neutral-darkest leading-6 md:leading-8">
              { pageData?.acf?.subtitle }
            </p>
          </div>

          {/* Collaboration Sections */}
          <div className="grid grid-cols-1 gap-8">
            {/* Section 1 */}
            <div
              ref={sectionRefs.pracownie}
              className="grid rounded-[16px] h-auto md:h-[520px] border border-neutral-200 md:grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-[16px]">
                <Image
                  src="/images/kolekcje_1_new.png"
                  alt="Współpraca z Pracowniami Projektowymi"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[16px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-4 md:p-6">
                <div>
                  <h3 className="text-[40px] font-bold text-black mb-4">
                    { pageData?.acf?.s_lab.title }
                  </h3>
                  <p className="text-[16px] font-light text-black leading-7 mb-6"
                  dangerouslySetInnerHTML={{ __html: pageData?.acf?.s_lab.content || '' }}
                  />
                </div>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] md:text-[20px] font-light text-black flex items-center gap-2 underline"
                >
                  {t.pageCooperation.sendEmail}: hello@hvyt.pl
                  <Image
                    height={24}
                    width={24}
                    src="/icons/mail.svg"
                    alt="Mail icon"
                  />
                </Link>
              </div>
            </div>

            {/* Section 2 */}
            <div
              ref={sectionRefs.partnerzy}
              className="grid rounded-[16px] h-auto md:h-[520px] border border-neutral-200 md:grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-[16px] md:order-last">
                <Image
                  src="/images/kolekcje_2_new.png"
                  alt="Współpraca ze stałymi partnerami"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[16px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-4 md:p-6">
                <div>
                  <h3 className="text-[40px] font-bold text-black mb-4">
                    { pageData?.acf?.s_partners.title }
                  </h3>
                  <p className="text-[16px] font-light text-black leading-7 mb-6"
                  dangerouslySetInnerHTML={{ __html: pageData?.acf?.s_partners.content || '' }}
                  />
                </div>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] md:text-[20px] font-light text-black flex items-center gap-2 underline"
                >
                  {t.pageCooperation.sendEmail}: hello@hvyt.pl
                  <Image
                    height={24}
                    width={24}
                    src="/icons/mail.svg"
                    alt="Mail icon"
                  />
                </Link>
              </div>
            </div>

            {/* Section 3 */}
            <div
              ref={sectionRefs.blogerzy}
              className="grid rounded-[16px] h-auto md:h-[520px] border border-neutral-200 md:grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-[16px]">
                <Image
                  src="/images/kolekcje_3_new.png"
                  alt="Współpraca z Blogerami i Influencerami"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[16px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-4 md:p-6">
                <div>
                  <h3 className="text-[40px] font-bold text-black mb-4">
                    { pageData?.acf?.s_blogers.title }
                  </h3>
                  <p className="text-[16px] font-light text-black leading-7 mb-6"
                  dangerouslySetInnerHTML={{ __html: pageData?.acf?.s_blogers.content || '' }}
                  />
                </div>
                <Link
                  href="mailto:hello@hvyt.pl"
                  className="text-[16px] md:text-[20px] font-light text-black flex items-center gap-2 underline"
                >
                  {t.pageCooperation.sendEmail}: hello@hvyt.pl
                  <Image
                    height={24}
                    width={24}
                    src="/icons/mail.svg"
                    alt="Mail icon"
                  />
                </Link>
              </div>
            </div>

            {/* Section 4 */}
            <div
              ref={sectionRefs.produkty}
              className="grid h-auto md:h-[520px] gap-8 border border-beige-dark rounded-[24px] md:p-0 md:grid-cols-2 items-center"
            >
              <div className="order-2 md:order-none md:pr-[72px] px-4 md:px-0 md:pl-[24px]">
                <h3 className="text-[40px] font-bold text-black mb-4">
                  { pageData?.acf?.s_products.title }
                </h3>
                  <p className="text-[16px] font-light text-black leading-7 mb-6"
                  dangerouslySetInnerHTML={{ __html: pageData?.acf?.s_products.content || '' }}
                  />
              </div>
              <div className="h-[300px] md:h-[520px] overflow-hidden rounded-[24px] order-1 md:order-none">
                <Image
                  src="/images/kolekcje_4_new.png"
                  alt="Poznaj nasze produkty"
                  width={400}
                  height={500}
                  layout="responsive"
                  className="rounded-[24px] object-cover"
                />
              </div>
            </div>
          </div> </> )  : (<p className="max-w-4xl mx-auto px-4 text-center">{t.modal.loading}...</p>) }
        </div>
      </section>
    </Layout>
  );
};

export default WspolpracaPage;
