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
  const [error, setError] = useState<string | null>(null);

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
                  total: item.total
                    ? item.total
                    : (parseFloat(item.price) * item.quantity).toFixed(2),
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
      <div className="mt-[55px] md:mt-0 container mx-auto px-4 mb-16 md:px-0">
        <CartProgress />
      </div>
      {/* Desktop Version */}
      <div className="mx-4 xl:mx-0 hidden md:grid grid-cols-10 min-h-[750px] rounded-[24px] overflow-hidden mb-10">
        {/* Left Column - 40% (Text & Background) */}
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
        {/* Right Column - 60% (Image Background & Overlay Box) */}
        <div
          className="col-span-6 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/dziekujemy-hero.png')",
          }}
        >
          {/* Overlay Box positioned at bottom left as before */}
          <div className="absolute bottom-0 left-0 bg-[#F0E0CF] w-[250px] h-[250px]" />
        </div>
      </div>

      {/* Mobile Version */}
      <div className=" block md:hidden mb-10 mx-4 rounded-[24px] overflow-hidden">
        {/* Text Section */}
        <div className="bg-[#F0E0CF] p-4">
          <h1 className="text-[36px] mt-4 font-bold text-black leading-tight">
            Dziękujemy za
            <br /> zakupy w naszym sklepie!
          </h1>
          <p className="text-[18px] pb-8 mt-4 font-light text-black">
            Na podany adres e-mail wysłaliśmy potwierdzenie <br /> zakupu
            zamówienia <span className="font-bold">#{order?.id}</span>.
          </p>
        </div>
        {/* Image Section with fixed height and overlay */}
        <div className="relative" style={{ height: '250px' }}>
          <img
            src="/images/dziekujemy-hero.png"
            alt="Dziękujemy Hero"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute top-0 left-0 bg-[#F0E0CF]"
            style={{ width: '154px', height: '154px' }}
          />
        </div>
      </div>

      {/* Order Confirmation Section */}
      <div className="container mx-auto px-4 md:px-0 py-10">
        {order && <OrderConfirmation order={order} />}
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
