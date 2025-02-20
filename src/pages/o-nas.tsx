import React from 'react';
import Slider from '../components/Slider/Slider.component';
import NaszeKolekcje from '../components/Index/NaszeKolekcje';
import NewArrivalsSection from '../components/Index/NewArivials.component';
import Footer from '../components/Footer/Footer.component';
import Layout from '@/components/Layout/Layout.component'; // Use Layout to include the header and other layout-related aspects
import HeroOnas from '@/components/Onas/HeroOnas.component';

const OnasPage = () => {
  return (
    <Layout title="Hvyt | O nas">
      {' '}
      {/* Using Layout to maintain consistency */}
      <HeroOnas />
      {/* Slider Section */}
      <section className="py-16 w-full">
        <div className="container px-4 md:px-0 mx-auto max-w-grid-desktop">
          <Slider />
        </div>
      </section>
      {/* Nasze Kolekcje Section */}
      <section className="py-16 bg-beige w-full">
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
