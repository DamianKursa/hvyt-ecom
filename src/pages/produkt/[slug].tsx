import React, { useEffect, useMemo, useRef } from 'react';
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

  const handleScrollToFrequentlyBought = () => {
    frequentlyBoughtTogetherRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  const handleAttributeChange = (attributeName: string, value: string) => {
    // Update selected attributes
    dispatch({
      type: 'UPDATE_ATTRIBUTE',
      payload: { name: attributeName, value },
    });

    // Match the correct variation based on updated attributes
    const matchedVariation = product?.baselinker_variations?.find((variation) =>
      variation.attributes.every((attr) => {
        // Check if all required attributes match, including the updated one
        const selectedValue =
          selectedAttributes[attr.name] ||
          (attr.name === attributeName ? value : null);
        return selectedValue === attr.option;
      }),
    );

    // Update the selected variation in state
    dispatch({
      type: 'SET_VARIATION',
      payload: matchedVariation
        ? {
            ...matchedVariation,
            id: matchedVariation.id.toString(),
            price: matchedVariation.price.toString(),
            regular_price: matchedVariation.regular_price.toString(),
            sale_price: matchedVariation.sale_price.toString(),
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

    const cartItem = {
      cartKey: selectedVariation?.id || product.id.toString(),
      name: product.name,
      qty: quantity,
      price: parseFloat(selectedVariation?.price || product.price),
      totalPrice:
        quantity * parseFloat(selectedVariation?.price || product.price),
      image:
        selectedVariation?.image?.sourceUrl ||
        product.images?.[0]?.src ||
        '/fallback-image.jpg',
      productId: parseInt(product.id.toString(), 10),
      attributes: selectedAttributes,
    };

    console.log('Adding to cart:', cartItem);
    addCartItem(cartItem);
    dispatch({ type: 'TOGGLE_MODAL', payload: true });
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
          message={snackbar.message}
          type={snackbar.type}
          visible={snackbar.visible}
        />
      </Layout>
    );
  }

  return (
    <Layout title={product?.name || 'Product'}>
      <section className="container mx-auto">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <div className="lg:w-8/12 flex flex-col gap-6">
            {product && <SingleProductGallery images={galleryImages} />}
            {product && <SingleProductDetails product={product} />}
          </div>

          <div className="lg:w-4/12 flex flex-col gap-6 sticky top-20 self-start">
            <h1 className="text-3xl font-semibold">{product?.name}</h1>
            <p className="text-4xl font-bold text-dark-pastel-red">
              {selectedVariation?.price || product?.price} zł
            </p>

            {showModal && (
              <CartModal
                product={{
                  id: product!.id.toString(),
                  name: product!.name,
                  image: galleryImages[0]?.sourceUrl || '/fallback-image.jpg',
                  price: selectedVariation?.price || product!.price,
                }}
                total={(
                  quantity *
                  parseFloat(selectedVariation?.price || product!.price)
                ).toFixed(2)}
                onClose={() =>
                  dispatch({ type: 'TOGGLE_MODAL', payload: false })
                }
                crossSellProducts={[]} // Replace with your cross-sell data
                loading={false} // Replace with your actual loading state
              />
            )}

            <ColorSwitcher
              options={
                product?.attributes.find((attr) => attr.name === 'Kolor')
                  ?.options || []
              }
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
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
              <div className="flex-1">
                {product?.baselinker_variations?.[0]?.attributes.map((attr) => (
                  <AttributeSwitcher
                    key={attr.name}
                    attributeName={attr.name}
                    options={Array.from(
                      new Set(
                        product?.baselinker_variations?.map(
                          (variation) =>
                            variation.attributes.find(
                              (a) => a.name === attr.name,
                            )?.option,
                        ),
                      ),
                    ).filter((option): option is string => Boolean(option))}
                    selectedValue={selectedAttributes[attr.name] || null}
                    onAttributeChange={handleAttributeChange}
                  />
                ))}
              </div>
              <div className="w-2/5">
                <QuantityChanger
                  quantity={quantity}
                  onIncrease={() => handleQuantityChange('increase')}
                  onDecrease={() => handleQuantityChange('decrease')}
                />
              </div>
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

              <button className="w-1/5 h-[64px] w-[64px] p-3 border rounded-full border-neutral-dark text-neutral-dark hover:text-red-600 hover:border-red-600 flex justify-center items-center">
                <Image
                  src="/icons/wishlist.svg"
                  alt="Wishlist"
                  width={28}
                  height={28}
                />
              </button>
            </div>

            <DeliveryReturnInfo
              onScrollToSection={handleScrollToFrequentlyBought}
            />
          </div>
        </div>
        <div ref={frequentlyBoughtTogetherRef}>
          <NajczęściejKupowaneRazem productId={product?.id?.toString() || ''} />
        </div>
        <Instagram />
        {product && <Reviews productId={Number(product.id)} />}
      </section>
    </Layout>
  );
};

export default ProductPage;
