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
import { CartContext } from '@/stores/CartProvider';
import { useWishlist } from '@/context/WhishlistContext';
import Image from 'next/image';
import { Product } from '@/stores/CartProvider';
import useCrossSellProducts from '@/utils/hooks/useCrossSellProducts';
import { InputField } from '@/components/Input/InputField.component';
import { useForm, FormProvider } from 'react-hook-form';

const NajczęściejKupowaneRazem = dynamic(
  () => import('@/components/Product/NajczęściejKupowaneRazem'),
  { ssr: false },
);

const Instagram = dynamic(() => import('@/components/Index/Instagram'), {
  ssr: false,
});

interface NotifyFormData {
  notifyEmail: string;
}

const ProductPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { state, dispatch } = useProductState();
  const { addCartItem } = React.useContext(CartContext);
  const frequentlyBoughtTogetherRef = useRef<HTMLDivElement>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [waitingListError, setWaitingListError] = useState<string | null>(null);

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

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const methods = useForm<NotifyFormData>({
    defaultValues: { notifyEmail: '' },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = methods;

  const notifyEmailValue = watch('notifyEmail');
  const isNotifyEmailValid =
    !!notifyEmailValue && /\S+@\S+\.\S+/.test(notifyEmailValue);

  const { products: crossSellProducts, loading: crossSellLoading } =
    useCrossSellProducts(product ? product.id.toString() : null);

  // Fetch product data on slug change
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const res = await fetch(
          `/api/woocommerce?action=fetchProductBySlug&slug=${encodeURIComponent(slug)}`,
        );
        if (!res.ok) {
          throw new Error('No product found');
        }
        const productData = await res.json();
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

  // Reset quantity to 1 when a new product loads
  useEffect(() => {
    if (product) {
      dispatch({ type: 'SET_QUANTITY', payload: 1 });
    }
  }, [product, dispatch]);

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
    setValidationError(null);
    const updatedAttributes = {
      ...selectedAttributes,
      [attributeName]: value,
    };
    dispatch({
      type: 'UPDATE_ATTRIBUTE',
      payload: { name: attributeName, value },
    });
    const matchedVariation = product?.baselinker_variations?.find((variation) =>
      variation.attributes.every(
        (attr) => updatedAttributes[attr.name] === attr.option,
      ),
    );
    dispatch({
      type: 'SET_VARIATION',
      payload: matchedVariation
        ? {
            ...matchedVariation,
            id: matchedVariation.id.toString(),
            price: matchedVariation.price.toFixed(2),
            regular_price: matchedVariation.regular_price.toFixed(2),
            sale_price: matchedVariation.sale_price.toFixed(2),
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

  // **********************************************
  // Stock Logic – works for both simple and variable products
  // **********************************************
  let availableStock = 0;
  if (product) {
    if (
      product.baselinker_variations &&
      product.baselinker_variations.length > 0
    ) {
      // For variable products:
      // If a variation is selected and it has a defined stock_quantity, use it.
      if (
        selectedVariation &&
        (selectedVariation as any).stock_quantity !== null &&
        (selectedVariation as any).stock_quantity !== ''
      ) {
        availableStock = Number((selectedVariation as any).stock_quantity);
      }
      // Fallback: if the main product defines stock_quantity, use that.
      else if ((product as any).stock_quantity) {
        availableStock = Number((product as any).stock_quantity);
      }
      // Otherwise, sum the stock quantities of all variations.
      else {
        availableStock = product.baselinker_variations.reduce(
          (sum, variation) => {
            const qty =
              (variation as any).stock_quantity !== null &&
              (variation as any).stock_quantity !== ''
                ? Number((variation as any).stock_quantity)
                : 0;
            return sum + qty;
          },
          0,
        );
      }
    } else {
      // For simple products:
      availableStock = Number((product as any).stock_quantity || 0);
    }
  }
  console.log('[DEBUG] availableStock computed:', availableStock);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    console.log('[DEBUG] handleQuantityChange', {
      type,
      quantity,
      availableStock,
      selectedVariation,
    });
    if (type === 'increase') {
      if (quantity >= availableStock) {
        console.log(
          '[DEBUG] Maximum quantity reached:',
          quantity,
          availableStock,
        );
        setValidationError(
          'Nie można dodać więcej produktów niż dostępne w magazynie.',
        );
        return;
      }
      dispatch({ type: 'SET_QUANTITY', payload: quantity + 1 });
    } else {
      if (validationError) setValidationError(null);
      dispatch({ type: 'SET_QUANTITY', payload: Math.max(1, quantity - 1) });
    }
  };

  const handleAddToCart = () => {
    console.log('[DEBUG] handleAddToCart', {
      quantity,
      availableStock,
      selectedVariation,
    });
    if (!product) return;

    if (quantity > availableStock) {
      console.log(
        '[DEBUG] Trying to add more than available stock:',
        quantity,
        availableStock,
      );
      setValidationError(
        'Nie można dodać więcej produktów niż dostępne w magazynie.',
      );
      return;
    }

    if (product.baselinker_variations?.length && !selectedVariation) {
      setValidationError('Wybierz wariant przed dodaniem do koszyka.');
      return;
    }

    // Proceed with add-to-cart logic
    const price = parseFloat(selectedVariation?.price || product.price);
    const variationOptions: {
      [key: string]: { option: string; price: number }[];
    } = {};
    product.baselinker_variations?.forEach((variation) => {
      variation.attributes.forEach((attr) => {
        if (!variationOptions[attr.name]) {
          variationOptions[attr.name] = [];
        }
        variationOptions[attr.name].push({
          option: attr.option,
          price: variation.price,
        });
      });
    });
    const cartItem: Product = {
      cartKey: selectedVariation?.id || product.id.toString(),
      name: product.name,
      qty: quantity,
      price: parseFloat(price.toFixed(2)),
      totalPrice: parseFloat((quantity * price).toFixed(2)),
      image:
        selectedVariation?.image?.sourceUrl ||
        product.images?.[0]?.src ||
        '/fallback-image.jpg',
      productId: parseInt(product.id.toString(), 10),
      variationId: selectedVariation?.id
        ? parseInt(selectedVariation.id, 10)
        : undefined,
      attributes: selectedAttributes,
      variationOptions,
      availableStock,
    };

    addCartItem(cartItem);
    dispatch({ type: 'TOGGLE_MODAL', payload: true });
  };
  const onNotifySubmit = async (data: NotifyFormData) => {
    try {
      const res = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.notifyEmail,
          product_id: product?.id,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.code === 'woocommerce_rest_cannot_view') {
          throw new Error(
            'Wygląda na to, że ten adres email został już zapisany do listy oczekujących.',
          );
        } else {
          throw new Error(
            'Nie udało się zapisać, email jest już zapisany do listy oczekujących. ',
          );
        }
      }
      setSuccessMessage(
        'Zapisaliśmy Twój adres. Wyślemy Ci powiadomienie, kiedy produkt pojawi się w sprzedaży.',
      );
      reset();
      setShowNotifyForm(false);
      setWaitingListError(null);
    } catch (error) {
      console.error('Error subscribing to waiting list:', error);
      setWaitingListError((error as Error).message);
    }
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

  // Determine out‑of‑stock status based on availableStock
  const isOutOfStock =
    availableStock !== null
      ? availableStock === 0
      : (product as any)?.stock_status === 'outofstock';

  return (
    <Layout title={`Hvyt | ${product?.name || 'Ładowanie...'}`}>
      <section className="max-w-[1440px] mt-[88px] md:mt-[140px] container mx-auto">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <div className="order-1 w-full lg:order-1 lg:w-8/12">
            <div className="block lg:hidden min-h-[300px]">
              {product && <SingleProductGallery images={galleryImages} />}
            </div>
            <div className="hidden lg:block">
              {product && <SingleProductGallery images={galleryImages} />}
              {product && <SingleProductDetails product={product} />}
            </div>
          </div>

          <div className="order-2 w-full lg:order-2 lg:w-4/12 flex flex-col gap-6 mx-4 md:mx-0 lg:sticky lg:top-20 self-start">
            <h1 className=" text-[24px] md:text-[32px] font-semibold">
              {product?.name}
            </h1>
            <p className="text-[24px] md:text-[28px] font-bold text-dark-pastel-red">
              {selectedVariation?.price
                ? parseFloat(selectedVariation.price).toFixed(2)
                : product?.price
                  ? parseFloat(product.price).toFixed(2)
                  : '0.00'}{' '}
              zł
            </p>
            {validationError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-2">
                <span>{validationError}</span>
              </div>
            )}
            <ColorSwitcher
              options={
                product?.attributes?.find((attr) => attr.name === 'Kolor OK')
                  ?.options || []
              }
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
              colorMap={{
                Złoty: '#f5f5ad',
                Srebrny: '#e9eaed',
                Czarny: '#031926',
                Szary: '#e9eaed',
                Różowy: '#ebb2ad',
                Pozostałe: '#661f30',
                Niebieski: '#9fc1df',
                Biały: '#fff',
              }}
            />
            <div className="flex items-center gap-4">
              {product?.baselinker_variations?.[0]?.attributes?.length ? (
                <>
                  <div className="flex-1">
                    {product?.baselinker_variations?.[0]?.attributes.map(
                      (attr) => {
                        const pricesMap = product.baselinker_variations?.reduce(
                          (map, variation) => {
                            const option = variation.attributes.find(
                              (a) => a.name === attr.name,
                            )?.option;
                            if (option) {
                              map[option] = variation.price.toFixed(2);
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
            {isOutOfStock ? (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onNotifySubmit)}>
                  {showNotifyForm && (
                    <div className="mb-4">
                      <InputField
                        inputLabel="Podaj adres email"
                        inputName="notifyEmail"
                        type="email"
                        customValidation={{
                          required: 'To pole jest wymagane',
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Niepoprawny adres email',
                          },
                        }}
                        errors={errors}
                        {...register('notifyEmail', {
                          required: 'To pole jest wymagane',
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Niepoprawny adres email',
                          },
                        })}
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    onClick={(e) => {
                      if (!showNotifyForm) {
                        e.preventDefault();
                        setShowNotifyForm(true);
                      }
                    }}
                    disabled={showNotifyForm && !isNotifyEmailValid}
                    className={`w-4/5 py-3 text-[16px] md:text-[24px] font-light rounded-full flex justify-center items-center transition-colors ${
                      showNotifyForm && !isNotifyEmailValid
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-dark-pastel-red'
                    }`}
                  >
                    Powiadom o dostępności
                  </button>
                  {waitingListError && (
                    <p className="text-red-500 mt-2">
                      Błąd: {waitingListError}
                    </p>
                  )}
                </form>
              </FormProvider>
            ) : (
              <button
                onClick={handleAddToCart}
                type="button"
                className="w-4/5 py-3 text-[16px] md:text-[24px] font-light rounded-full flex justify-center items-center transition-colors bg-black text-white hover:bg-dark-pastel-red"
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
            )}
            {successMessage && (
              <div className="bg-[#2A5E45] text-white px-4 py-2 rounded-lg mt-4 flex items-center">
                <img
                  src="/icons/circle-check.svg"
                  alt="Success"
                  className="w-5 h-5 mr-2"
                />
                <span>
                  <strong>Zapisalismy Twój adres.</strong>
                  <br />
                  <span className="font-light">
                    Wyślemy Ci powiadomienie kiedy produkt pojawi się w
                    sprzedaży
                  </span>
                </span>
              </div>
            )}

            <DeliveryReturnInfo
              onScrollToSection={handleScrollToFrequentlyBought}
              stock={availableStock}
              stockStatus={
                selectedVariation
                  ? (selectedVariation as any).stock_status
                  : product && (product as any).stock_status
              }
            />
          </div>
        </div>
        <div className="block lg:hidden mt-[64px] md:mt-6">
          {product && <SingleProductDetails product={product} />}
        </div>
      </section>
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
          ).toFixed(2)}
          onClose={() => dispatch({ type: 'TOGGLE_MODAL', payload: false })}
          crossSellProducts={crossSellProducts}
          loading={crossSellLoading}
        />
      )}
      <div ref={frequentlyBoughtTogetherRef}>
        <NajczęściejKupowaneRazem
          productId={product?.id?.toString() || ''}
          crossSellProducts={crossSellProducts}
          crossSellLoading={crossSellLoading}
        />
      </div>
      <Instagram />
      <div className="w-full">
        {product && <Reviews productId={Number(product.id)} />}
      </div>
    </Layout>
  );
};

export default ProductPage;
