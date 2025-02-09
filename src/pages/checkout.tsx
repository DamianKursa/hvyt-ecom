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

  const [customerType, setCustomerType] = useState<'individual' | 'company'>(
    'individual',
  );
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  const [shippingTitle, setShippingTitle] = useState<string>('');
  const [selectedLocker, setSelectedLocker] = useState<string>('');
  const [lockerSize, setLockerSize] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('przelewy24');
  const [email, setEmail] = useState<string>('');
  const [subscribeNewsletter, setSubscribeNewsletter] =
    useState<boolean>(false);

  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false); // <-- Added state for checkbox

  const [selectedGlsPoint, setSelectedGlsPoint] = useState<any>(null);

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

  // Map country name to country code
  const mapCountry = (country: string): string => {
    const countryMapping: Record<string, string> = {
      Polska: 'PL',
    };
    return countryMapping[country] || country;
  };

  // Redirect to cart if cart is empty
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

  // Update shipping title dynamically when shipping method changes
  useEffect(() => {
    const fetchShippingTitle = async () => {
      try {
        const response = await axios.get('/api/shipping');
        const shippingZones = response.data;

        const selectedMethod = shippingZones
          .flatMap((zone: any) => zone.methods)
          .find((method: any) => method.id === shippingMethod);

        if (selectedMethod) {
          setShippingTitle(selectedMethod.title); // Update title
          setShippingPrice(Number(selectedMethod.cost) || 0); // Update price
        }
      } catch (error) {
        console.error('Error updating shipping title:', error);
      }
    };

    if (shippingMethod) fetchShippingTitle();
  }, [shippingMethod]);

  // Handle order submission
  const handleOrderSubmit = async () => {
    if (!isTermsChecked) {
      alert(
        '*Potwierdzam, że zapoznałam/em się z treścią Regulaminu i Polityki Prywatności oraz akceptuję ich postanowienia.',
      );
      return;
    }

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

    // Map countries to codes before submitting
    const mappedBillingCountry = mapCountry(billingData.country);
    const mappedShippingCountry = mapCountry(shippingData.country);

    // Use appropriate address based on "Dostawa pod inny adres"
    const shippingAddress = isShippingDifferent
      ? {
          first_name: billingData.firstName,
          last_name: billingData.lastName,
          address_1: `${shippingData.street} ${shippingData.buildingNumber}`,
          address_2: shippingData.apartmentNumber || '',
          city: shippingData.city,
          postcode: shippingData.postalCode,
          country: mappedShippingCountry,
        }
      : {
          first_name: billingData.firstName,
          last_name: billingData.lastName,
          address_1: `${billingData.street} ${billingData.buildingNumber}`,
          address_2: billingData.apartmentNumber || '',
          city: billingData.city,
          postcode: billingData.postalCode,
          country: mappedBillingCountry,
        };

    const shippingMetaData = [];
    if (shippingMethod === 'paczkomaty_inpost') {
      shippingMetaData.push(
        { key: '_integration', value: 'paczkomaty' },
        { key: '_paczkomat_id', value: selectedLocker },
        { key: '_paczkomat_size', value: lockerSize || 'A' },
        { key: 'delivery_point_address', value: shippingData.street },
        { key: 'delivery_point_id', value: selectedLocker },
        {
          key: 'delivery_point_name',
          value: `${selectedLocker}, ${shippingData.street}, ${shippingData.postalCode} ${shippingData.city}`,
        },

        { key: 'delivery_point_postcode', value: shippingData.postalCode },
        { key: 'delivery_point_city', value: shippingData.city },
      );
    }
    if (shippingMethod === 'punkty_gls') {
      shippingMetaData.push(
        { key: '_integration', value: 'gls' },
        {
          key: '_parcel_shop_id',
          value: selectedGlsPoint ? selectedGlsPoint.id : '',
        },
        {
          key: '_parcel_shop_name',
          value: selectedGlsPoint ? selectedGlsPoint.name : '',
        },
        {
          key: '_parcel_shop_address',
          value: selectedGlsPoint ? selectedGlsPoint.street : '',
        },
        {
          key: 'delivery_point_city',
          value: selectedGlsPoint ? selectedGlsPoint.city : '',
        },
        {
          key: 'delivery_point_postcode',
          value: selectedGlsPoint ? selectedGlsPoint.postal_code : '',
        },
      );
    }
    const orderData = {
      payment_method: paymentMethod,
      payment_method_title:
        paymentMethod === 'przelewy24' ? 'Przelewy24' : shippingTitle,
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
        country: mappedBillingCountry,
      },
      shipping: shippingAddress,
      shipping_lines: [
        {
          method_id: shippingMethod,
          method_title: shippingTitle || 'Paczkomaty InPost',
          total: (!isNaN(shippingPrice) ? shippingPrice : 0).toFixed(2),
          meta_data: shippingMetaData,
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
      customer_id: user?.id || undefined, // `undefined` for guests
    };

    console.log('📦 Sending Order Data to API:', orderData);

    try {
      const response = await axios.post('/api/create-order', orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const createdOrder = response.data;
      console.log('✅ Order created successfully:', createdOrder);

      if (createdOrder.id && createdOrder.order_key) {
        // Save order ID & order key for guests
        localStorage.setItem('recentOrderId', createdOrder.id.toString());
        localStorage.setItem('recentOrderKey', createdOrder.order_key);

        // Redirect to Thank You page
        router.push(
          `/dziekujemy?orderId=${createdOrder.id}&orderKey=${createdOrder.order_key}`,
        );
      } else {
        alert('Zamówienie utworzone, ale brakuje identyfikatora zamówienia.');
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
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
              setPassword={setPassword}
              customerType={customerType}
              setCustomerType={setCustomerType}
              email={email}
              setEmail={setEmail}
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
                  setShippingPrice={setShippingPrice}
                  setShippingTitle={setShippingTitle}
                  setSelectedLocker={setSelectedLocker}
                  setLockerSize={setLockerSize}
                  cartTotal={cart?.totalProductsPrice || 0}
                  cart={cart}
                  selectedGlsPoint={selectedGlsPoint}
                  setSelectedGlsPoint={setSelectedGlsPoint}
                />

                <div className="mt-8">
                  <Payment
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    shippingMethod={shippingMethod}
                  />
                  {/* Terms and Privacy Checkbox */}
                  <div className="mt-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isTermsChecked}
                        onChange={() => setIsTermsChecked((prev) => !prev)}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 flex items-center justify-center border rounded ${
                          isTermsChecked
                            ? 'bg-black text-white'
                            : 'border-black'
                        }`}
                      >
                        {isTermsChecked && (
                          <img src="/icons/check.svg" alt="check" />
                        )}
                      </span>
                      <span>
                        *Potwierdzam, że zapoznałam/em się z treścią{' '}
                        <Link className="underline " href="/regulamin">
                          Regulaminu
                        </Link>{' '}
                        i{' '}
                        <Link
                          className="underline "
                          href="/polityka-prywatnosci"
                        >
                          Polityki Prywatności
                        </Link>
                        oraz akceptuję ich postanowienia.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-4/12">
            <div className="sticky top-[80px] pt-[18px] rounded-[25px] bg-white">
              <OrderItems />
              <CartSummary
                shippingPrice={shippingPrice}
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
