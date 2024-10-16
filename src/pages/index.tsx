// Components
import React from 'react';
import Hero from '@/components/Index/Hero.component';
import Layout from '@/components/Layout/Layout.component';
import NewArrivals from '@/components/Index/NewArivials.component';
import Bestsellers from '@/components/Index/Bestsellers.component';
import WybierzColor from '@/components/Index/WybierzColor.component';
import PasujemyWszedzie from '@/components/Index/Pasujemy.component'
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
  <Layout title="Strona główna">
  <Hero
    title="Wybierz swój HVYT"
    description="Od eleganckich, nowoczesnych wzorów uchwytów meblowych po ponadczasowe klasyki. Sprawdź jak nasze Hvyt’y mogą odmienić Twoje wnętrze."
    buttonText="Zobacz uchwyty"
    buttonLink="#"
    imageSrc="/images/hero-overlay.png"
    imageAlt="Hvyt Hero Image"
    bgColor="bg-beige"
  />
    <NewArrivals />
    <Bestsellers />
    <WybierzColor />
    <PasujemyWszedzie />
    <NaszeKolekcje />
    <Instagram />
  </Layout>
)

export default Index;

/* 
// Uncomment this if you need to fetch products in the future
// GraphQL
import { FETCH_ALL_PRODUCTS_QUERY } from '@/utils/gql/GQL_QUERIES';
import client from '@/utils/apollo/ApolloClient';

export const getStaticProps: GetStaticProps = async () => {
  const { data, loading, networkStatus } = await client.query({
    query: FETCH_ALL_PRODUCTS_QUERY,
  });

  return {
    props: {
      products: data.products.nodes,
      loading,
      networkStatus,
    },
    revalidate: 60,
  };
}; */
