// pages/index.tsx
import React from 'react';
import type { NextPage } from 'next';
import Hero from '@/components/Index/Hero.component';
import Layout from '@/components/Layout/Layout.component';
import NewArrivals from '@/components/Index/NewArivials.component';
import Bestsellers from '@/components/Index/Bestsellers.component';
import WybierzColor from '@/components/Index/WybierzColor.component';
import PasujemyWszedzie from '@/components/Index/Pasujemy.component';
import NaszeKolekcje from '@/components/Index/NaszeKolekcje';
import Instagram from '@/components/Index/Instagram';
import Head from 'next/head';
import WybierzHvyt from '@/components/Index/WybierzHvyt';

const Index: NextPage = () => {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (maintenanceMode) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: '0 20px',
          backgroundColor: '#f8f8f8',
        }}
      >
        <img
          src="/images/Logo.svg"
          alt="Logo"
          style={{ width: '200px', marginBottom: '20px' }}
        />
        <h1>Zmieniamy się dla Was!</h1>
        <p>
          Aktualnie przeprowadzamy zmiany i pracujemy nad nową, ulepszoną wersją
          naszej strony internetowej. Dziękujemy za cierpliwość i już wkrótce
          zapraszamy na naszą nową stronę!
        </p>
        <p>W sprawie zamowień lub innych pytań prosimy o kontakt</p>
        <a href="mailto:hello@hvyt.pl">
          <h3>hello@hvyt.pl</h3>
        </a>
      </div>
    );
  }

  return (
    <Layout
      title="Nowoczesne gałki i uchwyty do mebli, klamki i wieszaki | HVYT"
      description="W naszej ofercie znajduje się szeroki wybór gałek i uchwytów meblowych, klamek do drzwi oraz wieszaków ściennych."
    >
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}`}
        />
      </Head>
      <Hero
        secondButtonText="Zobacz gałki"
        secondButtonLink="/kategoria/uchwyty-meblowe?pa_rodzaj=galki&pa_rodzaj=t-bary"
        title="Tworzymy meble, które żyją razem z Tobą."
        description="Wnętrza to nie tylko ściany i metry. To codzienność. Kawa wypita w biegu, pilot schowany pod poduszką, pies, który postanowił coś zbroić."
        buttonText="Zobacz meble"
        buttonLink="/meble"
        imageSrc="/images/strona-główna.png"
        imageAlt="Hvyt Hero Image"
        bgColor="linear-gradient(0deg, #E4D6B1 0%, #E6D8B5 100%)"
        videoSrc="/videos/baner.mp4"
        posterSrc="/images/obraz.png"
        nextPeekPx={80}
      // offsetTopPx={64} // <- ustaw, jeśli masz fixed header i chcesz odjąć jego wysokość
      />
      <WybierzHvyt
        items={[
          { src: '/images/new-arrivals-1.png', mobileSrc: '/images/new-arrivals-1.png', alt: 'HVYT 1' },
          { src: '/images/new-arrivals-2.png', mobileSrc: '/images/new-arrivals-2.png', alt: 'HVYT 2' },
          { src: '/images/new-arrivals-3.png', mobileSrc: '/images/new-arrivals-3.png', alt: 'HVYT 3' },
          { src: '/images/new-arrivals-4.png', mobileSrc: '/images/new-arrivals-4.png', alt: 'HVYT 4' },
        ]}
      />
      <NewArrivals />
      <Bestsellers />
      <WybierzColor />
      <PasujemyWszedzie />
      <NaszeKolekcje />
      <Instagram />
    </Layout>
  );
};

export default Index;
