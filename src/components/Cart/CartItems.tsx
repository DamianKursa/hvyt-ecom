import React, { useContext } from 'react';
import { CartContext, Product } from '@/stores/CartProvider';
import CartItem from './CartItem';
import { useI18n } from '@/utils/hooks/useI18n';

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
  const {t} = useI18n();
  const { cart, clearCart } = useContext(CartContext);

  return (
    <div className="lg:w-8/12 bg-white shadow rounded-[24px] p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-pastel-red">
          {t.cart.title} ({cart?.products.length})
        </h2>
        <button
          className="flex items-center justify-between px-4 py-2 border border-black text-black rounded-full hover:bg-gray-100 transition"
          onClick={clearCart}
        >
          {t.cart.removeAll}
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
        <p className="text-center text-lg">{t.cart.emptyCartMessage}</p>
      )}
    </div>
  );
};

export default CartItems;
