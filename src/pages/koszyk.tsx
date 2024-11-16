import React, { useContext } from 'react';
import Layout from '@/components/Layout/Layout.component';
import { CartContext, Product } from '@/stores/CartProvider';
import CartProgress from '@/components/Cart/CartProgress';
import CartItems from '@/components/Cart/CartItems';

const Koszyk: React.FC = () => {
  const { cart, updateCartItem, removeCartItem } = useContext(CartContext);

  const handleIncreaseQuantity = (product: Product) => {
    updateCartItem(product.cartKey, product.qty + 1);
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

          {/* Summary Section */}
          <aside className="lg:w-4/12 bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Podsumowanie</h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Razem produkty</span>
              <span>{formatPrice(cart?.totalProductsPrice || 0)} zł</span>
            </div>
            <div className="flex items-center justify-between text-lg mb-4">
              <span>Posiadasz kod rabatowy?</span>
              <input
                type="text"
                placeholder="Wpisz kod"
                className="border p-2 rounded w-full mt-2"
              />
            </div>
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Suma</span>
              <span>{formatPrice(cart?.totalProductsPrice || 0)} zł</span>
            </div>
            <button className="w-full py-3 bg-black text-white rounded-lg text-center">
              Przejdź do kasy
            </button>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Koszyk;
