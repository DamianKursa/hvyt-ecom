import React, { useContext } from 'react';
import { CartContext, Product } from '@/stores/CartProvider';
import CartItem from './CartItem';

interface CartItemsProps {
  onIncreaseQuantity: (product: Product) => void;
  onDecreaseQuantity: (product: Product) => void;
  onRemoveItem: (product: Product) => void;
  onVariationChange?: (productName: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onVariationChange,
}) => {
  const { cart, clearCart } = useContext(CartContext);

  return (
    <div className="lg:w-8/12 bg-white shadow rounded-[24px] p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-pastel-red">
          Koszyk ({cart?.products.length})
        </h2>
        <button
          className="flex items-center justify-between px-4 py-2 border border-black text-black rounded-full hover:bg-gray-100 transition"
          onClick={clearCart}
        >
          Wyczyść koszyk
          <img
            src="/icons/trash-black.svg"
            alt="Trash Icon"
            className="w-5 h-5 ml-2"
          />
        </button>
      </div>

      {cart?.products.length ? (
        cart.products.map((product) => (
          <CartItem
            key={product.cartKey}
            product={product}
            onIncreaseQuantity={onIncreaseQuantity}
            onDecreaseQuantity={onDecreaseQuantity}
            onRemoveItem={onRemoveItem}
            onVariationChange={onVariationChange}
          />
        ))
      ) : (
        <p className="text-center text-lg">Twój koszyk jest pusty</p>
      )}
    </div>
  );
};

export default CartItems;
