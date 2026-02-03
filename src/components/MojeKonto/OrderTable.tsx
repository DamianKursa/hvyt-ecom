import React, { useState } from 'react';
import CustomDropdown from '@/components/UI/CustomDropdown.component';
import { Order } from '@/utils/functions/interfaces';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCurrency, Language } from '@/utils/i18n/config';

interface OrderTableProps {
  content: Order[];
  onViewDetails?: (order: Order) => void;
}

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

  const router = useRouter();
  const currency = getCurrency(router?.locale as Language ?? 'pl');

  const [sortOpen, setSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | ''>('');
  const sortedContent =
    sortOrder === ''
      ? content
      : [...content].sort((a, b) => {
        const da = new Date(a.date_created).getTime();
        const db = new Date(b.date_created).getTime();
        return sortOrder === 'newest' ? db - da : da - db;
      });
  const sortingOptions = ['Najnowsze zamówienia', 'Najstarsze zamówienia'];

  if (!content || content.length === 0) {
    return (
      <div className="mt-[64px] md:mt-0 rounded-[25px]  bg-white p-4 flex flex-col items-center justify-center">
        <img
          src="/icons/brak-zamowien.svg"
          alt="Brak zamówień"
          className="w-28 h-28 mb-4"
        />
        <h2 className="text-[18px] md:text-[28px] text-center font-semibold mb-4 text-black">
          Nie masz jeszcze żadnych zamówień
        </h2>
        <p className="text-[16px] md:text-[18px] text-black text-center font-light mb-6">
          Zacznij buszować i znajdź coś dla siebie
        </p>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <Link
              href="/kolekcje"
              className="flex items-center px-10 md:px-16 py-3 bg-black text-white rounded-full font-light text-[16px]"
            >
              Sprawdź nasze kolekcje
              <span className="ml-2">
                <Image
                  src="/icons/sprawdz-kolekcje.svg"
                  alt="Ikona kolekcji"
                  width={16}
                  height={16}
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-2xl font-semibold mb-4 text-[#661F30]">
            Moje zamówienia
          </h2>
          <div className="w-1/3">
            <CustomDropdown
              className={`${sortOrder ? 'border border-dark-pastel-red text-dark-pastel-red' : ''} h-12 bg-white flex items-center justify-center px-4 text-center`}
              options={sortingOptions}
              selectedValue={
                sortOrder
                  ? sortOrder === 'newest'
                    ? 'Najnowsze zamówienia'
                    : 'Najstarsze zamówienia'
                  : null
              }
              placeholder="Sortowanie"
              onChange={(value) =>
                setSortOrder(
                  value === 'Najnowsze zamówienia' ? 'newest' : 'oldest'
                )
              }
              isProductPage={false}
            />
          </div>
        </div>
        <table className="w-full table-auto rounded-[25px] overflow-hidden">
          <thead className="bg-beige">
            <tr>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker">
                Zamówienie
              </th>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker">
                Data zamówienia
              </th>
              <th className="py-4 px-4 text-left font-semibold text-neutral-darker"></th>
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
            {sortedContent.map((order) => {
              const { label: orderLabel, className: orderClassName } =
                getOrderStatusLabel(order.status);
              const paymentLabel = getPaymentStatusLabel(order.payment_status);

              return (
                <tr key={order.id} className="border-b border-neutral-light">
                  <td className="py-3  px-4">#{order.id}</td>
                  <td className="py-3 px-4">
                    {new Date(order.date_created).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${orderClassName}`}
                    >
                      {orderLabel}
                    </span>
                  </td>
                  <td className="py-3 text-black font-light px-4">
                    {order.total} {currency.symbol}
                  </td>
                  <td className="py-3 px-4">
                    {onViewDetails ? (
                      <button
                        onClick={() => onViewDetails(order)}
                        className="text-black font-light underline"
                      >
                        <span className="flex items-center">
                          Szczegóły
                          <img src="/icons/arrow-right-pagination-black.svg" alt="" className="ml-2" />
                        </span>
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

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden">
        {content.map((order) => {
          const { label: orderLabel, className: orderClassName } =
            getOrderStatusLabel(order.status);

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
                <span>{order.total} {currency.symbol}</span>
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
