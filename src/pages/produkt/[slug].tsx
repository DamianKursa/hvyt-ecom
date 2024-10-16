import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/Product/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import SkeletonProductPage from '@/components/Product/SkeletonProductPage.component';
import { fetchProductBySlug, fetchMediaById } from '@/utils/api/woocommerce';
import DOMPurify from 'dompurify'; // For sanitizing HTML

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [showSnackbar, setShowSnackbar] = useState(false);

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

  const galleryImages = product.images?.map((img: any) => img.src) || [product.image];

  const colorAttribute = product.attributes?.find(attr => attr.name === 'pa_kolor');
  const spreadAttribute = product.attributes?.find(attr => attr.name === 'pa_rozstaw');

  return (
    <Layout title={product.name}>
      <section className="container mx-auto py-12 max-w-grid-desktop px-grid-desktop-margin">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* Left Side (Gallery Section) */}
          <div className="lg:w-7/12 flex flex-col gap-6">
            <SingleProductGallery
              images={galleryImages.map((src: string) => ({
                id: src || "default-id",
                sourceUrl: src || "/placeholder.jpg",
              }))}
            />
          </div>

          {/* Right Side (Product Details) */}
          <div className="lg:w-5/12 flex flex-col gap-6">
            {/* Price */}
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-red-600">
                {product.sale_price || product.price} zł
              </span>
              {product.sale_price && (
                <>
                  <span className="text-sm line-through text-neutral-darkest">
                    {product.regular_price} zł
                  </span>
                  <span className="text-sm text-red-600">Najniższa cena: {product.lowest_price} zł</span>
                </>
              )}
            </div>

            {/* Color Attribute */}
            {colorAttribute && (
              <div>
                <span className="text-sm font-semibold">Kolor</span>
                <div className="flex gap-2 mt-2">
                  {colorAttribute.options.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-neutral-dark"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rozstaw Attribute */}
            {spreadAttribute && (
              <div className="mt-4">
                <span className="text-sm font-semibold">Rozstaw</span>
                <select className="border rounded w-full mt-2">
                  {spreadAttribute.options.map((option: string, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart and Wishlist */}
            <div className="mt-4">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="w-16 border rounded text-center"
              />
              <button className="w-full py-3 mt-4 text-lg font-semibold text-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors">
                Dodaj do koszyka
              </button>
              <button className="mt-4 py-3 w-full text-lg font-semibold text-black border border-neutral-dark rounded-full">
                Dodaj do listy życzeń
              </button>
            </div>

            {/* Additional Info */}
            <ul className="mt-6 list-disc ml-5 text-sm">
              <li>Wysyłka w 24h</li>
              <li>30 dni na zwrot</li>
              <li>Najlepsza jakość gwarantowana</li>
            </ul>
          </div>
        </div>

        {/* Detailed Product Info (Expandable Sections) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Szczegóły produktu</h2>
          <div
            className="text-sm text-neutral-darkest leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
          />
        </div>

        {/* "Frequently Bought Together" Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Najczęściej kupowane razem</h2>
          <div className="flex space-x-4">
            {/* Displaying products horizontally */}
            {/* Add product preview components here */}
          </div>
        </div>

        {/* Snackbar for messages */}
        {showSnackbar && <Snackbar message={snackbarMessage} type={snackbarType} visible={showSnackbar} />}
      </section>
    </Layout>
  );
};

export default ProductPage;
