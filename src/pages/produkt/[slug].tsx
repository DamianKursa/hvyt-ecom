import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/Product/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import { GET_SINGLE_PRODUCT } from '@/utils/gql/GQL_QUERIES';
import SkeletonProductPage from '@/components/Product/SkeletonProductPage.component';

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string; // Ensure slug is a string
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { data, loading, error } = useQuery(GET_SINGLE_PRODUCT, {
    variables: { slug },
    onError: (err) => {
      setSnackbarMessage(err.message);
      setSnackbarType('error');
      setShowSnackbar(true);
    },
  });

  if (loading) {
    return (
      <Layout title="Loading...">
        <SkeletonProductPage />
      </Layout>
    );
  }

  if (error) {
    console.error('Error fetching product details:', error);
    return (
      <Layout title="Error">
        <SkeletonProductPage />
        <Snackbar message={snackbarMessage} type={snackbarType} visible={showSnackbar} />
      </Layout>
    );
  }

  const product = data?.products?.nodes[0]; // Grab the first product from the response

  if (!product) {
    return (
      <Layout title="Not Found">
        <p>No product found.</p>
        <Snackbar message="No product found." type="error" visible={true} />
      </Layout>
    );
  }

  const colorAttribute = product.attributes.nodes.find(attr => attr.name === 'pa_kolor');
  const galleryImages = product.variations?.nodes.map(variation => variation.image?.sourceUrl) || [product.image];

  return (
    <Layout title={product.name}>
      <section className="container mx-auto py-12 max-w-grid-desktop px-grid-desktop-margin">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* Left Side (70%): Product Images */}
          <div className="lg:w-7/12 flex flex-col gap-6">
            <SingleProductGallery images={galleryImages.map(src => ({ id: src, sourceUrl: src }))} />
          </div>

          {/* Right Side (30%): Product Details */}
          <div className="lg:w-5/12 flex flex-col gap-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-red-600">{product.salePrice || product.price} zł</span>
              {product.salePrice && (
                <>
                  <span className="text-sm line-through text-neutral-darkest">{product.regularPrice} zł</span>
                  <span className="text-sm text-red-600">-15%</span>
                </>
              )}
            </div>
            <p className="text-sm text-neutral-darkest">{product.description}</p>

            {/* Kolor Attribute */}
            {colorAttribute && (
              <div className="flex flex-wrap gap-4 items-center">
                <h3 className="font-semibold text-lg">Kolor:</h3>
                <div className="flex gap-2">
                  {colorAttribute.options.map((color, index) => {
                    const colorHex = colorAttribute.customFields?.colorHex?.[index] || '#fff'; // Default to white
                    return (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border border-neutral-dark cursor-pointer hover:shadow-md"
                        style={{ backgroundColor: colorHex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add other attributes and controls */}
          </div>
        </div>
      </section>
      {showSnackbar && <Snackbar message={snackbarMessage} type={snackbarType} visible={showSnackbar} />}
    </Layout>
  );
};

export default ProductPage;
