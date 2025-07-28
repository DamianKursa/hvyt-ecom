import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CartContext, Product } from '@/stores/CartProvider';
import QuantityChanger from '@/components/UI/QuantityChanger';
import AttributeSwitcher from '@/components/UI/AttributeSwitcher.component';

interface CartItemProps {
  product: Product;
  onIncreaseQuantity?: (product: Product) => void;
  onDecreaseQuantity?: (product: Product) => void;
  onRemoveItem?: (product: Product) => void;
}

/** ① We now track both the human label and the Woo variation ID */
interface SelVar {
  label: string;
  id: number;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) => {
  const router = useRouter();
  const isKoszykPage = router.pathname === '/koszyk';

  /** ② Provider now expects (cartKey, attrName, newValue, newVariationId) */
  const { updateCartVariation } = React.useContext(CartContext);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<SelVar | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /** ③ Build a map { attributeName → [ {option, price, id} ] } */
  const variationOptions = React.useMemo(() => {
    if (!product.baselinker_variations) return {};
    const map: {
      [attrName: string]: { option: string; price: number; id: number }[];
    } = {};
    product.baselinker_variations.forEach((v) => {
      v.attributes.forEach((attr) => {
        if (!map[attr.name]) map[attr.name] = [];
        map[attr.name].push({
          option: attr.option,
          price: v.price,
          id: v.id,
        });
      });
    });
    return map;
  }, [product.baselinker_variations]);

  /** ④ Called when user clicks “Zapisz” in the modal */
  const handleSaveVariation = (
    attributeName: string,
    newValue: string,
    newVarId: number,
  ) => {
    const fullAttributeName = Object.keys(variationOptions).find(
      (key) =>
        key.trim().toLowerCase().endsWith(attributeName.trim().toLowerCase()) ||
        key.trim().toLowerCase() === attributeName.trim().toLowerCase(),
    );
    if (!fullAttributeName) return;

    updateCartVariation(
      product.cartKey,
      fullAttributeName,
      newValue,
      newVarId, // ← pass the chosen variation ID
    );
  };

  /* ---------- RENDER ---------- */
  return (
    <>
      {/* Desktop row */}
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
            <h3 className="text-base font-semibold text-neutral-darkest max-w-[200px] whitespace-normal break-words">
              {product.name}
            </h3>

            {/* attributes */}
            {product.attributes &&
              Object.entries(product.attributes).map(([name, value]) => {
                if (!variationOptions[name]) return null;
                return (
                  <div key={name} className="mt-3 flex flex-wrap items-center">
                    <p className="font-light text-neutral-dark mr-4">
                      {name.replace(/^Atrybut produktu:\s*/, '')}:{' '}
                      <span className="font-light">
                        {selectedVariation?.label ?? String(value)}
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

      {/* Mobile card */}
      <div className="block md:hidden flex items-center justify-between mb-4 border-b pb-4">
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
              className={isKoszykPage ? 'w-[130px] p-0' : undefined}
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
                  : {selectedVariation?.label ??
                    Object.entries(product.attributes)[0][1]}
                </p>
              )}
          </div>
        </div>
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
          {onRemoveItem && (
            <button
              className="text-red-500 hover:text-red-700 mt-6"
              onClick={() => onRemoveItem(product)}
            >
              <img
                src="/icons/trash.svg"
                alt="Remove Icon"
                className="w-4 h-4"
              />
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#36313266] flex items-center justify-center z-50">
          <div
            className="bg-[#FAF7F5] mx-4 md:mx-0 px-[48px] py-[40px] w-full max-w-[650px] rounded-[24px] relative shadow-lg transition-all duration-300 ease-in-out"
            style={{ maxHeight: 'auto', overflowY: 'auto' }}
          >
            <button
              className="absolute top-4 right-4 text-black text-2xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>

            <h3 className="text-[24px] font-semibold text-[#1C1C1C] mb-[24px]">
              Edytuj rozstaw produktu
            </h3>
            <p className="text-neutral-darkest font-light text-base mb-[40px]">
              Produkty zostaną dodane do koszyka z uwzględnieniem ich aktualnych
              cen. Czy chcesz kontynuować?
            </p>

            {/* One dropdown per attribute (usually only “Rozstaw”) */}
            {Object.entries(variationOptions).map(([attrName, options]) => (
              <div key={attrName} className="mb-4" ref={dropdownRef}>
                <label className="text-[#1C1C1C] text-base font-light mb-[16px] px-[16px] block flex items-center">
                  {attrName.replace(/^Atrybut produktu:\s*/, '')}
                </label>

                <AttributeSwitcher
                  isCartPage
                  attributeName={attrName}
                  options={options.map(
                    (opt) => `${opt.option} | ${opt.price.toFixed(2)} zł`,
                  )}
                  selectedValue={
                    (selectedVariation?.label ??
                      product.attributes?.[attrName]) ?? null     // ← guarantees string | null
                  }
                  onAttributeChange={(attribute, newValue) => {
                    const bare = newValue.split(' | ')[0];
                    const varId =
                      variationOptions[attribute]?.find(
                        (o) => o.option === bare,
                      )?.id ?? 0;
                    setSelectedVariation({ label: bare, id: varId });
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
                className={`w-1/2 py-3 text-white rounded-full text-base font-light transition ${selectedVariation
                  ? 'bg-[#1C1C1C] hover:bg-black cursor-pointer'
                  : 'bg-[#B2B0B1] cursor-not-allowed'
                  }`}
                disabled={!selectedVariation}
                onClick={() => {
                  if (selectedVariation) {
                    const firstAttr = Object.keys(variationOptions)[0];
                    handleSaveVariation(
                      firstAttr,
                      selectedVariation.label,
                      selectedVariation.id,
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