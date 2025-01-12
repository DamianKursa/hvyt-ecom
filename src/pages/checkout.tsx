import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import CartProgress from '@/components/Cart/CartProgress';
import OrderItems from '@/components/Checkout/OrderItems';
import CartSummary from '@/components/Cart/CartSummary';
import CheckoutBillingForm from '@/components/Checkout/CheckoutBillingFrom';
import CheckoutAddressForm from '@/components/Checkout/CheckoutAdressForm';
import Shipping from '@/components/Checkout/Shipping';
import Payment from '@/components/Checkout/Payment';
import { CartContext } from '@/stores/CartProvider';
import { useUserContext } from '@/context/UserContext';

const Checkout: React.FC = () => {
  const router = useRouter();

  // States for customer type, payment, shipping methods, etc.
  const [customerType, setCustomerType] = useState<'individual' | 'company'>(
    'individual',
  );
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  const [shippingTitle, setShippingTitle] = useState<string>('');
  const [selectedLocker, setSelectedLocker] = useState<string>('');
  const [lockerSize, setLockerSize] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('przelewy24');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [subscribeNewsletter, setSubscribeNewsletter] =
    useState<boolean>(false);

  // States for billing and shipping data
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    vatNumber: '',
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
    city: '',
    postalCode: '',
    country: 'Polska',
  });

  const [shippingData, setShippingData] = useState({
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
    city: '',
    postalCode: '',
    country: 'Polska',
    additionalInfo: '',
  });

  const [isShippingDifferent, setIsShippingDifferent] = useState(false);

  const { user } = useUserContext();
  const { cart } = useContext(CartContext);

  // Redirect to cart page if cart is empty
  useEffect(() => {
    if (!cart || cart.products.length === 0) {
      router.push('/koszyk');
    }
  }, [cart, router]);

  // Fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await axios.get('/api/shipping');
        const shippingZones = response.data;

        if (shippingZones.length > 0) {
          const defaultMethod = shippingZones[0].methods[0];
          setShippingMethod(defaultMethod.id);
          setShippingPrice(Number(defaultMethod.cost) || 0);
          setShippingTitle(defaultMethod.title);
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
        alert('Nie udało się załadować metod dostawy.');
      }
    };

    fetchShippingMethods();
  }, []);

  // Handle order submission
  const handleOrderSubmit = async () => {
    if (!cart || cart.products.length === 0) {
      alert('Koszyk jest pusty!');
      return;
    }

    if (!shippingMethod) {
      alert('Wybierz metodę dostawy.');
      return;
    }

    if (!paymentMethod) {
      alert('Wybierz metodę płatności.');
      return;
    }

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title:
        paymentMethod === 'przelewy24' ? 'Przelewy24' : 'Other',
      set_paid: false,
      billing: {
        first_name: billingData.firstName,
        last_name: billingData.lastName,
        email,
        phone: billingData.phone,
        company: customerType === 'company' ? billingData.company : '',
        vat_number: customerType === 'company' ? billingData.vatNumber : '',
        address_1: `${billingData.street} ${billingData.buildingNumber}`,
        address_2: billingData.apartmentNumber || '',
        city: billingData.city,
        postcode: billingData.postalCode,
        country: billingData.country,
      },
      shipping: isShippingDifferent
        ? {
            first_name: billingData.firstName,
            last_name: billingData.lastName,
            address_1: `${shippingData.street} ${shippingData.buildingNumber}`,
            address_2: shippingData.apartmentNumber || '',
            city: shippingData.city,
            postcode: shippingData.postalCode,
            country: shippingData.country,
          }
        : {
            first_name: billingData.firstName,
            last_name: billingData.lastName,
            address_1: `${billingData.street} ${billingData.buildingNumber}`,
            address_2: billingData.apartmentNumber || '',
            city: billingData.city,
            postcode: billingData.postalCode,
            country: billingData.country,
          },
      shipping_lines: [
        {
          method_id: shippingMethod,
          method_title: shippingTitle,
          total: shippingPrice.toFixed(2),
        },
      ],
      line_items: cart.products.map((product) => ({
        product_id: product.productId,
        variation_id: product.variationId || undefined,
        quantity: product.qty,
        subtotal: product.price.toFixed(2),
        total: product.totalPrice.toFixed(2),
        meta_data: product.attributes
          ? Object.entries(product.attributes).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
      })),
      customer_note: shippingData.additionalInfo || '',
      customer_id: user?.id || undefined,
    };

    console.log('Order data to be sent to API:', orderData);

    try {
      const response = await axios.post('/api/create-order', orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const createdOrder = response.data;
      console.log('Order created successfully:', createdOrder);

      if (createdOrder.payment_url) {
        window.location.href = createdOrder.payment_url;
      } else {
        alert('Zamówienie utworzone, ale brakuje linku do płatności.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
    }
  };

  return (
    <Layout title="Hvyt | Checkout">
      <section className="container mx-auto px-4 md:px-0">
        <CartProgress />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="md:w-8/12 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark-pastel-red">
                Dane osobowe
              </h2>
              {!user && (
                <Link
                  href="/logowanie"
                  className="text-black border border-black px-4 py-2 rounded-full flex items-center text-sm"
                >
                  Masz już konto? Zaloguj się
                  <img
                    src="/icons/user.svg"
                    alt="User"
                    className="w-4 h-4 ml-2"
                  />
                </Link>
              )}
            </div>
            <CheckoutBillingForm
              customerType={customerType}
              setCustomerType={setCustomerType}
              email={email}
              setEmail={setEmail}
              setPassword={setPassword}
              subscribeNewsletter={subscribeNewsletter}
              setSubscribeNewsletter={setSubscribeNewsletter}
              user={user}
              setBillingData={setBillingData}
            />
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-dark-pastel-red">
                Adres
              </h2>
              <CheckoutAddressForm
                billingData={billingData}
                setBillingData={setBillingData}
                shippingData={shippingData}
                setShippingData={setShippingData}
                isShippingDifferent={isShippingDifferent}
                setIsShippingDifferent={setIsShippingDifferent}
              />
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-dark-pastel-red">
                Dostawa i płatność
              </h2>
              <div className="border rounded-[24px] px-[16px] py-[24px]">
                <Shipping
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  setSelectedLocker={setSelectedLocker}
                  setLockerSize={setLockerSize}
                />
                <div className="mt-8">
                  <Payment
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-4/12">
            <div className="sticky top-[80px] pt-[18px] rounded-[25px] bg-white">
              <OrderItems />
              <CartSummary
                totalProductsPrice={cart?.totalProductsPrice || 0}
                onCheckout={handleOrderSubmit}
                isCheckoutPage={true}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
