import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout/Layout.component';
import SingleProductGallery from '@/components/SingleProduct/SingleProductGallery.component';
import SingleProductDetails from '@/components/SingleProduct/SingleProductDetails';
import Snackbar from '@/components/UI/Snackbar.component';
import SkeletonProductPage from '@/components/Skeletons/SkeletonProductPage.component';
import CartModal from '@/components/Cart/CartModal';
import ColorSwitcher from '@/components/SingleProduct/ColorSwitcher.component';
import DeliveryReturnInfo from '@/components/SingleProduct/DeliveryReturnInfo.component';
import AttributeSwitcher from '@/components/UI/AttributeSwitcher.component';
import Reviews from '@/components/Reviews/Reviews';
import QuantityChanger from '@/components/UI/QuantityChanger';
import { useProductState } from '@/utils/hooks/useProductState';
import { fetchProductBySlug } from '@/utils/api/woocommerce';
import { CartContext } from '@/stores/CartProvider';
import { useWishlist } from '@/context/WhishlistContext';
import Image from 'next/image';

const NajczęściejKupowaneRazem = dynamic(
  () => import('@/components/Product/NajczęściejKupowaneRazem'),
  { ssr: false },
);

const Instagram = dynamic(() => import('@/components/Index/Instagram'), {
  ssr: false,
});

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { state, dispatch } = useProductState();
  const { addCartItem } = React.useContext(CartContext);
  const frequentlyBoughtTogetherRef = useRef<HTMLDivElement>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const {
    product,
    loading,
    errorMessage,
    quantity,
    selectedAttributes,
    selectedVariation,
    selectedColor,
    showModal,
    snackbar,
  } = state;

  const [validationError, setValidationError] = useState<string | null>(null); // New state for validation error

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const productData = await fetchProductBySlug(slug);

        if (!productData) {
          dispatch({ type: 'SET_ERROR', payload: 'No product found' });
          dispatch({
            type: 'SHOW_SNACKBAR',
            payload: { message: 'No product found', type: 'error' },
          });
          return;
        }

        dispatch({ type: 'SET_PRODUCT', payload: productData });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Error loading product data' });
        dispatch({
          type: 'SHOW_SNACKBAR',
          payload: { message: 'Error loading product data', type: 'error' },
        });
      }
    };

    fetchData();
  }, [slug, dispatch]);

  const handleWishlistClick = () => {
    if (!product) return;

    const wishlistProduct = {
      name: product.name,
      price: selectedVariation?.price || product.price,
      slug: product.slug,
      images: product.images || [{ src: '/fallback-image.jpg' }],
    };

    if (isInWishlist(product.slug)) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(wishlistProduct);
    }
  };

  const handleScrollToFrequentlyBought = () => {
    frequentlyBoughtTogetherRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    setValidationError(null); // Clear error when a valid attribute is selected

    // Create a temporary updated attributes object
    const updatedAttributes = {
      ...selectedAttributes,
      [attributeName]: value,
    };

    // Dispatch the state update for attributes
    dispatch({
      type: 'UPDATE_ATTRIBUTE',
      payload: { name: attributeName, value },
    });

    // Find the matched variation using the updated attributes
    const matchedVariation = product?.baselinker_variations?.find((variation) =>
      variation.attributes.every((attr) => {
        return updatedAttributes[attr.name] === attr.option;
      }),
    );

    // Dispatch the updated variation
    dispatch({
      type: 'SET_VARIATION',
      payload: matchedVariation
        ? {
            ...matchedVariation,
            id: matchedVariation.id.toString(),
            price: matchedVariation.price.toFixed(2), // Convert to string
            regular_price: matchedVariation.regular_price.toFixed(2), // Convert to string
            sale_price: matchedVariation.sale_price.toFixed(2), // Convert to string
            image: matchedVariation.image
              ? { sourceUrl: matchedVariation.image.src }
              : undefined,
          }
        : null,
    });
  };

  const handleColorChange = (color: string) => {
    dispatch({
      type: 'UPDATE_ATTRIBUTE',
      payload: { name: 'Kolor', value: color },
    });
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    dispatch({
      type: 'SET_QUANTITY',
      payload: type === 'increase' ? quantity + 1 : Math.max(1, quantity - 1),
    });
  };

  const handleAddToCart = () => {
    if (!product) {
      console.error('No product available to add to cart');
      return;
    }

    // Check if the product has variations
    if (product.baselinker_variations?.length) {
      if (!selectedVariation) {
        setValidationError('Wybierz wariant przed dodaniem do koszyka.');
        return;
      }
    }

    const price = parseFloat(selectedVariation?.price || product.price); // Ensure price is a number

    const cartItem = {
      cartKey: selectedVariation?.id || product.id.toString(),
      name: product.name,
      qty: quantity,
      price: parseFloat(price.toFixed(2)), // Convert to number and format
      totalPrice: parseFloat((quantity * price).toFixed(2)), // Calculate total price and format
      image:
        selectedVariation?.image?.sourceUrl ||
        product.images?.[0]?.src ||
        '/fallback-image.jpg',
      productId: parseInt(product.id.toString(), 10),
      variationId: selectedVariation?.id
        ? parseInt(selectedVariation.id, 10)
        : undefined,
      attributes: selectedAttributes,
    };

    console.log('Adding to cart:', cartItem);
    addCartItem(cartItem);
    dispatch({ type: 'TOGGLE_MODAL', payload: true }); // Open the modal
  };

  const galleryImages = useMemo(
    () =>
      selectedVariation?.image?.sourceUrl
        ? [
            {
              id: selectedVariation.id,
              sourceUrl: selectedVariation.image.sourceUrl || '',
            },
          ]
        : product?.images?.map((img, index) => ({
            id: `image-${index}`,
            sourceUrl: img.src || '',
          })) || [{ id: 'default-id', sourceUrl: product?.image || '' }],
    [selectedVariation, product],
  );

  if (loading) {
    return (
      <Layout title="Hvyt | Ładowanie...">
        <SkeletonProductPage />
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout title="Błąd">
        <SkeletonProductPage />
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          visible={snackbar.visible}
        />
      </Layout>
    );
  }

  return (
    <Layout title={`Hvyt | ${product?.name || 'Ładownie...'}`}>
      <section className="max-w-[1440px] container mx-auto">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <div className="lg:w-8/12 flex flex-col gap-6 max-w-full">
            {product && <SingleProductGallery images={galleryImages} />}
            {product && <SingleProductDetails product={product} />}
          </div>

          <div className="lg:w-4/12 flex flex-col gap-6 sticky mx-4 md:mx-0 top-20 self-start">
            <h1 className="text-3xl font-semibold">{product?.name}</h1>
            <p className="text-4xl font-bold text-dark-pastel-red">
              {selectedVariation?.price
                ? parseFloat(selectedVariation.price).toFixed(2)
                : product?.price
                  ? parseFloat(product.price).toFixed(2)
                  : '0.00'}{' '}
              zł
            </p>

            {/* Display validation error below variation box */}
            {validationError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-2">
                <span>{validationError}</span>
              </div>
            )}

            <ColorSwitcher
              options={
                product?.attributes?.find((attr) => attr.name === 'Kolor OK') // Find the "Kolor" attribute
                  ?.options || [] // Use its options if available
              }
              selectedColor={selectedColor} // Pass the selected color from state
              onColorChange={handleColorChange} // Update the selected color in state
              colorMap={{
                Złoty: '#eded87',
                Srebrny: '#c6c6c6',
                Czarny: '#000000',
                Szary: '#a3a3a3',
                Różowy: '#edbbd8',
                Pozostałe: '#c11d51',
                Niebieski: '#a4dae8',
                Biały: '#fff',
              }}
            />

            <div className="flex items-center gap-4">
              {product?.baselinker_variations?.[0]?.attributes?.length ? (
                <>
                  <div className="flex-1">
                    {product?.baselinker_variations?.[0]?.attributes.map(
                      (attr) => {
                        // Build a map of options to prices for the current attribute
                        const pricesMap = product.baselinker_variations?.reduce(
                          (map, variation) => {
                            const option = variation.attributes.find(
                              (a) => a.name === attr.name,
                            )?.option;
                            if (option) {
                              map[option] = variation.price.toFixed(2); // Format price with 2 decimal places
                            }
                            return map;
                          },
                          {} as { [key: string]: string },
                        );

                        return (
                          <AttributeSwitcher
                            key={attr.name}
                            attributeName={attr.name}
                            options={Array.from(
                              new Set(
                                product?.baselinker_variations?.map(
                                  (variation) =>
                                    variation.attributes?.find(
                                      (a) => a.name === attr.name,
                                    )?.option,
                                ),
                              ),
                            ).filter((option): option is string =>
                              Boolean(option),
                            )}
                            selectedValue={
                              selectedAttributes[attr.name] || null
                            }
                            onAttributeChange={handleAttributeChange}
                            pricesMap={pricesMap}
                          />
                        );
                      },
                    )}
                  </div>
                  <div className="w-2/5">
                    <QuantityChanger
                      quantity={quantity}
                      onIncrease={() => handleQuantityChange('increase')}
                      onDecrease={() => handleQuantityChange('decrease')}
                    />
                  </div>
                </>
              ) : (
                <div className="w-2/5">
                  <QuantityChanger
                    quantity={quantity}
                    onIncrease={() => handleQuantityChange('increase')}
                    onDecrease={() => handleQuantityChange('decrease')}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center mt-4 space-x-4">
              <button
                onClick={handleAddToCart}
                className="w-4/5 py-3 text-[24px] font-light text-white bg-black rounded-full flex justify-center items-center hover:bg-dark-pastel-red transition-colors"
              >
                Dodaj do koszyka
                <Image
                  src="/icons/dodaj-do-koszyka.svg"
                  alt="Add to Cart"
                  width={28}
                  height={28}
                  className="ml-2"
                />
              </button>

              {product && (
                <button
                  onClick={handleWishlistClick}
                  className={`w-1/5 w-[64px] h-[64px] p-3 border rounded-[100px] ${
                    isInWishlist(product.slug)
                      ? 'border-black'
                      : 'border-black text-black'
                  }  flex justify-center items-center transition`}
                >
                  <Image
                    src={
                      isInWishlist(product.slug)
                        ? '/icons/heart-added.svg'
                        : '/icons/wishlist.svg'
                    }
                    alt="Wishlist"
                    width={34}
                    height={31}
                  />
                </button>
              )}
            </div>
            {/* Cart Modal */}
            {showModal && product && (
              <CartModal
                product={{
                  id: product.id.toString(),
                  name: product.name,
                  image:
                    selectedVariation?.image?.sourceUrl ||
                    galleryImages[0]?.sourceUrl ||
                    '/fallback-image.jpg',
                  price: selectedVariation?.price
                    ? parseFloat(selectedVariation.price).toFixed(2)
                    : parseFloat(product.price).toFixed(2),
                }}
                total={(
                  quantity *
                  parseFloat(selectedVariation?.price || product.price || '0')
                ).toFixed(2)} // Ensure total is a string
                onClose={() =>
                  dispatch({ type: 'TOGGLE_MODAL', payload: false })
                }
                crossSellProducts={[]} // Optional: Pass cross-sell products here
                loading={false} // Replace with actual loading state if needed
              />
            )}

            <DeliveryReturnInfo
              onScrollToSection={handleScrollToFrequentlyBought}
            />
          </div>
        </div>
      </section>
      <div ref={frequentlyBoughtTogetherRef}>
        <NajczęściejKupowaneRazem productId={product?.id?.toString() || ''} />
      </div>
      <Instagram />
      <div className="w-full">
        {product && <Reviews productId={Number(product.id)} />}
      </div>
    </Layout>
  );
};

export default ProductPage;
