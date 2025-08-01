import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useUserContext } from '@/context/UserContext';
import { ExternalIdContext } from '@/context/ExternalIdContext';
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
import { Product, Category } from '@/stores/CartProvider';
import useCrossSellProducts from '@/utils/hooks/useCrossSellProducts';
import { InputField } from '@/components/Input/InputField.component';
import { useForm, FormProvider } from 'react-hook-form';
import Head from 'next/head';
import LowestPriceInfo from '@/components/SingleProduct/LowestPriceInfo';
import { pushGTMEvent } from '@/utils/gtm';

const NajczęściejKupowaneRazem = dynamic(
  () => import('@/components/Product/CrossSell'),
  { ssr: false },
);

const Instagram = dynamic(() => import('@/components/Index/Instagram'), {
  ssr: false,
});
// ────────── Add this "BaselinkerVariation" alias at the top ──────────
interface BaselinkerVariation {
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
  attributes: Array<{
    id: string;
    name: string;
    option: string;
  }>;
  weight: string;
  meta_data: Array<{
    key: string;
    value: string;
  }>;
}
// ──────────────────────────────────────────────────────────────────────

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
  const externalAnonId = useContext(ExternalIdContext);
  const { user } = useUserContext();
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

  // Helper: removes every space and hyphen, then lower-cases
  const normalize = (s: string) => s.replace(/[\s-]+/g, '').toLowerCase();

  const seoTitle =
    product?.yoast_head_json?.title ||
    product?.meta_data?.find((m) => m.key === '_yoast_wpseo_title')?.value ||
    `Hvyt | ${product?.name}`;

  const seoDescription =
    product?.yoast_head_json?.description ||
    product?.meta_data?.find((m) => m.key === '_yoast_wpseo_metadesc')?.value ||
    product?.short_description ||
    '';

  const categories: Category[] = product?.categories ?? [];
  const isMeble = categories.some((c) => c.slug === 'meble');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

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
          `/api/product?slug=${encodeURIComponent(slug)}`,
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

        console.log('🔍 fetched productData:', productData);
        dispatch({ type: 'SET_PRODUCT', payload: productData });

        // ─────────────── LOOK UP VARIANT BY URL PARAM ───────────────
        const queryAttrKey = Object.keys(query).find(k => k.startsWith('attribute_pa_'));

        if (
          queryAttrKey &&
          Array.isArray(productData.baselinker_variations) &&
          productData.baselinker_variations.length > 0
        ) {
          const attributeValue = query[queryAttrKey];          // e.g. "192-mm"

          if (typeof attributeValue === 'string') {
            const variations = productData.baselinker_variations as BaselinkerVariation[];

            // find the variation whose option matches, ignoring spaces & hyphens
            const matchedVariation = variations.find(v =>
              v.attributes.some(a =>
                normalize(a.option) === normalize(attributeValue)
              )
            );

            if (matchedVariation) {
              // pull the exact attribute object that matched
              const matchedAttr = matchedVariation.attributes.find(a =>
                normalize(a.option) === normalize(attributeValue)
              );

              if (matchedAttr) {
                // store the canonical WooCommerce value (e.g. "192 mm")
                dispatch({
                  type: 'UPDATE_ATTRIBUTE',
                  payload: { name: matchedAttr.name, value: matchedAttr.option },
                });
              }

              dispatch({
                type: 'SET_VARIATION',
                payload: {
                  id: matchedVariation.id.toString(),
                  name: matchedVariation.id.toString(),
                  price: matchedVariation.price.toString(),
                  regular_price: matchedVariation.regular_price.toString(),
                  sale_price: matchedVariation.sale_price.toString(),
                  on_sale: matchedVariation.on_sale,
                  image: matchedVariation.image
                    ? { sourceUrl: matchedVariation.image.src }
                    : undefined,
                  attributes: matchedVariation.attributes.map(a => ({
                    id: a.id,
                    name: a.name,
                    option: a.option,
                  })),
                },
              });
            }
          }
        }
        pushGTMEvent('view_item', {
          items: [
            {
              item_id: productData.id,
              item_name: productData.name,
              price: parseFloat(productData.price).toFixed(2),
            },
          ],
          value: parseFloat(productData.price),
          currency: 'PLN',
        });
        fetch('/api/pinterest-capi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'view_content',
            items: [
              {
                item_id: productData.id,
                item_name: productData.name,
                price: parseFloat(productData.price).toFixed(2),
                quantity: 1,
              },
            ],
            value: parseFloat(productData.price),
            currency: 'PLN',
            click_id: document.cookie.match(/_epik=([^;]+)/)?.[1] || '',
          }),
        });
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
      setWishlistMessage('Produkt został usunięty z ulubionych.');
    } else {
      addToWishlist(wishlistProduct);
      setWishlistMessage('Produkt został dodany do ulubionych.');
    }
    setTimeout(() => setWishlistMessage(null), 3000);
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
    const matchedVariation = product?.baselinker_variations?.find(v =>
      v.attributes.every(a =>
        normalize(updatedAttributes[a.name]!) === normalize(a.option)
      )
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
          on_sale: matchedVariation.on_sale,
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

    // — Your existing "build cartItem" logic —
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
      baselinker_variations: product.baselinker_variations,
      availableStock,

    };

    addCartItem(cartItem);

    // 4) Google GA4
    (window as any).window.dataLayer?.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'PLN',
        value: cartItem.totalPrice,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: cartItem.price,
            quantity: cartItem.qty,
          },
        ],
      },
    });
    // … right after your fb-capi block …
    fetch('/api/pinterest-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'add_to_cart',
        items: [
          {
            item_id: cartItem.productId,
            item_name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.qty,
          },
        ],
        value: cartItem.totalPrice,
        currency: 'PLN',
        order_id: cartItem.cartKey,
        click_id: document.cookie.match(/_epik=([^;]+)/)?.[1] || '',
      }),
    });

    const eventId = uuidv4();

    // → Browser Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq(
        'track',
        'AddToCart',
        {
          content_type: 'product',
          content_ids: [product.id],
          value: cartItem.totalPrice,
          currency: 'PLN',
        },
        { eventID: eventId },
      );
    }

    // inside handleAddToCart, after your fbq('AddToCart', …) call:

    {
      // 1) Coerce cookies & FB Login ID to strings
      const fbp: string = document.cookie.match(/_fbp=([^;]+)/)?.[1] ?? '';
      const fbc: string = document.cookie.match(/_fbc=([^;]+)/)?.[1] ?? '';
      const fbLoginId: string = (window as any).fb_login_id ?? '';

      // 2) Guarantee a non-null anon ID
      // externalAnonId comes from context and can be string|null
      // If it's null, fall back to a newly generated UUID
      const anonId: string = externalAnonId ?? uuidv4();

      // 3) Pick real user.id when logged in, else our stable anonId
      const externalId: string = user?.id != null ? String(user.id) : anonId;

      // 4) Build your userData map — all string values
      const userData: Record<string, string> = {
        fb_login_id: fbLoginId,
        fbp,
        fbc,
        external_id: externalId,
      };
      if (user?.email) userData.email = user.email;

      // 5) Fire the CAPI fetch
      fetch('/api/fb-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'AddToCart',
          eventId,
          customData: {
            content_type: 'product',
            content_ids: [product.id],
            value: cartItem.totalPrice,
            currency: 'PLN',
          },
          userData, // ← now every field is string
        }),
      })
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) console.error('🚨 CAPI error:', json);
          else console.log('✅ CAPI success:', json);
        })
        .catch((err) => console.error('❌ CAPI network error:', err));
    }

    // 6) Show cart modal
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
    <Layout title={seoTitle}>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/produkt/${slug}`}
        />
      </Head>

      <section className="mx-auto max-w-[1440px] px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0 mt-[88px] md:mt-[140px]">
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
            <p className="relative flex items-center gap-2">
              {(() => {
                if (!product) return null;

                // --- detect variable vs simple by looking for your baselinker_variations array ---
                const isVariable =
                  Array.isArray(product.baselinker_variations) &&
                  product.baselinker_variations.length > 0;

                // Pick the variation we will use for price / sale checks
                const variationRef: any =
                  isVariable
                    ? selectedVariation ?? product.baselinker_variations![0]
                    : null;

                // ─── price + date logic ───
                const getNumber = (val: unknown): number =>
                  typeof val === 'string' || typeof val === 'number'
                    ? parseFloat(val as any) || 0
                    : 0;

                let salePrice = 0;
                let regularPrice = 0;
                let saleFrom: string | undefined;
                let saleTo: string | undefined;

                if (isVariable) {
                  salePrice =
                    getNumber((variationRef as any).sale_price) ||
                    getNumber((variationRef as any).price);
                  regularPrice =
                    getNumber((variationRef as any).regular_price) || salePrice;
                  saleFrom = (variationRef as any).date_on_sale_from;
                  saleTo = (variationRef as any).date_on_sale_to;
                } else {
                  salePrice =
                    getNumber((product as any).sale_price) ||
                    getNumber((product as any).salePrice) ||
                    getNumber(product.price);
                  regularPrice =
                    getNumber((product as any).regular_price) ||
                    getNumber((product as any).regularPrice) ||
                    salePrice;
                  saleFrom = (product as any).date_on_sale_from;
                  saleTo = (product as any).date_on_sale_to;
                }

                // rely on WooCommerce on_sale flag when it exists
                const onSaleFlag = isVariable
                  ? Boolean((variationRef as any)?.on_sale)
                  : Boolean((product as any).on_sale);

                const now = new Date();
                const toDate = (raw?: string): Date | null =>
                  raw ? new Date(raw.replace(' ', 'T')) : null;
                const startDate = toDate(saleFrom);
                const endDate = toDate(saleTo);
                const isSaleActive =
                  onSaleFlag &&
                  salePrice < regularPrice &&
                  (!startDate || now >= startDate) &&
                  (!endDate || now <= endDate);

                const discountPct = isSaleActive
                  ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
                  : 0;

                return (
                  <>
                    {/* ─── Replace that block with this ─── */}
                    {isSaleActive && (
                      <span
                        className="absolute top-2 right-2 px-2 font-semibold rounded-full"
                        style={{
                          backgroundColor: '#661F30',
                          color: '#fff',
                          fontSize: '18px',
                        }}
                      >
                        -{discountPct}%
                      </span>
                    )}

                    {isSaleActive ? (
                      <>
                        <span className="text-[24px] md:text-[28px] font-bold text-dark-pastel-red">
                          {salePrice.toFixed(2)} zł
                        </span>
                        <span className="text-[16px] text-[#969394] line-through ml-2">
                          {regularPrice.toFixed(2)} zł
                        </span>
                      </>
                    ) : (
                      <span className="text-[24px] md:text-[28px] font-bold text-dark-pastel-red">
                        {regularPrice.toFixed(2)} zł
                      </span>
                    )}
                  </>
                );
              })()}

            </p>
            <LowestPriceInfo
              product={product!}
              selectedVariation={selectedVariation || null}
            />
            {validationError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-2">
                <span>{validationError}</span>
              </div>
            )}
            {/*
            <ColorSwitcher
              options={
                product?.attributes?.find((attr) => attr.name === 'Kolor')
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
            */}
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
                    className={`w-4/5 py-3 text-[16px] md:text-[24px] font-light rounded-full flex justify-center items-center transition-colors ${showNotifyForm && !isNotifyEmailValid
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
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  type="button"
                  disabled={availableStock <= 0 || quantity > availableStock}
                  className={
                    `flex-1 py-3 text-[16px] md:text-[24px] font-light rounded-full flex justify-center items-center transition-colors ${availableStock <= 0 || quantity > availableStock
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-black text-white hover:bg-dark-pastel-red'
                    }`
                  }
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

                <button
                  type="button"
                  onClick={handleWishlistClick}
                  className={`w-[60px] h-[60px] flex items-center justify-center rounded-full transition-colors border border-black ${isInWishlist(product?.slug ?? '')
                    ? 'bg-transparent'
                    : 'hover:bg-[#DAD3C8]'
                    }`}
                >
                  <Image
                    src={
                      isInWishlist(product?.slug ?? '')
                        ? '/icons/heart-added.svg'
                        : '/icons/wishlist.svg'
                    }
                    alt={
                      isInWishlist(product?.slug ?? '')
                        ? 'Usuń z ulubionych'
                        : 'Dodaj do ulubionych'
                    }
                    width={30}
                    height={30}
                  />
                </button>
              </div>
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
              isMeble={isMeble}
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
      {wishlistMessage && (
        <div className="fixed bottom-4 left-4 bg-green-800 text-white rounded-full py-3 px-4 flex items-center shadow-lg">
          <img
            src="/icons/circle-check.svg"
            alt="Success"
            className="w-5 h-5 mr-2"
          />
          <span>{wishlistMessage}</span>
        </div>
      )}
    </Layout>
  );
};

export default ProductPage;
