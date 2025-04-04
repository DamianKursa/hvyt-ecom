import React, { useEffect } from 'react';
import { Order } from '@/utils/functions/interfaces';

interface OrderConfirmationProps {
  order: Order;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  useEffect(() => {
    console.log('Fetched Order:', order);
  }, [order]);

  return (
    <div className="max-w-[1000px] mx-auto bg-white rounded-[24px]">
      {/* Desktop Layout */}
      <div className="hidden md:block pb-6">
        <table className="w-full border-collapse rounded-[24px] overflow-hidden mb-8">
          <thead className="bg-beige">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-neutral-darker">
                Produkt
              </th>
              <th className="py-4 px-6 text-left font-semibold text-neutral-darker">
                Cena
              </th>
              <th className="py-4 px-6 text-left font-semibold text-neutral-darker">
                Ilość
              </th>
              <th className="py-4 px-6 text-right font-semibold text-neutral-darker">
                Suma
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Order Items */}
            {order.line_items.map((item) => (
              <tr className="border-b" key={item.product_id}>
                <td className="py-4 px-6 flex items-center">
                  <img
                    src={
                      typeof item.image === 'object'
                        ? item.image.src
                        : item.image || '/placeholder.jpg'
                    }
                    alt={item.name}
                    className="w-[120px] h-[120px] rounded-[16px] mr-4 object-cover"
                  />
                  <div>
                    <p className="font-bold">{item.name}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-right font-bold">
                  {(parseFloat(item.price) / item.quantity).toFixed(2)} zł
                </td>
                <td className="py-4 px-6 text-left font-light">
                  {item.quantity}
                </td>
                <td className="py-4 px-6 text-left font-bold">
                  {item.price} zł
                </td>
              </tr>
            ))}

            {/* Payment Method */}
            <tr>
              <td className="py-4 px-6 text-left font-light text-lg">
                Metoda płatności
              </td>
              <td className="py-4 px-6 text-left font-light">
                {order.payment_method || 'Brak danych'}
              </td>
              <td className="py-4 px-6"></td>
              <td className="py-4 px-6"></td>
            </tr>

            {/* Total */}
            <tr>
              <td className="py-4 px-6 text-left font-light text-lg">Razem</td>
              <td className="py-4 px-6 text-left font-light">
                {order.total} zł
              </td>
              <td className="py-4 px-6"></td>
              <td className="py-4 px-6"></td>
            </tr>

            {/* Shipping Address */}
            <tr>
              <td className="py-4 px-6 text-left font-light text-lg">
                Dane do wysyłki
              </td>
              <td className="py-4 px-6 text-left font-light">
                {order.shipping?.first_name ? (
                  <>
                    <p>
                      {order.shipping.first_name} {order.shipping.last_name}
                    </p>
                    <p>
                      {order.shipping.address_1 ||
                        (order.shipping as any).address ||
                        'Brak adresu'}
                    </p>
                    <p>
                      {order.shipping.city} {order.shipping.postcode}
                    </p>
                    <p>{order.shipping.country}</p>
                  </>
                ) : (
                  <p>Brak danych o wysyłce.</p>
                )}
              </td>
              <td className="py-4 px-6"></td>
              <td className="py-4 px-6"></td>
            </tr>

            {/* Billing Address */}
            <tr>
              <td className="py-4 px-6 text-left font-light text-lg">
                Dane do faktury
              </td>
              <td className="py-4 px-6 text-left font-light">
                {order.billing?.first_name ? (
                  <>
                    <p>
                      {order.billing.first_name} {order.billing.last_name}
                    </p>
                    <p>
                      {order.billing.address_1 ||
                        (order.billing as any).address ||
                        'Brak adresu'}
                    </p>
                    <p>
                      {order.billing.city} {order.billing.postcode}
                    </p>
                    <p>{order.billing.country}</p>
                  </>
                ) : (
                  <p>Brak danych do faktury.</p>
                )}
              </td>
              <td className="py-4 px-6"></td>
              <td className="py-4 px-6 text-left font-light">
                {order.billing?.email && <p>{order.billing.email}</p>}
                {order.billing?.phone && <p>{order.billing.phone}</p>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden p-4">
        {/* Mobile Header */}
        <h2 className="text-[20px] text-dark-pastel-red font-bold mb-4">
          Moje zamówienie
        </h2>

        {/* Order Items */}
        {order.line_items.map((item) => (
          <div
            key={item.product_id}
            className="border-b border-gray-200 pb-4 mb-4"
          >
            <div className="flex">
              <img
                src={
                  typeof item.image === 'object'
                    ? item.image.src
                    : item.image || '/placeholder.jpg'
                }
                alt={item.name}
                className="w-[80px] h-[80px] rounded-[16px] mr-4 object-cover"
              />
              <div className="flex-1">
                <p className="font-bold text-[16px]">{item.name}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Cena</span>
                    <span className="text-gray-900 font-bold">
                      {(parseFloat(item.price) / item.quantity).toFixed(2)} zł
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Ilość</span>
                    <span className="text-gray-900 font-light">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Suma</span>
                    <span className="text-gray-900 font-bold">
                      {item.price} zł
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Payment Method */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <p className="text-lg font-light font-[#857C7F]">Metoda płatności</p>
          <p className="font-[#000]font-light">
            {order.payment_method || 'Brak danych'}
          </p>
        </div>

        {/* Total */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <p className="text-lg font-light font-[#857C7F]">Razem</p>
          <p className="font-[#000] font-light">{order.total} zł</p>
        </div>

        {/* Shipping Address */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <p className="text-lg font-light font-[#857C7F]">Dane do wysyłki</p>
          {order.shipping?.first_name ? (
            <>
              <p>
                {order.shipping.first_name} {order.shipping.last_name}
              </p>
              <p>
                {order.shipping.address_1 ||
                  (order.shipping as any).address ||
                  'Brak adresu'}
              </p>
              <p>
                {order.shipping.city} {order.shipping.postcode}
              </p>
              <p>{order.shipping.country}</p>
            </>
          ) : (
            <p>Brak danych o wysyłce.</p>
          )}
        </div>

        {/* Billing Address */}
        <div>
          <p className="text-lg font-light font-[#857C7F]">Dane do faktury</p>
          {order.billing?.first_name ? (
            <>
              <p>
                {order.billing.first_name} {order.billing.last_name}
              </p>
              <p>
                {order.billing.address_1 ||
                  (order.billing as any).address ||
                  'Brak adresu'}
              </p>
              <p>
                {order.billing.city} {order.billing.postcode}
              </p>
              <p>{order.billing.country}</p>
              {order.billing?.email && <p>{order.billing.email}</p>}
              {order.billing?.phone && <p>{order.billing.phone}</p>}
            </>
          ) : (
            <p>Brak danych do faktury.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
