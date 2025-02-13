import React, { useState, useRef } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [modalHeight, setModalHeight] = useState<string>('auto');

  const variationOptions = product.variationOptions ?? {};

  const handleSaveVariation = (name: string, newValue: string) => {
    console.log(`✅ Saving Variation in CartItem: ${name} -> ${newValue}`);
    setSelectedVariation(newValue);

    const fullAttributeName = Object.keys(variationOptions).find(
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

    const matchingVariation = variationOptions?.[fullAttributeName]?.find(
      (option) => option.option.trim() === newValue.trim(),
    );

    if (matchingVariation) {
      console.log(`✅ Found Matching Variation:`, matchingVariation);
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
    <>
      {/* Desktop Layout: Use existing layout */}
      <div className="hidden md:flex items-center justify-between mb-6 border-b pb-4 last:border-none last:pb-0">
        <div className="flex items-center">
          <div className="w-[90px] h-[90px] relative rounded-[24px] overflow-hidden">
            <Image
              src={product.image as string}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-base font-semibold text-neutral-darkest">
              {product.name}
            </h3>
            {product.attributes &&
              Object.entries(product.attributes).map(([name, value]) => {
                if (!variationOptions[name]) return null;
                return (
                  <div key={name} className="mt-3 flex flex-wrap items-center">
                    <p className="font-light text-neutral-dark mr-4">
                      {name.replace(/^Atrybut produktu:\s*/, '')}:{' '}
                      <span className="font-light">
                        {selectedVariation || String(value)}
                      </span>
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
        {onIncreaseQuantity && onDecreaseQuantity && (
          <QuantityChanger
            quantity={product.qty}
            onIncrease={() => onIncreaseQuantity(product)}
            onDecrease={() => onDecreaseQuantity(product)}
          />
        )}
        <div className="flex flex-col items-end">
          <p className="text-xl font-bold text-neutral-darkest">
            {product.totalPrice.toFixed(2)} zł
          </p>
        </div>
        {onRemoveItem && (
          <button
            className="text-red-500 hover:text-red-700 ml-4"
            onClick={() => onRemoveItem(product)}
          >
            <img src="/icons/trash.svg" alt="Remove Icon" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden flex items-center justify-between mb-4 border-b pb-4">
        {/* Column 1: Image */}
        <div className="flex-shrink-0">
          <div className="w-[75px] h-[75px] relative rounded-[12px] overflow-hidden">
            <Image
              src={product.image as string}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
        </div>

        {/* Column 2: Title, Quantity, Variation */}
        <div className="flex-1 px-3">
          <h3 className="text-sm font-semibold text-neutral-darkest">
            {product.name}
          </h3>
          <div className="mt-1">
            <QuantityChanger
              quantity={product.qty}
              onIncrease={() =>
                onIncreaseQuantity && onIncreaseQuantity(product)
              }
              onDecrease={() =>
                onDecreaseQuantity && onDecreaseQuantity(product)
              }
            />
          </div>
          <div className="mt-1">
            {product.attributes &&
              Object.entries(product.attributes).length > 0 && (
                <p className="text-xs text-neutral-dark">
                  {Object.entries(product.attributes)[0][0].replace(
                    /^Atrybut produktu:\s*/,
                    '',
                  )}
                  :{' '}
                  {selectedVariation ||
                    Object.entries(product.attributes)[0][1]}
                </p>
              )}
          </div>
        </div>

        {/* Column 3: Price and Edit Button */}
        <div className="flex flex-col items-end">
          <p className="text-sm font-bold text-neutral-darkest">
            {product.totalPrice.toFixed(2)} zł
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs text-black underline mt-1 flex items-center"
          >
            edytuj
            <img
              src="/icons/edit.svg"
              alt="Edit Icon"
              className="w-3 h-3 ml-1"
            />
          </button>
        </div>
      </div>

      {/* Modal for Attribute Selection (common for both layouts) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#36313266] flex items-center justify-center z-50">
          <div
            className="bg-[#FAF7F5] px-[48px] py-[40px] w-full max-w-[650px] rounded-[24px] relative shadow-lg transition-all duration-300 ease-in-out"
            style={{ maxHeight: modalHeight, overflowY: 'auto' }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-black text-2xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            {/* Modal Header */}
            <h3 className="text-[24px] font-semibold text-[#1C1C1C] mb-[24px]">
              Edytuj rozstaw produktu
            </h3>
            <p className="text-neutral-darkest font-light text-base mb-[40px]">
              Produkty zostaną dodane do koszyka z uwzględnieniem ich aktualnych
              cen. Czy chcesz kontynuować?
            </p>
            {Object.entries(variationOptions).map(([name, options]) => (
              <div key={name} className="mb-4" ref={dropdownRef}>
                <label className="text-[#1C1C1C] text-base font-light mb-[16px] px-[16px] block flex items-center">
                  {name.replace(/^Atrybut produktu:\s*/, '')}
                  {name.includes('Rozstaw') && (
                    <div className="relative group ml-2">
                      <img
                        src="/icons/info.svg"
                        alt="Info"
                        className="w-6 h-6 cursor-pointer"
                      />
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-beige-dark text-black font-light text-[12px] rounded-[5px] px-4 py-2 hidden group-hover:block z-50 shadow-lg w-[180px]">
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-[6px] w-3 h-3 bg-beige-dark rotate-45"></div>
                        Rozstaw to odległość pomiędzy środkami otworów
                        montażowych.
                      </div>
                    </div>
                  )}
                </label>
                <AttributeSwitcher
                  isCartPage={true}
                  key={name}
                  attributeName={name}
                  options={(options as { option: string; price: number }[]).map(
                    (opt) => `${opt.option} | ${opt.price.toFixed(2)} zł`,
                  )}
                  selectedValue={
                    selectedVariation || product.attributes?.[name] || ''
                  }
                  onAttributeChange={(attribute, newValue) => {
                    setSelectedVariation(newValue.split(' | ')[0]);
                  }}
                />
              </div>
            ))}
            <div className="flex justify-between items-center mt-[48px] mb-[8px] gap-4">
              <button
                className="w-1/2 py-3 text-black border border-black rounded-full text-base font-light hover:bg-gray-100 transition"
                onClick={() => setModalOpen(false)}
              >
                Anuluj
              </button>
              <button
                className={`w-1/2 py-3 text-white rounded-full text-base font-light transition ${
                  selectedVariation
                    ? 'bg-[#1C1C1C] hover:bg-black cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedVariation}
                onClick={() => {
                  if (selectedVariation) {
                    handleSaveVariation(
                      Object.keys(variationOptions)[0],
                      selectedVariation,
                    );
                    setModalOpen(false);
                  }
                }}
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;
