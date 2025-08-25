import React, { useContext, useEffect, useState } from 'react';
import Layout from '@/components/Layout/Layout.component';
import { CartContext, Product } from '@/stores/CartProvider';
import CartProgress from '@/components/Cart/CartProgress';
import CartItems from '@/components/Cart/CartItems';
import CartSummary from '@/components/Cart/CartSummary';
import Link from 'next/link';
import Bestsellers from '@/components/Index/Bestsellers.component';
import { pushGTMEvent } from '@/utils/gtm';
import axios from 'axios';

const Koszyk: React.FC = () => {
  const { cart, updateCartItem, removeCartItem, updateCartItemPrice } = useContext(CartContext);
  const [mounted, setMounted] = useState(false);
  const [variationMessage, setVariationMessage] = useState<string | null>(null);
  const [cartErrorMessage, setCartErrorMessage] = useState<string | null>(null);

  // Helpers to compute real stock for the currently selected variant (based on cart item attributes)
  const normalize = (s: unknown) =>
    typeof s === 'string' ? s.replace(/[\s-]+/g, '').toLowerCase() : '';

  const isInStock = (product: any) => {
    return product.stock_status === 'instock';
  };

  const computeAvailableStock = (p: Product): number => {
    const variations = (((p as any).baselinker_variations) || []) as Array<any>;
    const hasVariations = Array.isArray(variations) && variations.length > 0;

    if (hasVariations) {
      const selectedAttrs = ((((p as any).attributes) || {}) as Record<string, string>);

      const matched = variations.find(v =>
        Array.isArray(v.attributes) &&
        v.attributes.every((a: any) => normalize(selectedAttrs[a.name]) === normalize(a.option))
      );

      if (matched) {
        const sq = (matched as any).stock_quantity;
        if (sq !== null && sq !== '' && !Number.isNaN(Number(sq))) {
          return Number(sq);
        }
      }

      const productSQ = (p as any).stock_quantity;
      if (productSQ !== undefined && productSQ !== null && productSQ !== '' && !Number.isNaN(Number(productSQ))) {
        return Number(productSQ);
      }

      return variations.reduce((sum: number, v: any) => {
        const q = v?.stock_quantity;
        return sum + (q !== null && q !== '' && !Number.isNaN(Number(q)) ? Number(q) : 0);
      }, 0);
    }

    // SIMPLE PRODUCT: strictly use stock_quantity
    const simpleSQ = (p as any).availableStock ?? (p as any).stock_quantity;
    return Number(simpleSQ ?? 0);
  };

  const toNum = (v: any) => {
    if (typeof v === 'number') return v;
    const s = String(v ?? '').replace(/[^\d.,-]/g, '').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  };

  const syncCartPricesFromServer = async (): Promise<void> => {
    if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) return;

    const items = cart.products.map((p: Product) => ({
      cartKey: p.cartKey,
      productId: (p as any).productId ?? p.productId,
      variationId: (p as any).variationId ?? undefined,
      slug: (p as any).slug ?? undefined,
    }));

    try {
      const resp = await axios.post('/api/woocommerce?action=batchFetchPrices', { items });
      const updates = Array.isArray(resp.data?.updates) ? resp.data.updates : [];
      updates.forEach((u: any) => {
        const target = cart.products.find((x: Product) => x.cartKey === u.cartKey);
        if (!target) return;
        const serverPrice = toNum(u?.price ?? u?.sale_price ?? u?.regular_price);
        if (!Number.isFinite(serverPrice)) return;
        if (Math.abs(serverPrice - target.price) > 0.009) {
          updateCartItemPrice(u.cartKey, serverPrice, {
            regular_price: u?.regular_price,
            sale_price: u?.sale_price,
            on_sale: !!u?.on_sale,
          });
        }
      });
    } catch (e) {
      console.error('Silent batch price sync failed', e);
    }
  };

  useEffect(() => {
    // silently refresh prices when user enters the cart or when items change
    syncCartPricesFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.products?.length]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (cart && cart.products && cart.products.length > 0) {
      pushGTMEvent('view_cart', {
        items: cart.products.map((product: Product) => ({
          item_id: product.productId,
          item_name: product.name,
          price: product.price,
          quantity: product.qty,
        })),
      });
    }
  }, [cart]);

  // --- Compute invalid items and update error banner accordingly ---
  const invalidItems = React.useMemo(() => {
    if (!cart || !cart.products) return [] as Product[];
    return cart.products.filter((p: Product) => {
      const currentStock = computeAvailableStock(p);
      return currentStock <= 0 || p.qty > currentStock;
    });
  }, [cart]);

  useEffect(() => {
    if (invalidItems.length > 0) {
      const names = invalidItems.map((p: Product) => `„${p.name}”`).join(', ');
      setCartErrorMessage(`Niektóre pozycje są niedostępne lub przekraczają stan: ${names}. Zmień wariant lub ilość, aby kontynuować.`);
    } else if (cartErrorMessage) {
      setCartErrorMessage(null);
    }
  }, [invalidItems]);

  if (!mounted) return <div>Loading...</div>;

  const handleIncreaseQuantity = (product: Product) => {
    const currentStock = computeAvailableStock(product);

    if (currentStock <= 0) {
      const hasVariations = Array.isArray(((product as any).baselinker_variations) || []) && ((product as any).baselinker_variations || []).length > 0;
      if (hasVariations) {
        setCartErrorMessage(`Wariant wybrany dla "${product.name}" jest niedostępny. Zmień wariant, aby kontynuować.`);
      } else {
        setCartErrorMessage(`Produkt "${product.name}" jest niedostępny.`);
      }
      return;
    }

    if (product.qty >= currentStock) {
      console.log(`Reached maximum stock for ${product.name}`);
      setCartErrorMessage(`Nie można dodać więcej niż ${currentStock} szt. dla "${product.name}".`);
      return;
    }

    if (cartErrorMessage) setCartErrorMessage(null);
    updateCartItem(product.cartKey, product.qty + 1);
  };

  const handleDecreaseQuantity = (product: Product) => {
    if (product.qty > 1) {
      if (cartErrorMessage) setCartErrorMessage(null);
      updateCartItem(product.cartKey, product.qty - 1);
    }
  };

  const handleRemoveItem = (product: Product) => {
    removeCartItem(product.cartKey);
    pushGTMEvent('remove_from_cart', {
      items: [
        {
          item_id: product.productId,
          item_name: product.name,
          price: product.price,
          quantity: product.qty,
        },
      ],
    });
  };

  const handleCheckout = () => {
    if (!cart || !cart.products) return;
    if (invalidItems.length > 0) {
      // Error banner is already set in the effect above; just hard-block here.
      return;
    }

    pushGTMEvent('begin_checkout', {
      items: cart.products.map((product: Product) => ({
        item_id: product.productId,
        item_name: product.name,
        price: product.price,
        quantity: product.qty,
      })),
    });

    console.log('Proceeding to checkout...');
  };

  const isCartEmpty = !cart || cart.products.length === 0;

  return (
    <Layout title="Hvyt | Koszyk">
      <section className="container mx-auto px-4 md:px-0">
        {isCartEmpty ? (
          <div className="mt-[64px] md:mt-0 rounded-[25px] py-[90px] bg-white p-8 shadow-sm flex flex-col items-center justify-center">
            <img
              src="/icons/empty-cart-icon.svg"
              alt="Empty Cart"
              className="w-28 h-28 mb-4"
            />
            <h2 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
              Twój koszyk jest pusty
            </h2>
            <p className="text-[18px] text-black text-center font-light mb-6">
              Znajdź produkt w naszym sklepie, który wyróżni Twoje wnętrze!
            </p>
            <div className="flex gap-4">
              <Link
                href="/kategoria/uchwyty-meblowe"
                className="px-10 md:px-16 py-3 bg-black text-white rounded-full text-sm font-[16px]"
              >
                Uchwyty
              </Link>
              <Link
                href="/"
                className="px-6 md:px-16 py-3 border border-black text-black rounded-full text-sm font-medium"
              >
                Strona Główna
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <CartProgress />
            {variationMessage && (
              <div className="bg-green-800 text-white rounded-full py-3 px-4 mt-6 mb-6 flex items-center">
                <img
                  src="/icons/circle-check.svg"
                  alt="Success"
                  className="w-5 h-5 mr-2"
                />
                <span>{variationMessage}</span>
              </div>
            )}
            {cartErrorMessage && (
              <div className="bg-red-600 text-white rounded-full py-3 px-4 mt-6 mb-6">
                {cartErrorMessage}
              </div>
            )}
            <div className="flex flex-col lg:flex-row gap-8">
              <CartItems
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onRemoveItem={handleRemoveItem}
                onVariationChange={(name: string) => {
                  setVariationMessage(`Rozstaw produktu ${name} został zmieniony`);
                  setCartErrorMessage(null);
                }}
              />
              <CartSummary
                totalProductsPrice={cart?.totalProductsPrice || 0}
                onCheckout={handleCheckout}
                disabled={invalidItems.length > 0}
              />
            </div>
          </div>
        )}

        <div className="mt-16">
          <Bestsellers
            title="Produkty, które mogą Ci się spodobać"
            description="Sprawdź produkty, które idealnie pasują z wybranym produktem."
          />
        </div>
      </section>
    </Layout>
  );
};

export default Koszyk;
