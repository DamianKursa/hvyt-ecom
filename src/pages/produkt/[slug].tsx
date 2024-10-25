import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/Product/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import SkeletonProductPage from '@/components/Product/SkeletonProductPage.component';
import { fetchProductBySlug, fetchMediaById } from '@/utils/api/woocommerce';
import DOMPurify from 'dompurify'; // For sanitizing HTML
import Image from 'next/image';
import { Product, ProductAttribute, Variation } from '@/utils/functions/interfaces';

// Define the cleanHTML function here
const cleanHTML = (html: string) => {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
};

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
  
  // Point 2: Set selectedVariation type to Variation | null
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

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

        productData.variations = productData.baselinker_variations?.map((variation: {
          id: number;
          sku: string;
          in_stock: boolean;
          stock_quantity: string;
          price: number;
          regular_price: number;
          sale_price: number;
          description: string;
          visible: boolean;
          manage_stock: boolean;
          purchasable: boolean;
          on_sale: boolean;
          image: {
            id: number;
            src: string;
          };
          attributes: {
            id: string;
            name: string;
            option: string;
          }[];
          weight: string;
          meta_data: {
            key: string;
            value: string;
          }[];
        }) => ({
          id: variation.id.toString(),
          name: variation.description,
          price: variation.price.toString(),
          regular_price: variation.regular_price.toString(),
          sale_price: variation.sale_price.toString(),
          image: {
            sourceUrl: variation.image.src,
          },
          attributes: variation.attributes.map((attr) => ({
            id: attr.id,
            name: attr.name,
            option: attr.option,
          })),
        }));
                
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

  // Point 3: Find the matching variation based on selected attributes
  useEffect(() => {
    if (product?.baselinker_variations && Object.keys(selectedAttributes).length > 0) {
      const matchedVariation = product.baselinker_variations.find((v) =>
        v.attributes.every((attr) => selectedAttributes[attr.name] === attr.option)
      );

      setSelectedVariation(matchedVariation ? {
        id: matchedVariation.id.toString(),
        name: matchedVariation.description,
        price: matchedVariation.price.toString(),
        regular_price: matchedVariation.regular_price.toString(),
        sale_price: matchedVariation.sale_price.toString(),
        image: {
          sourceUrl: matchedVariation.image.src,
        },
        attributes: matchedVariation.attributes.map((attr) => ({
          id: attr.id,
          name: attr.name,
          option: attr.option,
        })),
      } : null);
    }
  }, [selectedAttributes, product]);
  
  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    setQuantity((prevQuantity) =>
      type === 'increase' ? prevQuantity + 1 : prevQuantity > 1 ? prevQuantity - 1 : 1
    );
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
  const galleryImages = selectedVariation?.image?.sourceUrl
    ? [{ id: selectedVariation.id, sourceUrl: selectedVariation.image.sourceUrl }]
    : product.images && product.images.length > 0
    ? product.images.map((img, index) => ({ id: `image-${index}`, sourceUrl: img.src }))
    : [{ id: 'default-id', sourceUrl: product.image }];

  // Find Kolor attribute and ensure it is placed correctly near the top
  const colorAttribute: ProductAttribute | undefined = product.attributes.find(
    (attr: ProductAttribute) => attr.name === 'Kolor OK'
  );

  // Determine if variations are available
  const variationsAvailable = product.baselinker_variations && product.baselinker_variations.length > 0;

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

            {/* Szczegóły produktu */}
            {product.meta_data?.find((meta) => meta.key === 'szczegoly_produktu') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Szczegóły produktu</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(product.meta_data.find((meta) => meta.key === 'szczegoly_produktu')?.value || '')
                  }}
                />
              </div>
            )}

            {/* Wymiary */}
            {product.meta_data?.find((meta) => meta.key === 'wymiary') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Wymiary</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(product.meta_data.find((meta) => meta.key === 'wymiary')?.value || '')
                  }}
                />
              </div>
            )}

            {/* Informacje dodatkowe */}
            {product.meta_data?.find((meta) => meta.key === 'informacje_dodatkowe') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Informacje dodatkowe</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(product.meta_data.find((meta) => meta.key === 'informacje_dodatkowe')?.value || '')
                  }}
                />
              </div>
            )}

            {/* Karta Produktu - Render text and images */}
            {product.meta_data?.find((meta) => meta.key === 'karta') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Karta Produktu</h2>
                <div
                  className="formatted-content" // Added a class for additional styling if needed
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(product.meta_data.find((meta) => meta.key === 'karta')?.value || '')
                  }}
                />
              </div>
            )}

            {/* Model 3D */}
            {product.meta_data?.find((meta) => meta.key === 'model_3d') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Model 3D</h2>
                <div
                  className="w-full" // Ensures the container takes full width
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(product.meta_data.find((meta) => meta.key === 'model_3d')?.value || '')
                  }}
                />
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
                  {selectedVariation?.price || product.price} zł
                </span>
              </div>
            </div>

            {/* Kolor Attribute (Restored to correct position) */}
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
