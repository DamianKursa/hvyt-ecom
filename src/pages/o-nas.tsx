import React from 'react';
import Slider from '../components/Slider/Slider.component';
import NaszeKolekcje from '../components/Index/NaszeKolekcje';
import NewArrivalsSection from '../components/Index/NewArivials.component';

import Layout from '@/components/Layout/Layout.component';
import HeroOnas from '@/components/Onas/HeroOnas.component';
import Head from 'next/head';

const OnasPage = () => {
  return (
    <Layout title="Hvyt | O nas">
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/o-nas`}
        />
      </Head>
      <HeroOnas />
      {/* Slider Section */}
      <section className="py-16 w-full">
        <div className="container px-4 md:px-0 mx-auto max-w-grid-desktop">
          <Slider />
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
