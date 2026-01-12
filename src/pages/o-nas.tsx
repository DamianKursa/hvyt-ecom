import React from 'react';
import Slider from '../components/Slider/Slider.component';
import NaszeKolekcje from '../components/Index/NaszeKolekcje';
import NewArrivalsSection from '../components/Index/NewArivials.component';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import HeroOnas from '@/components/Onas/HeroOnas.component';
import Head from 'next/head';
import { useI18n } from '@/utils/hooks/useI18n';
import { getSiteUrl } from '@/utils/i18n/config';

const OnasPage = (): JSX.Element => {
  const { t, getPath, config } = useI18n();
  
  return (
    <Layout title={t.aboutUs.pageTitle} description={t.aboutUs.metaDescription}>
      <Head>
        <meta name="description" content={t.aboutUs.metaDescription} />
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${config.siteUrl}${getPath('/o-nas')}`}
        />
        <link rel="alternate" hrefLang="pl" href={`${getSiteUrl('pl')}/o-nas`} />
        <link rel="alternate" hrefLang="en" href={`${getSiteUrl('en')}/about-us`} />
        <link rel="alternate" hrefLang="x-default" href={`${getSiteUrl('pl')}/o-nas`} />
      </Head>
      <HeroOnas />
      {/* Slider Section */}
      <section className="py-16 w-full">
        <div className="container px-4 md:px-0 mx-auto max-w-grid-desktop">
          <Slider />
          <div className='md:hidden'>
            <Link
              href={getPath('/kontakt')}
              className="text-center block w-full md:w-auto px-6 py-3 mt-6 md:mt-0 text-black text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              {t.aboutUs.contactButton}
            </Link>
          </div>
        </div>
      </section>
      {/* Nasze Kolekcje Section */}
      <section className="bg-beige w-full">
        <div className="container mx-auto max-w-grid-desktop">
          <NaszeKolekcje />
        </div>
      </section>
      {/* New Arrivals Section */}
      <section className="py-16 w-full">
        <div className="container mx-auto max-w-grid-desktop">
          <NewArrivalsSection useInViewTrigger={true} />
        </div>
      </section>
    </Layout>
  );
};

export default OnasPage;
