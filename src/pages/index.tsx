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
        title="Wybierz<br/> swój HVYT"
        description="Od eleganckich, nowoczesnych wzorów uchwytów meblowych po ponadczasowe klasyki. Sprawdź jak nasze Hvyt’y mogą odmienić Twoje wnętrze."
        buttonText="Zobacz uchwyty"
        buttonLink="/kategoria/uchwyty-meblowe"
        imageSrc="/images/strona-główna.png"
        imageAlt="Hvyt Hero Image"
        bgColor="linear-gradient(0deg, #E4D6B1 0%, #E6D8B5 100%)"
        staticBoxes={[
          { index: 2, bgColor: '#F5F5AD' },
          { index: 5, bgColor: '#F5F5AD' },
          { index: 4, bgColor: '#F5F5AD' },
          { index: 6, bgColor: '#F5F5AD' },
          { index: 8, bgColor: '#F5F5AD' },
          { index: 10, bgColor: '#F5F5AD' },
          { index: 11, bgColor: '#F5F5AD' },
        ]}
        animationSteps={[
          {
            step: 1,
            animatedBoxes: [
              {
                index: 6,
                bgColor: '#F5F5AD',
                animationType: 'slidingToTransparent',
              },
              { index: 7, bgColor: '#F5F5AD', animationType: 'slidingToBg' },
            ],
            overlayRotation: 80,
          },
          {
            step: 2,
            animatedBoxes: [],
            overlayRotation: 0,
          },
          {
            step: 3,
            animatedBoxes: [
              {
                index: 4,
                bgColor: '#F5F5AD',
                animationType: 'slidingToTransparent',
              },
              {
                index: 10,
                bgColor: '#F5F5AD',
                animationType: 'slidingToTransparent',
              },
            ],
            overlayRotation: 50,
          },
          {
            step: 4,
            animatedBoxes: [
              {
                index: 2,
                bgColor: '#F5F5AD',
                animationType: 'slidingTopToBottom',
              },
            ],
            overlayRotation: 70,
          },
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
