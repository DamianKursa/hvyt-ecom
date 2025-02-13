import React from 'react';
import { Order } from '@/utils/functions/interfaces';
import Link from 'next/link';

interface OrderTableProps {
  content: Order[];
  onViewDetails?: (order: Order) => void; // Callback for inline details rendering
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
        className: 'bg-[#EAEFEC] text-[#EAEFEC]',
      };
    case 'cancelled':
      return {
        label: 'Anulowane',
        className: 'bg-dark-pastel-red text-[#F0E0CF]',
      };
    default:
      return {
        label: 'Nieznany status',
        className: 'bg-gray-100 text-[#fff]',
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

const OrderTable: React.FC<OrderTableProps> = ({ content, onViewDetails }) => {
  return (
    <>
      {/* 
        DESKTOP TABLE 
        (visible on md+ screens, unchanged)
      */}
      <div className="hidden md:block">
        <table className="w-full table-auto rounded-[25px] overflow-hidden">
          <thead className="bg-beige">
            <tr>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker">
                Zamówienie
              </th>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker">
                Data zamówienia
              </th>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker">
                Status płatności
              </th>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker">
                Status realizacji
              </th>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker">
                Suma
              </th>
              <th className="py-3 px-4 text-left font-semibold text-neutral-darker"></th>
            </tr>
          </thead>
          <tbody className="border border-gray-200 rounded-[25px]">
            {content.map((order) => {
              const { label: orderLabel, className: orderClassName } =
                getOrderStatusLabel(order.status);
              const paymentLabel = getPaymentStatusLabel(order.payment_status);

              return (
                <tr key={order.id} className="border-b border-neutral-light">
                  <td className="py-3 font-bold px-4">#{order.id}</td>
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
                    {onViewDetails ? (
                      <button
                        onClick={() => onViewDetails(order)}
                        className="text-black font-light underline"
                      >
                        Szczegóły
                      </button>
                    ) : (
                      <Link
                        href={`/moje-konto/moje-zamowienia/${order.id}`}
                        className="text-black font-light underline"
                      >
                        Szczegóły
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 
        MOBILE CARD VIEW 
        (visible on screens below md)
      */}
      <div className="md:hidden">
        {content.map((order) => {
          const { label: orderLabel, className: orderClassName } =
            getOrderStatusLabel(order.status);

          // Payment label is not displayed on mobile anymore
          // const paymentLabel = getPaymentStatusLabel(order.payment_status);

          return (
            <div
              key={order.id}
              className="mb-6 border-b border-gray-200 md:rounded-[25px]"
            >
              <div className="flex items-center justify-between mb-2 mt-4 mx-4">
                <span className="font-bold">Zamówienie</span>
                <span className="font-bold">#{order.id}</span>
              </div>
              <div className="flex items-center justify-between mb-2 mx-4">
                <span>Data zamówienia</span>
                <span>{new Date(order.date_created).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between mb-2 mx-4">
                <span>Status realizacji</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${orderClassName}`}
                >
                  {orderLabel}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 mx-4">
                <span>Suma</span>
                <span>{order.total} zł</span>
              </div>
              <div className="flex justify-center mb-4">
                {onViewDetails ? (
                  <button
                    onClick={() => onViewDetails(order)}
                    className="text-black font-light underline flex items-center"
                  >
                    Szczegóły
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={`/moje-konto/moje-zamowienia/${order.id}`}
                    className="text-black font-light underline flex items-center"
                  >
                    Szczegóły
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OrderTable;
