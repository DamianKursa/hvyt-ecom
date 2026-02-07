import React, { useEffect, useState } from 'react';
import { Order } from '@/utils/functions/interfaces';

import { useRouter } from 'next/router';
import { CartContext } from '@/stores/CartProvider';
import { getCurrency, Language } from '@/utils/i18n/config';
import { useI18n } from '@/utils/hooks/useI18n';
import { getCurrencyBySlug } from '@/config/currencies';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const {t} = useI18n();
  const router = useRouter();

  const calculatedSubtotal = order.line_items
    .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  const calculatedTax = (
    (parseFloat(order.subtotal || calculatedSubtotal) * 23) /
    100
  ).toFixed(2);

  const currency = getCurrencyBySlug(order.currency || '').symbol;

  const { addCartItem } = React.useContext(CartContext);

  const [repeatOpen, setRepeatOpen] = useState(false);

  const handleConfirmRepeat = () => {
    if (!order?.line_items?.length) {
      console.error('Brak danych produktów do ponowienia zamówienia');
      setRepeatOpen(false);
      return;
    }

    order.line_items.forEach((item: any) => {
      const price = item.current_price ?? item.price ?? 0;
      addCartItem({
        cartKey:
          String(item.product_id) + String(item.variation_id || '') + '-repeat',
        name: item.name,
        qty: item.quantity,
        price,
        totalPrice: price * item.quantity,
        image:
          typeof item.image === 'object'
            ? item.image.src
            : item.image ?? '/fallback-image.jpg',
        productId: item.product_id,
        variationId: item.variation_id,
      });
    });

    setRepeatOpen(false);
    router.push('/koszyk');
  };

  // Desktop: Shipping address
  const renderShippingAddressDesktop = () => {
    const { shipping, billing } = order;

    return (
      <div className="grid grid-cols-2 mt-8">
        <div>
          <h3 className="font-light text-[16px] pl-6">{t.order.shippingAddress}:</h3>
        </div>
        <div className="grid grid-cols-2 text-left">
          <div>
            <p>{`${shipping.first_name} ${shipping.last_name}`}</p>
            {shipping.company && <p>{shipping.company}</p>}
            <p>{shipping.address_1}</p>
            {shipping.address_2 && <p>{shipping.address_2}</p>}
            <p>
              {shipping.postcode} {shipping.city}
            </p>
            <p>{shipping.country}</p>
          </div>
          <div>
            {billing.phone && <p>{billing.phone}</p>}
            {billing.email && <p>{billing.email}</p>}
          </div>
        </div>
      </div>
    );
  };

  // Mobile: Single item card
  const renderMobileItem = (item: any) => {
    return (
      <div key={item.product_id} className="flex gap-4 py-4 border-t border-[#DAD3C8] last:border-none">
        <img
          src={
            typeof item.image === 'object'
              ? item.image.src
              : item.image || '/placeholder.jpg'
          }
          alt={item.name}
          className="w-[80px] h-[80px] rounded-[16px] object-cover"
        />
        <div className="flex-1">
          <p className="text-[16px] font-semibold text-[#0E0B0C]">{item.name}</p>

          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-[#5D5759]">Cena:</span>
              <span className="font-light text-[#0E0B0C]">{item.price} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-[#5D5759]">Ilość:</span>
              <span className="font-light text-[#0E0B0C]">{item.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-[#5D5759]">Suma:</span>
              <span className="font-light justify-left text-[#0E0B0C]">
                {(parseFloat(item.price) * item.quantity).toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mobile: Shipping address
  const renderShippingAddressMobile = () => {
    if (!order.shipping?.first_name) {
      return <p>Brak danych o wysyłce.</p>;
    }

    return (
      <>
        <p>
          {order.shipping.first_name} {order.shipping.last_name}
        </p>
        {order.shipping.address_1 && <p>{order.shipping.address_1}</p>}
        {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
        <p>
          {order.shipping.city} {order.shipping.postcode}
        </p>
        <p>{order.shipping.country}</p>
        {order.phone && <p>{order.phone}</p>}
        {order.email && <p>{order.email}</p>}
      </>
    );
  };

  // Mobile: Billing address
  const renderBillingAddressMobile = () => {
    if (!order.billing?.first_name) {
      return <p>{t.order.noInvoiceData}</p>;
    }

    return (
      <>
        <p>
          {order.billing.first_name} {order.billing.last_name}
        </p>
        {order.billing.address_1 && <p>{order.billing.address_1}</p>}
        <p>
          {order.billing.city} {order.billing.postcode}
        </p>
        <p>{order.billing.country}</p>
        {order.billing?.email && <p>{order.billing.email}</p>}
        {order.billing?.phone && <p>{order.billing.phone}</p>}
      </>
    );
  };

  return (
    <div className="rounded-lg bg-white">
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block">
        {/* Order Title and Date */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#661F30]">
            {t.order.order} #{order.id}
          </h2>
          <p className="text-sm text-gray-500">
            {t.order.orderFromDay} {new Date(order.date_created).toLocaleDateString()}
          </p>
        </div>

        {/* Order Items Table */}
        <table className="w-full border-collapse rounded-[25px] overflow-hidden">
          <thead className="bg-beige py-4">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-neutral-darker">
                {t.product.product}
              </th>
              <th className="py-3 px-6 text-left font-semibold text-neutral-darker">
                {t.common.price}
              </th>
              <th className="py-3 px-6 text-left font-semibold text-neutral-darker">
                {t.common.quantity}
              </th>
              <th className="py-3 px-6 text-right font-semibold text-neutral-darker">
                {t.common.total}
              </th>
            </tr>
          </thead>
          <tbody>
            {order.line_items.map((item) => (
              <tr key={item.product_id} className="border-b border-gray-300">
                <td className="py-3 px-6 flex items-center">
                  <img
                    src={
                      typeof item.image === 'object'
                        ? item.image.src
                        : item.image || '/placeholder.jpg'
                    }
                    alt={item.name}
                    className="w-[120px] h-[120px] rounded-md mr-4 object-cover"
                  />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    {item.regular_price &&
                      item.price !== item.regular_price && (
                        <p className="text-sm font-bold line-through text-gray-500">
                          {item.regular_price} {currency}
                        </p>
                      )}
                  </div>
                </td>
                <td className="py-3  font-bold px-4">{Number(item.price).toFixed()} {currency}</td>
                <td className="py-3 px-4 text-center">{item.quantity}</td>
                <td className="py-3 font-bold px-4 text-end">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} {currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="grid grid-cols-2 mt-8 ">
          {/* Left Column: Title */}
          <div>
            <h3 className="font-light text-[16px] pl-6 ">{t.order.summary}:</h3>
          </div>

          {/* Right Column: Summary */}
          <div>
            <div className="grid grid-cols-2 text-right">
              {/* Labels */}
              <div className="text-left space-y-6">
                <p className="mb-1 px-4">{t.order.productsPrice}:</p>
                <p className="mb-1 px-4 ">{t.cart.shipping}:</p>
                <p className="mb-1 px-4">{t.order.tax} (PL VAT 23.0%):</p>
                <p className="bg-beige font-bold text-lg text-[#661F30] px-4 rounded-bl-[24px] rounded-tl-[24px]">
                  {t.order.togther}:
                </p>
              </div>

              {/* Prices */}
              <div className="space-y-6">
                <p className="mb-1 px-4">
                  {order.subtotal || calculatedSubtotal} {currency}
                </p>
                <p className="mb-1 px-4">{order.shipping_total || '0.00'} {currency}</p>
                <p className="mb-1 px-4">{order.tax || calculatedTax} {currency}</p>
                <p className="rounded-tr-[24px] rounded-br-[24px] px-4 bg-beige font-bold text-lg text-[#661F30]">
                  {order.total} {currency}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {renderShippingAddressDesktop()}

        {/* Action Button */}
        <div className="mt-6 text-right">
          <button
            onClick={() => setRepeatOpen(true)}
            className="bg-black text-white py-3 px-4 rounded-full"
          >
            {t.order.orderAgain}
          </button>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="block md:hidden bg-[#F8F5F1] rounded-[24px]">
        <div className="bg-white rounded-[24px] space-y-6">
          {/* Mobile Header */}
          <h2 className=" text-[20px] text-dark-pastel-red font-bold">
            {t.order.myOrder}
          </h2>

          {/* Order Items (Mobile Cards) */}
          {order.line_items.map((item) => renderMobileItem(item))}

          {/* Summary */}
          <div className='border-[#DAD3C8] border-t pt-4'>
            <h3 className="text-base font-semibold text-[#5D5759] mb-2">
              {t.order.summary}:
            </h3>
            <div className="grid grid-cols-2 text-sm gap-y-1">
              <span className="text-[#0E0B0C]">{t.order.productsPrice}:</span>
              <span className="text-right text-[#363132]">
                {order.subtotal || calculatedSubtotal} {currency}
              </span>

              <span className="text-[#0E0B0C]">{t.cart.shipping}:</span>
              <span className="text-right text-[#363132]">
                {order.shipping_total || '0.00'} {currency}
              </span>

              <span className="text-[#0E0B0C] text-[12px]">{t.order.tax} (PL&nbsp;VAT&nbsp;23&nbsp;%):</span>
              <span className="text-right text-[#363132]">
                {order.tax || calculatedTax} {currency}
              </span>

              <span className="font-bold text-[#661F30] mt-2 bg-[#EBE5DF] rounded-l-full pl-3 py-1">
                Razem
              </span>
              <span className="font-bold text-right mt-2 text-[#661F30] bg-[#EBE5DF] rounded-r-full pr-3 py-1">
                {order.total} {currency}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-base font-semibold text-[#5D5759] mb-2">{t.order.shippingAddress}:</h3>
            {renderShippingAddressMobile()}
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-base font-semibold text-[#5D5759] mb-2">{t.order.invoiceDetails}:</h3>
            {renderBillingAddressMobile()}
          </div>

          {/* Action Button (Mobile) */}
          <div className="mt-4 text-right">
            <button
              onClick={() => setRepeatOpen(true)}
              className="bg-dark-pastel-red w-full text-white py-3 px-4 rounded-full font-semibold"
            >
              {t.order.orderAgain}
            </button>
          </div>
        </div>
      </div>
      {repeatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#36313266]">
          <div className="bg-[#F8F5F3] rounded-[25px] w-11/12 md:w-[600px] p-8 relative">
            <button
              className="absolute right-5 top-5 text-2xl"
              aria-label="Zamknij"
              onClick={() => setRepeatOpen(false)}
            >
              ×
            </button>
            <h2 className="text-[24px] md:text-[28px] font-bold mb-6">
              {t.order.orderAgain}
            </h2>
            <p className="text-[16px] mb-10 leading-snug">
              {t.order.orderAgainInfo}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setRepeatOpen(false)}
                className="flex-1 border border-black rounded-full py-3 text-center"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleConfirmRepeat}
                className="flex-1 bg-black text-white rounded-full py-3 text-center"
              >
                {t.common.continue}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
