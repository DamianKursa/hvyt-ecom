import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import CartProgress from '@/components/Cart/CartProgress';
import OrderConfirmation from '@/components/Cart/OrderConfirmation';
import { Order } from '@/utils/functions/interfaces';
import { CartContext } from '@/stores/CartProvider';
import { useI18n } from '@/utils/hooks/useI18n';

const Dziekujemy = () => {
  const {t} = useI18n();
  const router = useRouter();
  const { orderId, orderKey } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Import clearCart from your CartContext
  const { clearCart } = useContext(CartContext);

  // Clear the cart when the component mounts
  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
          `/api/orders/${currentOrderId}?orderKey=${currentOrderKey}&lang=${router.locale}`,
        );
        const fetchedOrder = response.data;

        const formattedOrder: Order = {
          ...fetchedOrder,
          line_items: Array.isArray(fetchedOrder.line_items)
            ? fetchedOrder.line_items
            : Array.isArray(fetchedOrder.items)
              ? fetchedOrder.items.map((item: any) => {
                const qty = item.quantity || 1;
                const originalUnitPrice = item.price;
                const originalLineTotal = parseFloat(originalUnitPrice) * qty;
                const discountedLineTotal = item.total
                  ? parseFloat(item.total)
                  : originalLineTotal;
                const discountAmount =
                  originalLineTotal - discountedLineTotal;
                return {
                  product_id: item.product_id,
                  name: item.name,
                  quantity: qty,
                  price: originalUnitPrice,
                  discount: discountAmount.toFixed(2),
                  total: discountedLineTotal.toFixed(2),
                  image: item.image || '/placeholder.jpg',
                };
              })
              : [],
          shipping: {
            ...fetchedOrder.shipping,
            country: fetchedOrder.shipping?.country || 'PL',
          },
          shipping_total: fetchedOrder.shipping_total || '0.00',
        };
console.log('formatedorder', formattedOrder);

        setOrder(formattedOrder);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Nie udało się załadować zamówienia.');
      }
    };

    fetchOrderDetails();
  }, [orderId, orderKey]);

  return (
    <Layout title={t.thankYou.pageTitle}>
      <div className="mt-[55px] md:mt-0 container mx-auto px-4 mb-16 md:px-0">
        <CartProgress />
      </div>
      <div className="mx-4 xl:mx-0 hidden md:grid grid-cols-10 min-h-[750px] rounded-[24px] overflow-hidden mb-10">
        <div className="col-span-4 bg-[#F0E0CF] flex flex-col justify-center pl-[40px]">
          <h1 className="text-[48px] font-bold text-black leading-tight">
            {t.thankYou.hero.title}
          </h1>
          <p className="text-[18px] mt-8 font-light text-black">
            {t.thankYou.hero.description} <span className="font-bold">#{order?.id}</span>.
          </p>
        </div>
        <div
          className="col-span-6 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/dziekujemy-hero.png')",
          }}
        >
          <div className="absolute bottom-0 left-0 bg-[#F0E0CF] w-[250px] h-[250px]" />
        </div>
      </div>
      <div className=" block md:hidden mb-10 mx-4 rounded-[24px] overflow-hidden">
        <div className="bg-[#F0E0CF] p-4">
          <h1 className="text-[36px] mt-4 font-bold text-black leading-tight">
            {t.thankYou.hero.title}
          </h1>
          <p className="text-[18px] pb-8 mt-4 font-light text-black">
            {t.thankYou.hero.description} <span className="font-bold">#{order?.id}</span>.
          </p>
        </div>
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
      <div className="container mx-auto px-4 md:px-0 py-10">
        {order && <OrderConfirmation order={order} />}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="w-full px-8 py-4 bg-black text-neutral-white text-[24px] font-light rounded-full hover:bg-neutral-dark transition"
          >
            {t.thankYou.backToHome}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dziekujemy;
