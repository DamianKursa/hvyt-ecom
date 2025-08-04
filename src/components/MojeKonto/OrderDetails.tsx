import React, { useEffect } from 'react';
import { Order } from '@/utils/functions/interfaces';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const calculatedSubtotal = order.line_items
    .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  const calculatedTax = (
    (parseFloat(order.subtotal || calculatedSubtotal) * 23) /
    100
  ).toFixed(2);

  // Desktop: Shipping address
  const renderShippingAddressDesktop = () => {
    const { shipping, billing } = order;

    return (
      <div className="grid pl-6 grid-cols-2 mt-8">
        <div>
          <h3 className="font-light text-[16px] pl-6">Adres wysyłki:</h3>
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
      <div key={item.product_id} className="flex gap-4 py-4 border-t last:border-none">
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
              <span className="font-light text-[#0E0B0C]">{item.price} zł</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-[#5D5759]">Ilość:</span>
              <span className="font-light text-[#0E0B0C]">{item.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-[#5D5759]">Suma:</span>
              <span className="font-light justify-left text-[#0E0B0C]">
                {(parseFloat(item.price) * item.quantity).toFixed(2)} zł
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
      return <p>Brak danych do faktury.</p>;
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
            Zamówienie #{order.id}
          </h2>
          <p className="text-sm text-gray-500">
            z dnia {new Date(order.date_created).toLocaleDateString()}
          </p>
        </div>

        {/* Order Items Table */}
        <table className="w-full border-collapse rounded-[25px] overflow-hidden">
          <thead className="bg-beige py-4">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-neutral-darker">
                Produkt
              </th>
              <th className="py-3 px-6 text-left font-semibold text-neutral-darker">
                Cena
              </th>
              <th className="py-3 px-6 text-left font-semibold text-neutral-darker">
                Ilość
              </th>
              <th className="py-3 px-6 text-right font-semibold text-neutral-darker">
                Suma
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
                          {item.regular_price} zł
                        </p>
                      )}
                  </div>
                </td>
                <td className="py-3  font-bold px-4">{item.price} zł</td>
                <td className="py-3 px-4 text-center">{item.quantity}</td>
                <td className="py-3 font-bold px-4 text-end">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} zł
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="grid grid-cols-2 mt-8 ">
          {/* Left Column: Title */}
          <div>
            <h3 className="font-light text-[16px] pl-6 ">Podsumowanie:</h3>
          </div>

          {/* Right Column: Summary */}
          <div>
            <div className="grid grid-cols-2 text-right">
              {/* Labels */}
              <div className="text-left space-y-6">
                <p className="mb-1 px-4">Cena produktów:</p>
                <p className="mb-1 px-4 ">Wysyłka:</p>
                <p className="mb-1 px-4">Podatek (PL VAT 23.0%):</p>
                <p className="bg-beige font-bold text-lg text-[#661F30] px-4 rounded-bl-[24px] rounded-tl-[24px]">
                  Razem:
                </p>
              </div>

              {/* Prices */}
              <div className="space-y-6">
                <p className="mb-1 px-4">
                  {order.subtotal || calculatedSubtotal} zł
                </p>
                <p className="mb-1 px-4">{order.shipping_total || '0.00'} zł</p>
                <p className="mb-1 px-4">{order.tax || calculatedTax} zł</p>
                <p className="rounded-tr-[24px] rounded-br-[24px] px-4 bg-beige font-bold text-lg text-[#661F30]">
                  {order.total} zł
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {renderShippingAddressDesktop()}

        {/* Action Button */}
        <div className="mt-6 text-right">
          <button className="bg-black text-white py-3 px-4 rounded-full">
            Ponów zamówienie
          </button>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="block md:hidden bg-[#F8F5F1] rounded-[24px]">
        <div className="bg-white rounded-[24px] space-y-6">
          {/* Mobile Header */}
          <h2 className=" text-[20px] text-dark-pastel-red font-bold">
            Moje zamówienie
          </h2>

          {/* Order Items (Mobile Cards) */}
          {order.line_items.map((item) => renderMobileItem(item))}

          {/* Summary */}
          <div className='border-t pt-4'>
            <h3 className="text-base font-semibold text-[#5D5759] mb-2">
              Podsumowanie:
            </h3>
            <div className="grid grid-cols-2 text-sm gap-y-1">
              <span className="text-[#0E0B0C]">Cena produktów:</span>
              <span className="text-right text-[#363132]">
                {order.subtotal || calculatedSubtotal} zł
              </span>

              <span className="text-[#0E0B0C]">Wysyłka:</span>
              <span className="text-right text-[#363132]">
                {order.shipping_total || '0.00'} zł
              </span>

              <span className="text-[#0E0B0C] text-[12px]">Podatek (PL&nbsp;VAT&nbsp;23&nbsp;%):</span>
              <span className="text-right text-[#363132]">
                {order.tax || calculatedTax} zł
              </span>

              <span className="font-bold text-[#661F30] mt-2 bg-[#EBE5DF] rounded-l-full pl-3 py-1">
                Razem
              </span>
              <span className="font-bold text-right mt-2 text-[#661F30] bg-[#EBE5DF] rounded-r-full pr-3 py-1">
                {order.total} zł
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-base font-semibold text-[#5D5759] mb-2">Adres wysyłki:</h3>
            {renderShippingAddressMobile()}
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-base font-semibold text-[#5D5759] mb-2">Dane do faktury:</h3>
            {renderBillingAddressMobile()}
          </div>

          {/* Action Button (Mobile) */}
          <div className="mt-4 text-right">
            <button className="bg-dark-pastel-red w-full text-white py-3 px-4 rounded-full font-semibold">
              Ponów zamówienie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
