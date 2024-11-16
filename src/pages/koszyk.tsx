import React, { useContext } from 'react';
import Layout from '@/components/Layout/Layout.component';
import { CartContext, Product } from '@/stores/CartProvider';
import CartProgress from '@/components/Cart/CartProgress';
import CartItems from '@/components/Cart/CartItems';
import CartSummary from '@/components/Cart/CartSummary';

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

  // Utility function to format prices
  const formatPrice = (price: number) => price.toFixed(2);

  return (
    <Layout title="Koszyk">
      <section className="container mx-auto px-4 md:px-0">
        <CartProgress />
        {/* Cart Items */}
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
      </section>
    </Layout>
  );
};

export default Koszyk;
