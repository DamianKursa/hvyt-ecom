import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/Product/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import SkeletonProductPage from '@/components/Product/SkeletonProductPage.component';
import { fetchProductBySlug, fetchMediaById } from '@/utils/api/woocommerce';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import { Product, ProductAttribute } from '@/utils/functions/interfaces';

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        // Fetch product by slug
        const productData = await fetchProductBySlug(slug);
        if (!productData) {
          setErrorMessage('No product found');
          setSnackbarMessage('No product found');
          setSnackbarType('error');
          setShowSnackbar(true);
          return;
        }

        // Fetch product's featured media (if needed)
        if (productData.featured_media) {
          const featuredImage = await fetchMediaById(productData.featured_media);
          productData.image = featuredImage;
        }

        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setErrorMessage('Error loading product data.');
        setSnackbarMessage('Error loading product data.');
        setSnackbarType('error');
        setShowSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Handle attribute selection change
  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  // Find the matching variation based on selected attributes
  useEffect(() => {
    if (product?.baselinker_variations && Object.keys(selectedAttributes).length > 0) {
      const variation = product.baselinker_variations.find((v) =>
        v.attributes.every(
          (attr) => selectedAttributes[attr.name] === attr.option
        )
      );
      setSelectedVariation(variation || null);
    }
  }, [selectedAttributes, product]);

  if (loading) {
    return (
      <Layout title="Loading...">
        <SkeletonProductPage />
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout title="Error">
        <SkeletonProductPage />
        <Snackbar message={snackbarMessage} type={snackbarType} visible={showSnackbar} />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Not Found">
        <p>No product found.</p>
        <Snackbar message="No product found." type="error" visible={true} />
      </Layout>
    );
  }

  // Handle product gallery images
  const galleryImages = selectedVariation?.image?.src
    ? [{ id: selectedVariation?.id || 'variation-default', sourceUrl: selectedVariation?.image?.src || '' }]
    : product.images && product.images.length > 0
    ? product.images.map((img, index) => ({ id: `image-${index}`, sourceUrl: img.src }))
    : [{ id: 'default-id', sourceUrl: product.image }];

  // Find distinct attributes for all variations
  const distinctAttributes = product.baselinker_variations
    ?.flatMap((variation) => variation.attributes.map((attr) => attr.name))
    .filter((value, index, self) => self.indexOf(value) === index); // Get distinct attribute names

  // Get unique options for each attribute
  const getUniqueOptions = (attributeName: string) => {
    const options = product.baselinker_variations
      ?.flatMap((variation) => variation.attributes.filter((attr) => attr.name === attributeName))
      .map((attr) => attr.option);
    return Array.from(new Set(options)); // Remove duplicates
  };

  return (
    <Layout title={product.name}>
      <section className="container mx-auto py-12 max-w-grid-desktop px-grid-desktop-margin">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* Gallery Section */}
          <div className="lg:w-8/12 flex flex-col gap-6">
            <SingleProductGallery images={galleryImages} />
          </div>

          {/* Product Details */}
          <div className="lg:w-4/12 flex flex-col gap-6">
            {/* Product Name and Price */}
            <div className="w-full">
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-red-700">
                  {selectedVariation?.price || product.price} zł
                </span>
              </div>
            </div>

            {/* Render Dropdowns for each distinct attribute */}
            {distinctAttributes?.map((attributeName) => (
              <div key={attributeName} className="mt-4">
                <span className="text-base font-semibold">{attributeName}:</span>
                <select
                  className="border border-neutral-dark rounded w-full mt-2 py-2 px-3"
                  onChange={(e) => handleAttributeChange(attributeName, e.target.value)}
                  value={selectedAttributes[attributeName] || ''}
                >
                  <option value="">Wybierz {attributeName}</option>
                  {getUniqueOptions(attributeName).map((option, index) => (
                    <option key={`${attributeName}-${index}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Add to Cart and Wishlist */}
            <div className="flex items-center mt-4 space-x-4">
              <button className="w-4/5 py-3 text-lg font-semibold text-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors flex justify-between items-center">
                Dodaj do koszyka
                <Image src="/icons/dodaj-do-koszyka.svg" alt="Add to Cart" width={24} height={24} />
              </button>
              <button className="w-1/5 p-3 border rounded-full border-neutral-dark text-neutral-dark hover:text-red-600 hover:border-red-600 flex justify-center items-center">
                <Image src="/icons/wishlist.svg" alt="Wishlist" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
        {showSnackbar && <Snackbar message={snackbarMessage} type={snackbarType} visible={showSnackbar} />}
      </section>
    </Layout>
  );
};

export default ProductPage;
