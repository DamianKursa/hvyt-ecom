// Components
import DisplayProducts from '@/components/Product/DisplayProducts.component';
import Layout from '@/components/Layout/Layout.component';

// GraphQL
import { FETCH_ALL_PRODUCTS_QUERY } from '@/utils/gql/GQL_QUERIES';

// Utilities
import client from '@/utils/apollo/ApolloClient';

// Types
import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';

/**
 * Displays all of the products.
 * @function Produkter
 * @param {InferGetStaticPropsType<typeof getStaticProps>} products
 * @returns {JSX.Element} - Rendered component
 */
const Produkter: NextPage = ({
  products,
  loading,
  networkStatus,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout title="Produkter">
    {loading ? (
      <div>Loading...</div>
    ) : products && products.length > 0 ? (
      <DisplayProducts products={products} />
    ) : (
      <div>No products found.</div>
    )}
    {networkStatus === 8 && (
      <div className="error">Error loading products.</div>
    )}
  </Layout>
);

export default Produkter;

/**
 * Fetches all products statically during build time.
 */
export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data, loading, networkStatus } = await client.query({
      query: FETCH_ALL_PRODUCTS_QUERY,
    });

    return {
      props: {
        products: data.products.nodes, // Ensure this matches the Postman response
        loading,
        networkStatus,
      },
      revalidate: 60, // Regenerate the page every 60 seconds
    };
  } catch (error) {
    console.error('ApolloError fetching products:', error);

    return {
      props: {
        products: [], // Provide fallback data if fetching fails
        loading: false,
        networkStatus: 8, // Example status for an error case
      },
      revalidate: 60, // Regenerate the page every 60 seconds even in case of errors
    };
  }
};
