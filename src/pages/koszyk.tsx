import React, { useContext } from 'react';
import Layout from '@/components/Layout/Layout.component';
import { CartContext, Product } from '@/stores/CartProvider';
import CartProgress from '@/components/Cart/CartProgress';
import CartItems from '@/components/Cart/CartItems';
import CartSummary from '@/components/Cart/CartSummary';
import Link from 'next/link';

const Koszyk: React.FC = () => {
  const { cart, updateCartItem, removeCartItem } = useContext(CartContext);

  const handleIncreaseQuantity = (product: Product) => {
    updateCartItem(product.cartKey, product.qty + 1);
  };

  const handleCheckout = () => {
    console.log('Przechodze do checkout...');
    // Add your checkout logic here, e.g., redirecting to a checkout page
  };

  const handleDecreaseQuantity = (product: Product) => {
    if (product.qty > 1) {
      updateCartItem(product.cartKey, product.qty - 1);
    }
  };

  const handleRemoveItem = (product: Product) => {
    removeCartItem(product.cartKey);
  };

  const formatPrice = (price: number) => price.toFixed(2);

  // Check if the cart is empty using totalProductsPrice or other properties
  const isCartEmpty = !cart || cart.totalProductsPrice === 0;

  return (
    <Layout title="Hvyt | Koszyk">
      <section className="container mx-auto px-4 md:px-0">
        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center mt-16">
            <img
              src="/icons/empty-cart-icon.svg"
              alt="Empty Cart"
              className="w-12 h-12 mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Twój koszyk jest pusty</h2>
            <p className="text-gray-600 mb-6">
              Znajdź produkt w naszym sklepie, który wyróżni Twoje wnętrze!
            </p>
            <div className="flex gap-4">
              <Link
                href="/kategoria/uchwyty-meblowe"
                className="px-6 py-2 bg-black text-white rounded-full text-sm"
              >
                Uchwyty
              </Link>
              <Link
                href="/"
                className="px-6 py-2 border border-black text-black rounded-full text-sm"
              >
                Strona Główna
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <CartProgress />
            <div className="flex flex-col lg:flex-row gap-8">
              {' '}
              {/* Keep the cart layout intact */}
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
      </section>
    </Layout>
  );
};

export default Koszyk;
