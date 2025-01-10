import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ThankYou = () => {
  const router = useRouter();
  const { orderId } = router.query; // Order ID passed as a query parameter
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrderStatus = async () => {
        try {
          const response = await axios.get(
            `${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`, // Replace with proper token handling
              },
            },
          );

          const order = response.data;
          setOrderStatus(order.status);

          if (order.status === 'completed') {
            alert('Payment successful! Thank you for your order.');
          } else if (order.status === 'pending') {
            alert(
              'Payment is still pending. Please check your email for updates.',
            );
          } else {
            alert('Payment failed. Please try again.');
          }
        } catch (error) {
          console.error('Error fetching order status:', error);
        }
      };

      fetchOrderStatus();
    }
  }, [orderId]);

  return (
    <div>
      <h1>Thank You</h1>
      {orderStatus && <p>Your order status is: {orderStatus}</p>}
    </div>
  );
};

export default ThankYou;
