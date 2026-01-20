import React, { useContext } from 'react';
import { CartContext, Product } from '@/stores/CartProvider';
import { useRouter } from 'next/router';
import { getCurrency, Language } from '@/utils/i18n/config';

const OrderItems: React.FC = () => {
  const { cart } = useContext(CartContext);
  const router = useRouter();
  const currency = getCurrency(router?.locale as Language ?? 'pl');

  if (!cart || cart.products.length === 0) {
    return <p>Twój koszyk jest pusty.</p>;
  }

  return (
    <div>
      <h2 className="px-[12px] text-2xl font-bold mb-6 text-dark-pastel-red">
        Twoje zamówienie
      </h2>
      <div className=" px-[12px] divide-y divide-neutral-light">
        {cart.products.map((product: Product) => (
          <div key={product.cartKey} className="flex items-center py-4">
            {/* Product Image */}
            <div className="w-[75px] h-[75px] rounded-md overflow-hidden">
              <img
                src={product.image as string}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-1 ml-4">
              <div className="flex justify-between items-center">
                {/* Product Title */}
                <h3 className="text-[16px] font-bold text-neutral-darkest">
                  {product.name}
                </h3>
                {/* Product Price */}
                <p className="text-sm font-bold text-neutral-darkest">
                  {product.totalPrice.toFixed(2)} {currency.symbol}
                </p>
              </div>
              {/* Product Quantity */}
              <p className="text-[14px] font-light text-black">
                Ilość: {product.qty}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
