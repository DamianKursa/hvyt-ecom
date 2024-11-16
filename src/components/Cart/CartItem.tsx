import React from 'react';
import Image from 'next/image';
import { Product } from '@/stores/CartProvider';
import QuantityChanger from '@/components/UI/QuantityChanger';

interface CartItemProps {
  product: Product;
  onIncreaseQuantity: (product: Product) => void;
  onDecreaseQuantity: (product: Product) => void;
  onRemoveItem: (product: Product) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) => {
  // Utility function to format prices
  const formatPrice = (price: number) => price.toFixed(2);

  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4 last:border-none last:pb-0">
      <div className="flex items-start">
        <div className="w-[90px] h-[90px] relative rounded-lg overflow-hidden">
          <Image
            src={product.image as string}
            alt={product.name || 'Product image'}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-neutral-darkest">
            {product.name}
          </h3>
          {product.attributes?.rozstaw && (
            <p className="text-sm text-gray-500">
              Rozstaw: {product.attributes.rozstaw}{' '}
              <button className="text-sm text-blue-500 underline ml-2">
                edytuj
              </button>
            </p>
          )}
        </div>
      </div>

      <QuantityChanger
        quantity={product.qty}
        onIncrease={() => onIncreaseQuantity(product)}
        onDecrease={() => onDecreaseQuantity(product)}
      />

      <div className="flex flex-col items-end">
        <p className="text-xl font-bold text-neutral-darkest">
          {formatPrice(product.totalPrice)} zł
        </p>
      </div>

      <button
        className="text-red-500 hover:text-red-700 ml-4"
        onClick={() => onRemoveItem(product)}
      >
        <img src="/icons/trash.svg" alt="Remove Icon" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CartItem;
