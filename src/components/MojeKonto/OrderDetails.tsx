import React from 'react';
import { Order } from '@/utils/functions/interfaces';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  // Function to calculate subtotal if not provided
  const calculatedSubtotal = order.line_items
    .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  // Calculate tax (e.g., PL VAT 23%) if not provided
  const calculatedTax = (
    (parseFloat(order.subtotal || calculatedSubtotal) * 23) /
    100
  ).toFixed(2);

  const renderShippingAddress = () => {
    const { shipping } = order;

    return (
      <div className="grid grid-cols-2 mt-8">
        <div>
          <h3 className="font-light text-[16px]">Adres wysyłki:</h3>
        </div>
        <div className="text-left">
          <p>{`${shipping.first_name} ${shipping.last_name}`}</p>
          {shipping.company && <p>{shipping.company}</p>}
          <p>{shipping.address_1}</p>
          {shipping.address_2 && <p>{shipping.address_2}</p>}
          <p>
            {shipping.postcode} {shipping.city}
          </p>
          <p>{shipping.country}</p>
          {order.phone && <p>{order.phone}</p>}
          {order.email && <p>{order.email}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-white p-6">
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
      <table className="w-full bordertable-auto rounded-[25px] overflow-hidden">
        <thead className=" bg-beige py-4">
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
            <th className="py-3 px-6 text-left font-semibold text-neutral-darker">
              Suma
            </th>
          </tr>
        </thead>
        <tbody>
          {order.line_items.map((item) => (
            <tr key={item.product_id}>
              <td className="py-3 flex items-center">
                <img
                  src={
                    typeof item.image === 'string'
                      ? item.image
                      : item.image?.src || '/placeholder.jpg'
                  }
                  alt={item.name}
                  className="w-[120px] h-[120px] rounded-md mr-4 object-cover"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.regular_price && item.price !== item.regular_price && (
                    <p className="text-sm line-through text-gray-500">
                      {item.regular_price} zł
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">{item.price} zł</td>
              <td className="py-3 px-4 text-center">{item.quantity}</td>
              <td className="py-3 px-4">
                {(parseFloat(item.price) * item.quantity).toFixed(2)} zł
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="grid grid-cols-2 mt-8">
        {/* Left Column: Title */}
        <div>
          <h3 className="font-light text-[16px]">Podsumowanie:</h3>
        </div>

        {/* Right Column: Summary */}
        <div>
          <div className="grid grid-cols-2 gap-4 text-right">
            {/* Labels */}
            <div className="text-left">
              <p className="mb-1">Cena produktów:</p>
              <p className="mb-1">Wysyłka:</p>
              <p className="mb-1">Podatek (PL VAT 23.0%):</p>
              <p className="font-bold text-lg">Razem:</p>
            </div>

            {/* Prices */}
            <div>
              <p className="mb-1">{order.subtotal || calculatedSubtotal} zł</p>
              <p className="mb-1">{order.shipping_total || '0.00'} zł</p>
              <p className="mb-1">{order.tax || calculatedTax} zł</p>
              <p className="font-bold text-lg text-[#661F30]">
                {order.total} zł
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {renderShippingAddress()}

      {/* Action Button */}
      <div className="mt-6 text-right">
        <button className="bg-black text-white py-3 px-4 rounded-full">
          Ponów zamówienie
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
