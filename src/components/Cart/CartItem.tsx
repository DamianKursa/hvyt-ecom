import React, { useContext } from 'react';
import Image from 'next/image';
import { CartContext, Product } from '@/stores/CartProvider';
import QuantityChanger from '@/components/UI/QuantityChanger';
import ProductVariationEdit from '@/components/Product/ProductVariationEdit';

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
  const { updateCartVariation } = useContext(CartContext);

  const handleSaveVariation = (name: string, newValue: string) => {
    updateCartVariation(product.cartKey, name, newValue);
  };

  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4 last:border-none last:pb-0">
      <div className="flex items-start">
        <div className="w-[90px] h-[90px] relative rounded-lg overflow-hidden">
          <Image
            src={product.image as string}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-md"
          />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-neutral-darkest">
            {product.name}
          </h3>
          {product.attributes &&
            Object.entries(product.attributes).map(([name, value]) => (
              <ProductVariationEdit
                key={name}
                variationName={name}
                currentValue={value}
                variationOptions={product.variationOptions?.[name] || []}
                onSave={(newValue) => handleSaveVariation(name, newValue)}
              />
            ))}
        </div>
      </div>

      <QuantityChanger
        quantity={product.qty}
        onIncrease={() => onIncreaseQuantity(product)}
        onDecrease={() => onDecreaseQuantity(product)}
      />

      <div className="flex flex-col items-end">
        <p className="text-xl font-bold text-neutral-darkest">
          {product.totalPrice.toFixed(2)} zł
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
