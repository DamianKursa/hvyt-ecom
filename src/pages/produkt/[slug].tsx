import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/Product/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import SkeletonProductPage from '@/components/Product/SkeletonProductPage.component';
import { fetchProductBySlug, fetchMediaById } from '@/utils/api/woocommerce';
import DOMPurify from 'dompurify'; // For sanitizing HTML
import Image from 'next/image';

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false); // For expanding Szczegóły produktu
  const [toggleFields, setToggleFields] = useState({
    wymiary: false,
    informacjeDodatkowe: false,
    karta: false,
  }); // Toggles for each additional field

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        const productData = await fetchProductBySlug(slug);
        if (!productData) {
          setErrorMessage('No product found');
          setSnackbarMessage('No product found');
          setSnackbarType('error');
          setShowSnackbar(true);
          return;
        }

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

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    setQuantity((prevQuantity) =>
      type === 'increase' ? prevQuantity + 1 : prevQuantity > 1 ? prevQuantity - 1 : 1
    );
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleField = (field: 'wymiary' | 'informacjeDodatkowe' | 'karta') => {
    setToggleFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
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

  const galleryImages = product.images?.map((img: any) => img.src) || [product.image];

  const colorAttribute = product.attributes?.find((attr) => attr.name === 'pa_kolor');
  const spreadAttribute = product.attributes?.find((attr) => attr.name === 'pa_rozstaw');
  const variantAttribute = product.attributes?.find((attr) => attr.name === 'pa_wariant');

  const colorMap = {
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
          {/* Gallery Section: 80% width */}
          <div className="lg:w-8/12 flex flex-col gap-6">
            <SingleProductGallery
              images={galleryImages.map((src: string) => ({
                id: src || 'default-id',
                sourceUrl: src || '/placeholder.jpg',
              }))}
            />

            {/* Szczegóły produktu with Expand/Collapse */}
            {product.meta_data?.find((meta: any) => meta.key === 'szczegoly_produktu') && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Szczegóły produktu</h2>
                <div
                  className={`text-neutral-darkest transition-all ${
                    isExpanded ? 'max-h-full' : 'max-h-[6rem] overflow-hidden'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      product.meta_data.find((meta: any) => meta.key === 'szczegoly_produktu').value
                    ),
                  }}
                />
                <button
                  className="text-black underline mt-2"
                  onClick={handleToggleExpand}
                  style={{ background: 'none', border: 'none' }}
                >
                  {isExpanded ? 'Zwiń' : 'Rozwiń'}
                </button>
              </div>
            )}

            {/* Toggleable Additional Fields */}
            <div className="mt-4">
              {/* Wymiary */}
              {product.meta_data?.find((meta: any) => meta.key === 'wymiary') && (
                <>
                  <div
                    className="cursor-pointer border-b border-neutral-light pb-2 mb-2"
                    onClick={() => toggleField('wymiary')}
                  >
                    <h3 className="text-lg font-semibold">Wymiary</h3>
                  </div>
                  {toggleFields.wymiary && (
                    <p className="text-neutral-darkest">
                      {DOMPurify.sanitize(
                        product.meta_data.find((meta: any) => meta.key === 'wymiary').value
                      )}
                    </p>
                  )}
                </>
              )}

              {/* Informacje dodatkowe */}
              {product.meta_data?.find((meta: any) => meta.key === 'informacje_dodatkowe') && (
                <>
                  <div
                    className="cursor-pointer border-b border-neutral-light pb-2 mb-2"
                    onClick={() => toggleField('informacjeDodatkowe')}
                  >
                    <h3 className="text-lg font-semibold">Informacje dodatkowe</h3>
                  </div>
                  {toggleFields.informacjeDodatkowe && (
                    <p className="text-neutral-darkest">
                      {DOMPurify.sanitize(
                        product.meta_data.find((meta: any) => meta.key === 'informacje_dodatkowe').value
                      )}
                    </p>
                  )}
                </>
              )}

              {/* Karta produktu i model 3D */}
              {product.meta_data?.find((meta: any) => meta.key === 'karta') && (
                <>
                  <div
                    className="cursor-pointer border-b border-neutral-light pb-2 mb-2"
                    onClick={() => toggleField('karta')}
                  >
                    <h3 className="text-lg font-semibold">Karta produktu i model 3D</h3>
                  </div>
                  {toggleFields.karta && (
                    <p className="text-neutral-darkest">
                      {DOMPurify.sanitize(product.meta_data.find((meta: any) => meta.key === 'karta').value)}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Product Details Section (right side) */}
          <div className="lg:w-4/12 flex flex-col gap-6">
            {/* Product Name and Price */}
            <div className="w-full">
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-red-700">
                  {product.sale_price || product.price} zł
                </span>
                {product.sale_price && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg line-through text-neutral-darkest">
                      {product.regular_price} zł
                    </span>
                    <span className="text-sm text-red-600">
                      -{Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)}%
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
                  {colorAttribute.options.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-md border border-neutral-dark"
                      style={{ backgroundColor: colorMap[color] || '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rozstaw Dropdown or Wariant Fallback */}
            <div className="flex items-center mt-4">
              {spreadAttribute ? (
                <div className="w-7/12 mr-2">
                  <span className="text-base font-semibold">Rozstaw</span>
                  <select className="border border-neutral-dark rounded w-full mt-2 py-2 px-3">
                    {spreadAttribute.options.map((option: string, index: number) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                variantAttribute && (
                  <div className="w-7/12 mr-2">
                    <span className="text-base font-semibold">Wariant</span>
                    <select className="border border-neutral-dark rounded w-full mt-2 py-2 px-3">
                      {variantAttribute.options.map((option: string, index: number) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}

              {/* Quantity Control */}
              <div className="flex items-center w-5/12">
                <button
                  className="border border-neutral-dark rounded-full w-8 h-8 flex justify-center items-center"
                  onClick={() => handleQuantityChange('decrease')}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="text-center border border-neutral-dark rounded mx-2 w-12 h-8"
                />
                <button
                  className="border border-neutral-dark rounded-full w-8 h-8 flex justify-center items-center"
                  onClick={() => handleQuantityChange('increase')}
                >
                  +
                </button>
              </div>
            </div>

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
