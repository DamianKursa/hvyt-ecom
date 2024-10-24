import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/Product/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import SkeletonProductPage from '@/components/Product/SkeletonProductPage.component';
import { fetchProductBySlug, fetchMediaById } from '@/utils/api/woocommerce';
import DOMPurify from 'dompurify'; // For sanitizing HTML
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
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null); // For selecting variations

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

        // Handle baselinker.variations
        if (productData.baselinker && productData.baselinker.variations) {
          productData.variations = productData.baselinker_variations?.map((variation: Product['baselinker_variations'][0]) => ({
            id: variation.id,
            sku: variation.sku,
            stock_quantity: variation.stock_quantity,
            price: variation.price,
            regularPrice: variation.regular_price,
            salePrice: variation.sale_price,
            attributes: variation.attributes,
            image: variation.image ? { src: variation.image.src } : undefined,
          }));
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

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    setQuantity((prevQuantity) =>
      type === 'increase' ? prevQuantity + 1 : prevQuantity > 1 ? prevQuantity - 1 : 1
    );
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const variation = product?.baselinker_variations?.find((v: Product['baselinker_variations'][0]) => String(v.id) === selectedId);
    setSelectedVariation(variation || null);
  };
  

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

  // Find Kolor attribute
  const colorAttribute: ProductAttribute | undefined = product.attributes.find(
    (attr: ProductAttribute) => attr.name === 'Kolor OK'
  );

  // Determine if variations are available
  const variationsAvailable = product.variations && product.variations.length > 0;

  const colorMap: { [key: string]: string } = {
    Złoty: '#eded87',
    Srebrny: '#c6c6c6',
    Czarny: '#000000',
    Szary: '#a3a3a3',
    Różowy: '#edbbd8',
    Pozostałe: '#c11d51',
    Niebieski: '#a4dae8',
    Biały: '#fff',
  };

  return (
    <Layout title={product.name}>
      <section className="container mx-auto py-12 max-w-grid-desktop px-grid-desktop-margin">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* Gallery Section */}
          <div className="lg:w-8/12 flex flex-col gap-6">
            <SingleProductGallery images={galleryImages} />

            {/* Szczegóły produktu */}
            {product.meta_data?.find((meta) => meta.key === 'szczegoly_produktu') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Szczegóły produktu</h2>
                <p className="text-neutral-darkest">
                  {DOMPurify.sanitize(
                    product.meta_data.find((meta) => meta.key === 'szczegoly_produktu')?.value || ''
                  )}
                </p>
              </div>
            )}

            {/* Wymiary */}
            {product.meta_data?.find((meta) => meta.key === 'wymiary') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Wymiary</h2>
                <p className="text-neutral-darkest">
                  {DOMPurify.sanitize(product.meta_data.find((meta) => meta.key === 'wymiary')?.value || '')}
                </p>
              </div>
            )}

            {/* Informacje dodatkowe */}
            {product.meta_data?.find((meta) => meta.key === 'informacje_dodatkowe') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Informacje dodatkowe</h2>
                <p className="text-neutral-darkest">
                  {DOMPurify.sanitize(
                    product.meta_data.find((meta) => meta.key === 'informacje_dodatkowe')?.value || ''
                  )}
                </p>
              </div>
            )}

            {/* Karta produktu */}
            {product.meta_data?.find((meta) => meta.key === 'karta') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Karta produktu</h2>
                <p className="text-neutral-darkest">
                  {DOMPurify.sanitize(product.meta_data.find((meta) => meta.key === 'karta')?.value || '')}
                </p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-4/12 flex flex-col gap-6">
            {/* Product Name and Price */}
            <div className="w-full">
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-red-700">
                  {product.salePrice || product.price} zł
                </span>
                {product.salePrice && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg line-through text-neutral-darkest">
                      {product.regularPrice} zł
                    </span>
                    <span className="text-sm text-red-600">
                      -{Math.round(((parseFloat(product?.regularPrice ?? '0') || 0) - (parseFloat(product?.salePrice ?? '0') || 0)) / (parseFloat(product?.regularPrice ?? '1') || 1) * 100)}%
                    </span>
                  </div>
                )}
              </div>
              {product.lowest_price && (
                <p className="text-sm text-neutral-dark mt-2">
                  Najniższa cena w okresie 30 dni przed obniżką: {product.lowest_price} zł
                </p>
              )}
            </div>

            {/* Kolor OK Attribute */}
            {colorAttribute && (
              <div>
                <span className="text-base font-semibold">Kolor:</span>
                <div className="flex gap-2 mt-2">
                  {colorAttribute?.options.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-md border border-neutral-dark"
                      style={{ backgroundColor: colorMap[color] || '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

{product.baselinker_variations && product.baselinker_variations.length > 0 && (
  <div className="mt-4">
    <span className="text-base font-semibold">Wariant:</span>
    <select
      className="border border-neutral-dark rounded w-full mt-2 py-2 px-3"
      onChange={handleVariationChange}
      value={selectedVariation?.id || ''}
    >
      <option value="">Wybierz Wariant</option> {/* Default option */}
      {product.baselinker_variations.map((variation) => (
        <option key={variation.id} value={variation.id}>
{product.baselinker_variations?.map((variation: Product['baselinker_variations'][0]) => (
  variation.attributes.length
    ? `${variation.attributes.map((attr: { name: string; option: string }) => `${attr.name}: ${attr.option}`).join(', ')} - ${variation.price} zł`
    : `Wariant ${variation.id}`
))}

        </option>
      ))}
    </select>
  </div>
)}

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
