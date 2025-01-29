import React, { useState } from 'react';
import Image from 'next/image';
import { CartContext, Product } from '@/stores/CartProvider';
import QuantityChanger from '@/components/UI/QuantityChanger';
import AttributeSwitcher from '@/components/UI/AttributeSwitcher.component';

interface CartItemProps {
  product: Product;
  onIncreaseQuantity?: (product: Product) => void;
  onDecreaseQuantity?: (product: Product) => void;
  onRemoveItem?: (product: Product) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) => {
  const { updateCartVariation } = React.useContext(CartContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(
    null,
  );

  const handleSaveVariation = (name: string, newValue: string) => {
    console.log(`✅ Saving Variation in CartItem: ${name} -> ${newValue}`);

    // ✅ Ensure UI updates
    setSelectedVariation(newValue);

    const fullAttributeName = Object.keys(product.variationOptions || {}).find(
      (key) =>
        key.trim().toLowerCase().endsWith(name.trim().toLowerCase()) ||
        key.trim().toLowerCase() === name.trim().toLowerCase(),
    );

    console.log(`🔍 Looking for attribute: ${fullAttributeName}`);

    if (!fullAttributeName) {
      console.warn(
        `⚠️ Attribute name "${name}" not found in variationOptions.`,
      );
      return;
    }

    const matchingVariation = product.variationOptions?.[
      fullAttributeName
    ]?.find((option) => option.option.trim() === newValue.trim());

    if (matchingVariation) {
      console.log(`✅ Found Matching Variation:`, matchingVariation);

      // ✅ Update cart and UI state
      updateCartVariation(
        product.cartKey,
        fullAttributeName,
        newValue,
        matchingVariation.price,
      );
    } else {
      console.warn(
        `⚠️ No matching variation found for ${fullAttributeName} -> ${newValue}`,
      );
    }
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
            Object.entries(product.attributes).map(([name, value]) => {
              if (!product.variationOptions?.[name]) return null;

              return (
                <div key={name} className="mt-3 flex flex-wrap items-center">
                  <p className="text-neutral-dark mr-4">
                    {name.replace(/^Atrybut produktu:\s*/, '')}:
                    <span className="font-medium">
                      {selectedVariation || String(value)}
                    </span>{' '}
                    {/* ✅ UI now updates */}
                  </p>
                  <button
                    className="font-light text-black underline flex items-center hover:text-gray-800 transition"
                    onClick={() => setModalOpen(true)}
                  >
                    edytuj
                    <img
                      src="/icons/edit.svg"
                      alt="Edit Icon"
                      className="w-4 h-4 ml-1"
                    />
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Quantity Changer */}
      {onIncreaseQuantity && onDecreaseQuantity && (
        <QuantityChanger
          quantity={product.qty}
          onIncrease={() => onIncreaseQuantity(product)}
          onDecrease={() => onDecreaseQuantity(product)}
        />
      )}

      {/* Product Price */}
      <div className="flex flex-col items-end">
        <p className="text-xl font-bold text-neutral-darkest">
          {product.totalPrice.toFixed(2)} zł
        </p>
      </div>

      {/* Remove Item */}
      {onRemoveItem && (
        <button
          className="text-red-500 hover:text-red-700 ml-4"
          onClick={() => onRemoveItem(product)}
        >
          <img src="/icons/trash.svg" alt="Remove Icon" className="w-6 h-6" />
        </button>
      )}

      {/* Modal for Attribute Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-md rounded-lg relative">
            <button
              className="absolute top-2 right-2 text-black text-xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Edytuj Wariant</h3>

            {product.variationOptions &&
              Object.entries(product.variationOptions).map(
                ([name, options]) => (
                  <AttributeSwitcher
                    key={name}
                    attributeName={name.replace(/^Atrybut produktu:\s*/, '')}
                    options={(
                      options as { option: string; price: number }[]
                    ).map((opt) => opt.option)}
                    selectedValue={
                      selectedVariation || product.attributes?.[name] || null
                    }
                    pricesMap={Object.fromEntries(
                      (options as { option: string; price: number }[]).map(
                        (opt) => [opt.option, opt.price.toFixed(2)],
                      ),
                    )}
                    onAttributeChange={handleSaveVariation}
                  />
                ),
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
