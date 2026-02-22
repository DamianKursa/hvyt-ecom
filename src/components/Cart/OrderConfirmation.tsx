import React, { useEffect } from 'react';
import { Order } from '@/utils/functions/interfaces';
import { useRouter } from 'next/router';
import { useI18n } from '@/utils/hooks/useI18n';
import { getCurrencyByLocale, getCurrencyBySlug } from '@/config/currencies';

interface OrderConfirmationProps {
  order: Order;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  const {t} = useI18n()
  const router = useRouter();
  const currency = getCurrencyByLocale(router.locale as string).symbol;

  useEffect(() => {
    console.log('Fetched Order:', order);
  }, [order]);

  return (
    <div className="rounded-lg">
      {/* DESKTOP LAYOUT */}
      <div className="bg-white rounded-[25px] pb-4 hidden md:block">


        {/* Items table (matches OrderDetails) */}
        <table className="w-full table-fixed border-collapse rounded-[25px] overflow-hidden">
          <thead className="bg-beige py-4">
            <tr>
              <th className="py-3 px-6 w-1/2 text-left font-semibold text-neutral-darker">
                {t.thankYou.order.product}
              </th>
              <th className="py-3 pr-6 w-1/2 text-left font-semibold text-neutral-darker">
                <div className="grid grid-cols-3 gap-4">
                  <span>{t.thankYou.order.price}</span>
                  <span className="text-left">{t.thankYou.order.quantity}</span>
                  <span className="text-right">{t.thankYou.order.total}</span>
                </div>
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
                  <p className="font-bold">{item.name}</p>
                </td>
                <td className="py-3 ">
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-bold">{(parseFloat(item.price) / item.quantity).toFixed(2)} {currency}</span>
                    <span className="text-left font-light">{item.quantity}</span>
                    <span className="text-right pr-6 font-bold">{item.price} {currency}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment Method (new row, same style) */}
        <div className="grid grid-cols-2 mt-8">
          <h3 className="font-light text-[16px] pl-6">{t.thankYou.order.paymentMethod}:</h3>
          <p className="text-left pr-6">
            {order.payment_method || t.thankYou.order.noData}
          </p>
        </div>

        {/* Summary block – copied from OrderDetails */}
        <div className="grid grid-cols-2 mt-8">

          <div>
            <div className="grid grid-cols-1 text-right">
              <div className="text-left space-y-6">
                <p className=" pl-6 font-light text-[16px] rounded-bl-[24px] rounded-tl-[24px]">
                  {t.thankYou.order.total2}:
                </p>
              </div>

            </div>
          </div>
          <div className="space-y-6">
            <p className=" font-bold font-light text-[16px] rounded-tr-[24px] rounded-br-[24px]">
              {order.total} {currency}
            </p>
          </div>
        </div>

        {/* Shipping / Billing (same style) */}
        <div className="grid  grid-cols-2 mt-8">
          <h3 className="font-light text-[16px] pl-6">{t.thankYou.order.shippingAddress}:</h3>
          <div>
            {order.shipping?.first_name ? (
              <>
                <p>
                  {order.shipping.first_name} {order.shipping.last_name}
                </p>
                {order.shipping.company && <p>{order.shipping.company}</p>}
                <p>{order.shipping.address_1 || (order.shipping as any)?.address || 'Brak adresu'}</p>
                {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                <p>
                  {order.shipping.postcode} {order.shipping.city}
                </p>
                <p>{order.shipping.country}</p>
              </>
            ) : (
              <p>{t.thankYou.order.noShippingData}</p>
            )}
          </div>
        </div>

        <div className="grid  grid-cols-2 mt-8">
          <h3 className="font-light pl-6 text-[16px] ">{t.thankYou.order.billingAddress}:</h3>
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              {order.billing?.first_name ? (
                <>
                  <p>
                    {order.billing.first_name} {order.billing.last_name}
                  </p>
                  {order.billing.company && <p>{order.billing.company}</p>}
                  <p>{order.billing.address_1 || (order.billing as any)?.address || t.thankYou.order.noAddress}</p>
                  {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                  <p>
                    {order.billing.city} {order.billing.postcode}
                  </p>
                  <p>{order.billing.country}</p>
                </>
              ) : (
                <p>{t.thankYou.order.noBillingData}</p>
              )}
            </div>
            <div>
              {order.billing?.email && <p>{order.billing.email}</p>}
              {order.billing?.phone && <p>{order.billing.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT (copied from OrderDetails + payment row) */}
      <div className="block md:hidden bg-[#F8F5F1]  rounded-[24px]">
        <div className="bg-white rounded-[24px] p-4 space-y-6">
          <h2 className="text-[20px] text-dark-pastel-red font-bold">
            {t.thankYou.order.title}
          </h2>

          {order.line_items.map((item) => (
            <div
              key={item.product_id}
              className="flex gap-4 py-4 border-t border-[#DAD3C8] last:border-none"
            >
              <img
                src={
                  typeof item.image === 'object'
                    ? item.image.src
                    : item.image || '/placeholder.jpg'
                }
                alt={item.name}
                className="w-[80px] h-[80px] rounded-[16px] object-cover mr-4"
              />
              <div className="flex-1">
                <p className="text-[16px] font-semibold text-[#0E0B0C]">
                  {item.name}
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#5D5759]">{t.thankYou.order.price}:</span>
                    <span className="font-light text-[#0E0B0C]">
                      {(parseFloat(item.price) / item.quantity).toFixed(2)} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-[#5D5759]">{t.thankYou.order.quantity}:</span>
                    <span className="font-light text-[#0E0B0C]">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-[#5D5759]">{t.thankYou.order.total}:</span>
                    <span className="font-light text-[#0E0B0C]">{item.price} {currency}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Payment */}
          <div className="border-t border-[#DAD3C8] pt-4">
            <h3 className="text-[16px] font-light text-[#857C7F] mb-2">
              {t.thankYou.order.paymentMethod}:
            </h3>
            <p className="text-[#0E0B0C]">
              {order.payment_method || t.thankYou.order.noData}
            </p>
          </div>

          {/* Summary */}
          <div className="">

            <div className="grid grid-cols-1 text-sm gap-y-1">
              <span className=" text-[16px] font-light text-[#857C7F] mb-2 ">
                {t.thankYou.order.total2}
              </span>
              <span className=" text-[16px]  text-left mt-2">
                {order.total} {currency}
              </span>
            </div>
          </div>

          {/* Shipping address */}
          <div>
            <h3 className="text-[16px] font-light text-[#857C7F] mb-2">
              {t.thankYou.order.shippingAddress}:
            </h3>
            {order.shipping?.first_name ? (
              <>
                <p>
                  {order.shipping.first_name} {order.shipping.last_name}
                </p>
                {order.shipping.company && <p>{order.shipping.company}</p>}
                <p>{order.shipping.address_1 || (order.shipping as any)?.address || t.thankYou.order.noAddress}</p>
                {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                <p>
                  {order.shipping.city} {order.shipping.postcode}
                </p>
                <p>{order.shipping.country}</p>
              </>
            ) : (
              <p>{t.thankYou.order.noShippingData}</p>
            )}
          </div>

          {/* Billing address */}
          <div>
            <h3 className="text-[16px] font-light text-[#857C7F] mb-2">
              {t.checkout.billingData}:
            </h3>
            {order.billing?.first_name ? (
              <>
                <p>
                  {order.billing.first_name} {order.billing.last_name}
                </p>
                {order.billing.company && <p>{order.billing.company}</p>}
                <p>{order.billing.address_1 || (order.billing as any)?.address || t.thankYou.order.noAddress}</p>
                {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                <p>
                  {order.billing.city} {order.billing.postcode}
                </p>
                <p>{order.billing.country}</p>
                {order.billing.email && <p>{order.billing.email}</p>}
                {order.billing.phone && <p>{order.billing.phone}</p>}
              </>
            ) : (
              <p>{t.thankYou.order.noBillingData}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
