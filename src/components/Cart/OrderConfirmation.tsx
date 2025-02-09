import React, { useEffect } from 'react';
import { Order } from '@/utils/functions/interfaces';

interface OrderConfirmationProps {
  order: Order;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  // Log the order for inspection
  useEffect(() => {
    console.log('Fetched Order:', order);
  }, [order]);

  return (
    <div className="max-w-[1000px] mx-auto bg-white rounded-[24px] shadow-md">
      <div className="pb-6">
        {/* Order Items Table */}
        <table className="w-full border-collapse rounded-[24px] overflow-hidden mb-8">
          <thead className="bg-beige">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-neutral-darker">
                Produkt
              </th>
              <th className="py-4 px-6 text-center font-semibold text-neutral-darker">
                Cena
              </th>
              <th className="py-4 px-6 text-center font-semibold text-neutral-darker">
                Ilość
              </th>
              <th className="py-4 px-6 text-center font-semibold text-neutral-darker">
                Suma
              </th>
            </tr>
          </thead>
          <tbody>
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
                <td className="py-4 px-6 text-center font-bold">
                  {item.price} zł
                </td>
                <td className="py-4 px-6 text-center font-light">
                  {item.quantity}
                </td>
                <td className="py-4 px-6 text-center font-bold">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} zł
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Order Summary Section (Razem, Metoda płatności) */}
        <div className="grid grid-cols-2 px-6 gap-6 mb-8">
          <div className="text-left space-y-6">
            <p className="font-light text-lg">Metoda płatności</p>
            <p className="font-light text-lg">Razem</p>
          </div>
          <div className="text-left space-y-6 px-6">
            <p className="text-lg font-light">
              {order.payment_method || 'Brak danych'}
            </p>
            <p className="text-lg font-light">{order.total} zł</p>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="grid grid-cols-2 gap-6 px-6 pt-6 mb-8">
          <div className="text-left">
            <p className="font-light text-lg">Dane do wysyłki</p>
          </div>
          <div className="text-left px-6 font-light">
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
        </div>

        {/* Billing Address Section */}
        <div className="grid grid-cols-2 gap-6 px-6 pt-6">
          <div className="text-left">
            <p className="font-light text-lg">Dane do faktury</p>
          </div>
          <div className="text-left px-6 font-light">
            {order.billing?.first_name ? (
              <>
                <p>
                  {order.billing.first_name} {order.billing.last_name}
                </p>
                <p>{order.billing.email}</p>
                <p>
                  {order.billing.address_1 ||
                    (order.billing as any).address ||
                    'Brak adresu'}
                </p>
                <p>
                  {order.billing.city} {order.billing.postcode}
                </p>
                <p>{order.billing.country}</p>
                <p>{(order.billing as any).phone}</p>
              </>
            ) : (
              <p>Brak danych do faktury.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
