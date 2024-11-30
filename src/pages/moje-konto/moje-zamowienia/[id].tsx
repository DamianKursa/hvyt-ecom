import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Order } from '@/utils/functions/interfaces';
import Layout from '@/components/Layout/Layout.component';
import LoadingModal from '@/components/UI/LoadingModal';

const OrderDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/moje-konto/moje-zamowienia/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data: Order = await response.json();
          setOrder(data);
        } else {
          router.push('/moje-konto/moje-zamowienia');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, router]);

  if (loading) {
    return (
      <LoadingModal
        title="Ładowanie..."
        description="Proszę czekać, trwa ładowanie danych..."
      />
    );
  }

  if (!order) {
    return <p>Nie znaleziono szczegółów zamówienia.</p>;
  }

  const renderShippingAddress = () => {
    const { shipping } = order;

    return (
      <div>
        <p>{`${shipping.first_name} ${shipping.last_name}`}</p>
        {shipping.company && <p>{shipping.company}</p>}
        <p>{shipping.address_1}</p>
        {shipping.address_2 && <p>{shipping.address_2}</p>}
        <p>
          {shipping.postcode} {shipping.city}
        </p>
        {shipping.state && <p>{shipping.state}</p>}
        <p>{shipping.country}</p>
        {shipping.phone && <p>{shipping.phone}</p>}
      </div>
    );
  };

  return (
    <Layout title={`Zamówienie #${id}`}>
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-6">Zamówienie #{id}</h2>
        <p className="text-gray-500 text-sm">
          z dnia {new Date(order.date_created).toLocaleDateString()}
        </p>
        <div className="rounded-[25px] bg-white p-8 shadow-sm mt-4">
          <table className="w-full table-auto">
            <thead className="bg-[#F9F8F5]">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Produkt
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Cena
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Ilość
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Suma
                </th>
              </tr>
            </thead>
            <tbody>
              {order.line_items.map((item) => (
                <tr
                  key={item.product_id}
                  className="odd:bg-[#F7F7F7] even:bg-white"
                >
                  <td className="py-3 px-4 flex items-center">
                    <img
                      src={item.image || '/placeholder.jpg'} // Replace with actual image if available
                      alt={item.name}
                      className="w-[60px] h-[60px] rounded-lg mr-4"
                    />
                    <div>
                      <p>{item.name}</p>
                      {item.regular_price &&
                        item.price !== item.regular_price && (
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
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold">Adres wysyłki</h3>
              {renderShippingAddress()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Podsumowanie</h3>
              <p>Cena produktów: {order.subtotal || '0.00'} zł</p>
              <p>Wysyłka: {order.shipping_total || '0.00'} zł</p>
              <p>Podatek: {order.tax || '0.00'} zł</p>
              <p className="text-lg font-bold text-primary">
                Razem: {order.total} zł
              </p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <button className="bg-primary text-white py-2 px-6 rounded-[25px]">
              Ponów zamówienie
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
