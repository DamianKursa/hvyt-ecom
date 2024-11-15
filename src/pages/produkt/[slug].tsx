import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import NajczęściejKupowaneRazem from '@/components/Product/NajczęściejKupowaneRazem';
import SingleProductGallery from '@/components/SingleProduct/SingleProductGallery.component';
import Snackbar from '@/components/UI/Snackbar.component';
import SkeletonProductPage from '@/components/Skeletons/SkeletonProductPage.component';
import SingleProductDetails from '@/components/SingleProduct/SingleProductDetails';
import { fetchProductBySlug, fetchMediaById } from '@/utils/api/woocommerce';
import Image from 'next/image';
import { CartContext } from '@/stores/CartProvider';
import { Product, Variation } from '@/utils/functions/interfaces';
import Instagram from '@/components/Index/Instagram';
import CartModal from '@/components/Cart/CartModal';

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { addCartItem } = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success',
  );
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null,
  );
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // State to manage selected color

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
          const featuredImage = await fetchMediaById(
            productData.featured_media,
          );
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

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));

    if (product?.baselinker_variations) {
      const matchedVariation = product.baselinker_variations.find((variation) =>
        variation.attributes.every(
          (attr) =>
            selectedAttributes[attr.name] === attr.option ||
            attr.name === attributeName,
        ),
      );

      setSelectedVariation(
        matchedVariation
          ? {
              ...matchedVariation,
              id: matchedVariation.id.toString(),
              price: matchedVariation.price.toString(),
              regular_price: matchedVariation.regular_price.toString(),
              sale_price: matchedVariation.sale_price.toString(),
              image: {
                sourceUrl: matchedVariation.image.src,
              },
            }
          : null,
      );
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    handleAttributeChange('Kolor', color);
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    setQuantity((prevQuantity) =>
      type === 'increase'
        ? prevQuantity + 1
        : prevQuantity > 1
          ? prevQuantity - 1
          : 1,
    );
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      cartKey: product.id.toString(),
      name: product.name,
      qty: quantity,
      price: parseFloat(selectedVariation?.price || product.price), // Ensure it's a number
      totalPrice:
        quantity * parseFloat(selectedVariation?.price || product.price), // Keep as number
      image: { sourceUrl: product.image, title: product.name },
      productId: parseInt(product.id.toString(), 10),
      attributes: selectedAttributes,
    };

    addCartItem(cartItem); // Add item to cart using addCartItem from CartContext
    setShowModal(true); // Show modal instead of Snackbar
  };

  const handleCloseModal = () => setShowModal(false);

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
        <Snackbar
          message={snackbarMessage}
          type={snackbarType}
          visible={showSnackbar}
        />
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

  const galleryImages = selectedVariation?.image?.sourceUrl
    ? [
        {
          id: selectedVariation.id,
          sourceUrl: selectedVariation.image.sourceUrl,
        },
      ]
    : product.images?.map((img, index) => ({
        id: `image-${index}`,
        sourceUrl: img.src,
      })) || [{ id: 'default-id', sourceUrl: product.image }];

  // Find color attribute
  const colorAttribute = product.attributes.find(
    (attr) => attr.name === 'Kolor',
  );

  return (
    <Layout title={product.name}>
      <section className="container mx-auto py-12 max-w-grid-desktop px-grid-desktop-margin">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <div className="lg:w-8/12 flex flex-col gap-6">
            <SingleProductGallery images={galleryImages} />
            <SingleProductDetails product={product} />
          </div>

          {/* Product Details */}
          <div className="lg:w-4/12 flex flex-col gap-6">
            {/* Product Name and Price */}
            <div className="w-full">
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-dark-pastel-red">
                  {selectedVariation?.price || product.price} zł
                </span>
              </div>
            </div>
            {/* Render CartModal when showModal is true */}
            {showModal && (
              <CartModal
                product={{
                  id: product.id.toString(),
                  name: product.name,
                  image:
                    galleryImages[0]?.sourceUrl || '/path/to/default/image.png',
                  price: selectedVariation?.price || product.price,
                }}
                quantity={quantity} // Ensure this is passed
                total={(
                  quantity *
                  parseFloat(selectedVariation?.price || product.price)
                ).toFixed(2)}
                onClose={handleCloseModal}
              />
            )}

            {/* Kolor Attribute (Restored to correct position) */}
            {colorAttribute && (
              <div className="flex align-middle items-center gap-2">
                <span className="text-base font-semibold">Kolor:</span>
                <div className="flex gap-2 mt-2">
                  {colorAttribute.options.map(
                    (color: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleColorChange(color)}
                        className={`w-8 h-8 rounded-md cursor-pointer border ${
                          selectedColor === color
                            ? 'border-dark-pastel-red'
                            : 'border-neutral-dark'
                        }`}
                        style={{ backgroundColor: colorMap[color] || '#ccc' }}
                      />
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Custom Dropdown Attribute Selector */}
            {product.baselinker_variations?.[0]?.attributes.map((attr) => (
              <div key={attr.name} className="mt-4 relative">
                <button
                  onClick={() =>
                    setDropdownOpen((prev) => ({
                      ...prev,
                      [attr.name]: !prev[attr.name],
                    }))
                  }
                  className="border rounded-[24px] w-full text-[16px] p-[7px_16px] font-bold flex justify-between items-center bg-white shadow-md hover:bg-gray-100"
                >
                  <span>
                    {selectedAttributes[attr.name] || `Wybierz ${attr.name}`}
                  </span>
                  <img
                    src={
                      dropdownOpen[attr.name]
                        ? '/icons/arrow-up.svg'
                        : '/icons/arrow-down.svg'
                    }
                    alt="Toggle"
                    className="w-[16px] h-[16px]"
                  />
                </button>
                {dropdownOpen[attr.name] && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-[16px] shadow-lg z-20">
                    {Array.from(
                      new Set(
                        product.baselinker_variations?.map(
                          (v) =>
                            v.attributes.find((a) => a.name === attr.name)
                              ?.option,
                        ),
                      ),
                    ).map(
                      (option, index) =>
                        option && (
                          <div
                            key={`${attr.name}-${index}`}
                            onClick={() => {
                              handleAttributeChange(attr.name, option);
                              setDropdownOpen((prev) => ({
                                ...prev,
                                [attr.name]: false,
                              }));
                            }}
                            className={`cursor-pointer p-4 hover:bg-gray-100 ${
                              selectedAttributes[attr.name] === option
                                ? 'bg-gray-100'
                                : ''
                            } ${index === 0 ? 'rounded-t-[16px]' : ''} ${
                              index ===
                              Array.from(
                                new Set(
                                  product.baselinker_variations?.map(
                                    (v) =>
                                      v.attributes.find(
                                        (a) => a.name === attr.name,
                                      )?.option,
                                  ),
                                ),
                              ).length -
                                1
                                ? 'rounded-b-[16px]'
                                : ''
                            }`}
                          >
                            {option}
                          </div>
                        ),
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add to Cart and Wishlist */}
            <div className="flex items-center mt-4 space-x-4">
              <button
                onClick={handleAddToCart}
                className="w-4/5 py-3 text-lg font-semibold text-white bg-black rounded-full flex justify-center items-center hover:bg-dark-pastel-red transition-colors"
              >
                Dodaj do koszyka
                <Image
                  src="/icons/dodaj-do-koszyka.svg"
                  alt="Add to Cart"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </button>

              <button className="w-1/5 p-3 border rounded-full border-neutral-dark text-neutral-dark hover:text-red-600 hover:border-red-600 flex justify-center items-center">
                <Image
                  src="/icons/wishlist.svg"
                  alt="Wishlist"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* Delivery and Return Information */}
            <div className="mt-4 border border-[#DAD3C8] rounded-[24px]">
              <div
                className="flex items-center p-4 space-x-4 border-b border-[#DAD3C8]"
                style={{ width: '80%' }}
              >
                <Image
                  src="/icons/wysylka-w-24.svg"
                  alt="Shipping within 24 hours"
                  width={24}
                  height={24}
                />
                <span>Wysyłka w 24h</span>
              </div>
              <div
                className="flex items-center p-4 space-x-4 border-b border-[#DAD3C8]"
                style={{ width: '80%' }}
              >
                <Image
                  src="/icons/zwrot.svg"
                  alt="Return Policy"
                  width={24}
                  height={24}
                />
                <span>30 dni na zwrot</span>
              </div>
              <div
                className="flex items-center p-4 space-x-4"
                style={{ width: '80%' }}
              >
                <Image
                  src="/icons/kupowane-razem.svg"
                  alt="Kupowane razem"
                  width={24}
                  height={24}
                />
                <span>Sprawdź produkty najczęściej kupowane razem</span>
              </div>
            </div>
          </div>
        </div>

        {showSnackbar && (
          <Snackbar
            message={snackbarMessage}
            type={snackbarType}
            visible={showSnackbar}
          />
        )}
      </section>

      <section>
        <div>
          <NajczęściejKupowaneRazem productId={product?.id} />
        </div>
      </section>
      <section>
        <div>
          <Instagram />
        </div>
      </section>
    </Layout>
  );
};

export default ProductPage;
// NIe dodal color switchera nie wyswietl sie na karcie produktu
