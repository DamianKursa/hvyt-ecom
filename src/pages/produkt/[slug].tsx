import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/Product/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import { GET_SINGLE_PRODUCT } from '@/utils/gql/GQL_QUERIES';
import SkeletonProductPage from '@/components/Product/SkeletonProductPage.component';
import DOMPurify from 'dompurify'; // Use DOMPurify for sanitizing HTML

// Define types for Product attributes and variations
interface ProductAttribute {
  name: string;
  options: string[];
}

interface Product {
  id: string;
  name: string;
  price: string;
  salePrice?: string;
  regularPrice?: string;
  description: string;
  image: string;
  attributes: {
    nodes: ProductAttribute[];
  };
  variations?: {
    nodes: {
      image?: {
        sourceUrl: string;
      };
    }[];
  };
}

interface ProductQueryResult {
  products: {
    nodes: Product[];
  };
}

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { data, loading, error } = useQuery<ProductQueryResult>(GET_SINGLE_PRODUCT, {
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

  const product = data?.products?.nodes[0];

  if (!product) {
    return (
      <Layout title="Not Found">
        <p>No product found.</p>
        <Snackbar message="No product found." type="error" visible={true} />
      </Layout>
    );
  }

  const colorAttribute = product.attributes.nodes.find(attr => attr.name === 'pa_kolor');
  const spreadAttribute = product.attributes.nodes.find(attr => attr.name === 'pa_rozstaw'); // For 'Rozstaw'
  const galleryImages = product.variations?.nodes.map(variation => variation.image?.sourceUrl).filter(Boolean) || [product.image];

  return (
    <Layout title={product.name}>
      <section className="container mx-auto py-12 max-w-grid-desktop px-grid-desktop-margin">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* Left Side (70%): Product Images */}
          <div className="lg:w-7/12 flex flex-col gap-6">
            <SingleProductGallery
              images={galleryImages.map((src) => ({
                id: src || "default-id", // Provide a default id if src is undefined
                sourceUrl: src || "/placeholder.jpg", // Provide a placeholder image if src is undefined
              }))}
            />
          </div>
  
          {/* Right Side (30%): Product Details */}
          <div className="lg:w-5/12 flex flex-col gap-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-red-600">
                {product.salePrice || product.price} zł
              </span>
              {product.salePrice && (
                <>
                  <span className="text-sm line-through text-neutral-darkest">
                    {product.regularPrice} zł
                  </span>
                  <span className="text-sm text-red-600">-15%</span>
                </>
              )}
            </div>
            <div
              className="text-neutral-darkest text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            />
            {/* Add to Cart Button */}
            <button className="w-full py-3 text-lg font-semibold text-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors">
              Dodaj do koszyka
            </button>
  
            {/* Wishlist Button */}
            <button className="flex items-center justify-center p-2 text-black bg-white rounded-full border hover:shadow-md transition">
              <span className="sr-only">Add to Wishlist</span>
            </button>
          </div>
        </div>
      </section>
  
      {/* Snackbar for messages */}
      {showSnackbar && <Snackbar message={snackbarMessage} type={snackbarType} visible={showSnackbar} />}
    </Layout>
  );  
};

export default ProductPage;
