import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '@/components/Layout/Layout.component';
import CartProgress from '@/components/Cart/CartProgress';
import OrderDetails from '@/components/MojeKonto/OrderDetails';

import { Order, LineItem } from '@/utils/functions/interfaces';

const Dziekujemy = () => {
  const router = useRouter();
  const { orderId, orderKey } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Only track payment status separately
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 6; // Stop polling after 60s
  useEffect(() => {
    let currentOrderId = orderId || localStorage.getItem('recentOrderId');
    let currentOrderKey = orderKey || localStorage.getItem('recentOrderKey');

    if (!currentOrderId || !currentOrderKey) {
      setError('Nie znaleziono zamówienia.');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        console.log(`🔍 Fetching initial order details: ${currentOrderId}`);
        const response = await axios.get(
          `/api/orders/${currentOrderId}?orderKey=${currentOrderKey}`,
        );
        const fetchedOrder = response.data;

        console.log('📦 Full Order Data Received:', fetchedOrder);

        // ✅ Ensure `line_items` exists before accessing `.length`
        const formattedOrder: Order = {
          ...fetchedOrder,
          line_items:
            Array.isArray(fetchedOrder.line_items) &&
            fetchedOrder.line_items.length > 0
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
                : [], // Fallback to an empty array if `items` is also undefined
          shipping: {
            ...fetchedOrder.shipping,
            country: fetchedOrder.shipping?.country || 'PL',
          },
          shipping_total:
            fetchedOrder.shipping_total ||
            fetchedOrder.total_shipping ||
            '0.00', // ✅ Extract shipping total correctly
        };

        console.log('✅ Processed Order Data for Rendering:', formattedOrder);

        setOrder(formattedOrder);
        setPaymentStatus(fetchedOrder.status);
      } catch (err) {
        console.error('❌ Error fetching order:', err);
        setError('Nie udało się załadować zamówienia.');
      }
    };

    fetchOrderDetails();
  }, [orderId, orderKey]);

  // ✅ Poll payment status separately (only updates payment status)
  const pollPaymentStatus = async (
    orderId: string | string[],
    orderKey: string | string[],
  ) => {
    let attempt = 0;

    const interval = setInterval(async () => {
      if (attempt >= MAX_ATTEMPTS) {
        console.warn('⚠️ Max polling attempts reached. Stopping.');
        clearInterval(interval);
        return;
      }

      try {
        console.log(`🔍 Checking payment status: ${orderId}`);
        const response = await axios.get(
          `/api/orders/${orderId}?orderKey=${orderKey}`,
        );
        const updatedOrder = response.data;

        console.log(
          `✅ Payment status received: ${updatedOrder.id}, Status: ${updatedOrder.status}`,
        );

        // ✅ Update only payment status
        setPaymentStatus(updatedOrder.status);

        // ✅ Stop polling if payment is confirmed
        if (['completed', 'processing'].includes(updatedOrder.status)) {
          console.log('✅ Payment confirmed, stopping polling.');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('❌ Error checking payment status:', err);
        clearInterval(interval);
      }

      attempt++;
    }, 10000); // ✅ Poll every 5 seconds
  };

  return (
    <Layout title="Dziękujemy za zakupy!">
      <div className="container mx-auto px-4 md:px-0 py-10">
        {/* ✅ Progress Bar */}
        <CartProgress />

        <div className="bg-white shadow-md rounded-lg p-6 text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-pastel-red">
            Dziękujemy za zakupy w naszym sklepie!
          </h1>
          <p className="text-gray-600 mt-2">
            Na podany adres e-mail wysłaliśmy potwierdzenie zakupu zamówienia{' '}
            <strong>#{order?.id}</strong>.
          </p>
        </div>

        {/* ✅ Order Details Component (Shows full order immediately) */}
        {order && <OrderDetails order={order} />}

        {/* ✅ Payment Status Message (Only this updates dynamically) */}
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
            Status: {paymentStatus?.toUpperCase()}
          </span>
        </div>

        {/* ✅ Show pending message if payment is still being processed */}
        {paymentStatus === 'pending' && (
          <p className="text-center mt-4 text-blue-500 text-lg">
            ⏳ Oczekiwanie na potwierdzenie płatności... Prosimy o cierpliwość.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Dziekujemy;
