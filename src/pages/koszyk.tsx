import React, { useContext } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import { CartContext, Product } from '@/stores/CartProvider';

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
      <section className="container mx-auto mt-12 px-4 md:px-0">
        <header className="flex justify-between items-center mb-8">
          <Link href="/produkty">Wróć do produktów</Link>
          <h1 className="text-3xl font-bold">Koszyk</h1>
        </header>

        {/* Cart Items */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-8/12 bg-white shadow rounded-lg p-6">
            {cart?.products.length ? (
              cart.products.map((product) => (
                <div
                  key={product.cartKey}
                  className="flex items-center justify-between mb-6 border-b pb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={product.image.sourceUrl}
                      alt={product.name}
                      className="w-20 h-20 rounded-md"
                    />
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold">{product.name}</h2>
                      <p className="text-sm text-gray-500">
                        Rozstaw: {product.attributes?.rozstaw || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 bg-gray-100 rounded"
                      onClick={() => handleDecreaseQuantity(product)}
                    >
                      -
                    </button>
                    <span>{product.qty}</span>
                    <button
                      className="p-2 bg-gray-100 rounded"
                      onClick={() => handleIncreaseQuantity(product)}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xl font-semibold">
                    {formatPrice(product.totalPrice)} zł
                  </p>
                  <button
                    onClick={() => handleRemoveItem(product)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <img
                      src="/icons/trash.svg"
                      alt="Remove Icon"
                      className="w-6 h-6 hover:bg-color-red-700"
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-lg">Twój koszyk jest pusty</p>
            )}
          </div>

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
