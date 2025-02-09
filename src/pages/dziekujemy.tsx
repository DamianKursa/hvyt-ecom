import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import CartProgress from '@/components/Cart/CartProgress';
import OrderConfirmation from '@/components/Cart/OrderConfirmation';
import { Order } from '@/utils/functions/interfaces';

const Dziekujemy = () => {
  const router = useRouter();
  const { orderId, orderKey } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Map the english status to Polish
  const getPolishStatus = (status: string | null) => {
    if (!status) return 'BRAK DANYCH';
    switch (status.toLowerCase()) {
      case 'completed':
        return 'ZAKOŃCZONE';
      case 'processing':
        return 'W TRAKCIE REALIZACJI';
      case 'pending':
        return 'OCZEKUJĄCE';
      default:
        return status.toUpperCase();
    }
  };

  useEffect(() => {
    let currentOrderId = orderId || localStorage.getItem('recentOrderId');
    let currentOrderKey = orderKey || localStorage.getItem('recentOrderKey');

    if (!currentOrderId || !currentOrderKey) {
      setError('Nie znaleziono zamówienia.');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        console.log(`🔍 Fetching order details: ${currentOrderId}`);
        const response = await axios.get(
          `/api/orders/${currentOrderId}?orderKey=${currentOrderKey}`,
        );
        const fetchedOrder = response.data;

        // Ensure order has correct structure, even if API changes.
        const formattedOrder: Order = {
          ...fetchedOrder,
          line_items: Array.isArray(fetchedOrder.line_items)
            ? fetchedOrder.line_items
            : Array.isArray(fetchedOrder.items)
              ? fetchedOrder.items.map((item: any) => ({
                  product_id: item.product_id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  total: (parseFloat(item.price) * item.quantity).toFixed(2),
                  image: item.image || '/placeholder.jpg',
                }))
              : [],
          shipping: {
            ...fetchedOrder.shipping,
            country: fetchedOrder.shipping?.country || 'PL',
          },
          shipping_total: fetchedOrder.shipping_total || '0.00',
        };

        setOrder(formattedOrder);
        setPaymentStatus(fetchedOrder.status);
      } catch (err) {
        console.error('❌ Error fetching order:', err);
        setError('Nie udało się załadować zamówienia.');
      }
    };

    fetchOrderDetails();
  }, [orderId, orderKey]);

  return (
    <Layout title="Dziękujemy za zakupy!">
      {/* Cart Progress - Mark current step */}
      <div className="container mx-auto px-4 mb-16 md:px-0">
        <CartProgress />
      </div>
      {/* Hero Section */}
      <div className="grid grid-cols-10 min-h-[750px] rounded-[24px] overflow-hidden">
        {/* Left Column - 30% (Text & Background) */}
        <div className="col-span-4 bg-[#F0E0CF] flex flex-col justify-center pl-[40px]">
          <h1 className="text-[48px] font-bold text-black leading-tight">
            Dziękujemy za
            <br /> zakupy w naszym sklepie!
          </h1>
          <p className="text-[18px] mt-8 font-light text-black">
            Na podany adres e-mail wysłaliśmy potwierdzenie <br /> zakupu
            zamówienia <span className="font-bold">#{order?.id}</span>.
          </p>
        </div>
        {/* Right Column - 70% (Image Background & Overlay Box) */}
        <div
          className="col-span-6 relative bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/dziekujemy-hero.png')",
          }}
        >
          {/* Overlay Box - Positioned Bottom Left */}
          <div className="absolute bottom-0 left-0 bg-[#F0E0CF] w-[250px] h-[250px]" />
        </div>
      </div>

      {/* Order Confirmation Section */}
      <div className="container mx-auto px-4 md:px-0 py-10">
        {order && <OrderConfirmation order={order} />}

        {/* Payment Status */}
        <div className="text-center mt-6">
          <span
            className={`px-6 py-3 rounded-full text-white text-sm font-semibold ${
              paymentStatus === 'completed'
                ? 'bg-green-600'
                : paymentStatus === 'processing'
                  ? 'bg-yellow-500'
                  : paymentStatus === 'pending'
                    ? 'bg-blue-500'
                    : 'bg-red-500'
            }`}
          >
            Status: {getPolishStatus(paymentStatus)}
          </span>
        </div>

        {/* Pending Payment Message */}
        {paymentStatus === 'pending' && (
          <p className="text-center mt-4 text-blue-500 text-lg">
            ⏳ Oczekiwanie na potwierdzenie płatności... Prosimy o cierpliwość.
          </p>
        )}

        {/* "Wróć na stronę główną" Button */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="w-full px-8 py-4 bg-black text-neutral-white text-[24px] font-light rounded-full hover:bg-neutral-dark transition"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dziekujemy;
