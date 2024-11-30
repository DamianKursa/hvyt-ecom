import React from 'react';
import Link from 'next/link';
import { Order } from '@/utils/functions/interfaces';
interface OrderTableProps {
  content: Order[];
}

// Function to map order statuses
const getOrderStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Oczekuje na płatność',
        className: 'bg-yellow-200 text-yellow-800',
      };
    case 'processing':
      return { label: 'W toku', className: 'bg-blue-200 text-blue-800' };
    case 'completed':
      return {
        label: 'Zrealizowane',
        className: 'bg-green-200 text-green-800',
      };
    case 'cancelled':
      return { label: 'Anulowane', className: 'bg-red-200 text-red-800' };
    default:
      return {
        label: 'Nieznany status',
        className: 'bg-gray-100 text-gray-500',
      };
  }
};

// Function to map payment statuses
const getPaymentStatusLabel = (paymentStatus: string) => {
  switch (paymentStatus) {
    case 'paid':
      return 'Zapłacone';
    case 'pending':
      return 'Oczekuje na płatność';
    default:
      return 'Nieznany status płatności';
  }
};

const OrderTable: React.FC<OrderTableProps> = ({ content }) => {
  return (
    <table className="w-full table-auto rounded-[25px] overflow-hidden">
      <thead className="bg-beige">
        <tr>
          <th className="py-3 px-4 text-left font-semibold text-neutral-darker">
            Zamówienie
          </th>
          <th className="py-3 px-4 text-left font-semibold text-neutral-darker">
            Data zamówienia
          </th>
          <th className="py-3 px-4 text-left font-semibold text-neutral-darker">
            Status płatności
          </th>
          <th className="py-3 px-4 text-left font-semibold text-neutral-darker">
            Status realizacji
          </th>
          <th className="py-3 px-4 text-left font-semibold text-neutral-darker">
            Suma
          </th>
          <th className="py-3 px-4 text-left font-semibold text-neutral-darker">
            Akcje
          </th>
        </tr>
      </thead>
      <tbody>
        {content.map((order) => {
          const { label: orderLabel, className: orderClassName } =
            getOrderStatusLabel(order.status);
          const paymentLabel = getPaymentStatusLabel(order.payment_status);

          return (
            <tr
              key={order.id}
              className="odd:bg-[#F7F7F7] even:bg-white border-t border-neutral-light"
            >
              <td className="py-3 font-bold px-4">{order.id}</td>
              <td className="py-3 px-4">
                {new Date(order.date_created).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  {paymentLabel}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${orderClassName}`}
                >
                  {orderLabel}
                </span>
              </td>
              <td className="py-3 text-black font-light px-4">
                {order.total} zł
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/moje-konto/moje-zamowienia/${order.id}`}
                  className="text-black font-light underline"
                >
                  Szczegóły
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrderTable;
