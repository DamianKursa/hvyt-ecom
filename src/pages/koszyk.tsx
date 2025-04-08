import React, { useContext, useEffect, useState } from 'react';
import Layout from '@/components/Layout/Layout.component';
import { CartContext, Product } from '@/stores/CartProvider';
import CartProgress from '@/components/Cart/CartProgress';
import CartItems from '@/components/Cart/CartItems';
import CartSummary from '@/components/Cart/CartSummary';
import Link from 'next/link';
import Bestsellers from '@/components/Index/Bestsellers.component';
import { pushGTMEvent } from '@/utils/gtm';

const Koszyk: React.FC = () => {
  const { cart, updateCartItem, removeCartItem } = useContext(CartContext);
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return <div>Loading...</div>;

  const handleIncreaseQuantity = (product: Product) => {
    if (product.availableStock && product.qty >= product.availableStock) {
      console.log(`Reached maximum stock for ${product.name}`);
      return;
    }
    updateCartItem(product.cartKey, product.qty + 1);
  };

  const handleDecreaseQuantity = (product: Product) => {
    if (product.qty > 1) {
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
    console.log('Proceeding to checkout...');
  };

  const isCartEmpty = !cart || cart.totalProductsPrice === 0;

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
            <div className="flex flex-col lg:flex-row gap-8">
              <CartItems
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onRemoveItem={handleRemoveItem}
              />
              <CartSummary
                totalProductsPrice={cart?.totalProductsPrice || 0}
                onCheckout={handleCheckout}
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
