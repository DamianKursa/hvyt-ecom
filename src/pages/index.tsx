// Components
import React from 'react';
import Hero from '@/components/Index/Hero.component';
import Layout from '@/components/Layout/Layout.component';
import NewArrivals from '@/components/Index/NewArivials.component';
import Bestsellers from '@/components/Index/Bestsellers.component';
import WybierzColor from '@/components/Index/WybierzColor.component';
import PasujemyWszedzie from '@/components/Index/Pasujemy.component';
import NaszeKolekcje from '@/components/Index/NaszeKolekcje';
import Instagram from '@/components/Index/Instagram';
// Types
import type { NextPage } from 'next';

/**
 * Main index page
 * @function Index
 * @returns {JSX.Element} - Rendered component
 */

const Index: NextPage = () => (
  <Layout title="Hvyt | Strona główna">
    <Hero
      secondButtonText="Zobacz gałki"
      secondButtonLink="/kategoria/uchwyty-meblowe?pa_rodzaj=galki&pa_rodzaj=t-bary"
      title="Wybierz<br/> swój HVYT"
      description="Od eleganckich, nowoczesnych wzorów uchwytów <br/> meblowych po ponadczasowe klasyki. Sprawdź jak<br/> nasze Hvyt’y mogą odmienić Twoje wnętrze."
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
          step: 1, // Fire at step 1
          animatedBoxes: [
            {
              index: 6,
              bgColor: '#F5F5AD',
              animationType: 'slidingToTransparent',
            },
            { index: 7, bgColor: '#F5F5AD', animationType: 'slidingToBg' },
          ],
        },
        {
          step: 2, // Fire at step 2
          animatedBoxes: [],
        },
        {
          step: 3, // Fire at step 3
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
        },
        {
          step: 4, // Fire at step 3
          animatedBoxes: [
            {
              index: 2,
              bgColor: '#F5F5AD',
              animationType: 'slidingTopToBottom',
            },
          ],
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

export default Index;
