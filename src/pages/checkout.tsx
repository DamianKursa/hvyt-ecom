import { v4 as uuidv4 } from 'uuid';
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
import { ExternalIdContext } from '@/context/ExternalIdContext';
import { useUserContext } from '@/context/UserContext';
import { pushGTMEvent } from '@/utils/gtm';
import CreateAccount from '@/components/UI/CreateAccount';

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
  // Updated default to new payment method ID
  const [paymentMethod, setPaymentMethod] = useState<string>(
    'p24-online-payments',
  );
  const [email, setEmail] = useState<string>('');
  const [subscribeNewsletter, setSubscribeNewsletter] =
    useState<boolean>(false);

  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [orderDisabled, setOrderDisabled] = useState(false);
  const [selectedGlsPoint, setSelectedGlsPoint] = useState<any>(null);
  const [createAccount, setCreateAccount] = useState<boolean>(false);
  const [saveAddress, setSaveAddress] = useState<boolean>(false);

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
  const externalAnonId = useContext(ExternalIdContext);
  const { user } = useUserContext();
  const { cart } = useContext(CartContext);

  const mapCountry = (country: string): string => {
    const countryMapping: Record<string, string> = { Polska: 'PL' };
    return countryMapping[country] || country;
  };

  useEffect(() => {
    if (!cart || cart.products.length === 0) {
      router.push('/koszyk');
    }
  }, [cart, router]);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await axios.get('/api/shipping');
        const shippingZones = response.data;

        if (shippingZones.length > 0) {
          const defaultMethod = shippingZones[0].methods[0];
          setShippingMethod(defaultMethod.id);
          // Calculate cart total for free shipping check
          const currentCartTotal = cart?.products?.reduce((sum: number, product: any) => {
            return sum + ((product.price || 0) * (product.qty || 1));
          }, 0) || 0;
          // Free shipping for orders >= 300 zł (non-COD methods)
          const isFreeShipping = currentCartTotal >= 300 && !defaultMethod.title?.toLowerCase().includes('pobranie');
          setShippingPrice(isFreeShipping ? 0 : (Number(defaultMethod.cost) || 0));
          setShippingTitle(defaultMethod.title);
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
        alert('Nie udało się załadować metod dostawy.');
      }
    };

    fetchShippingMethods();
  }, [cart]);

  useEffect(() => {
    const fetchShippingTitle = async () => {
      try {
        const response = await axios.get('/api/shipping');
        const shippingZones = response.data;

        const selectedMethod = shippingZones
          .flatMap((zone: any) => zone.methods)
          .find((method: any) => method.id === shippingMethod);

        if (selectedMethod) {
          setShippingTitle(selectedMethod.title);
          // Calculate cart total for free shipping check
          const currentCartTotal = cart?.products?.reduce((sum: number, product: any) => {
            return sum + ((product.price || 0) * (product.qty || 1));
          }, 0) || 0;
          // Free shipping for orders >= 300 zł (non-COD methods)
          const isFreeShipping = currentCartTotal >= 300 && !selectedMethod.title?.toLowerCase().includes('pobranie');
          setShippingPrice(isFreeShipping ? 0 : (Number(selectedMethod.cost) || 0));
        }
      } catch (error) {
        console.error('Error updating shipping title:', error);
      }
    };

    if (shippingMethod) fetchShippingTitle();
  }, [shippingMethod, cart]);

  useEffect(() => {
    if (cart && cart.products && cart.products.length > 0) {
      pushGTMEvent('begin_checkout', {
        items: cart.products.map((product) => ({
          item_id: product.productId,
          item_name: product.name,
          price: product.price,
          quantity: product.qty,
        })),
        value: cart.totalProductsPrice,
      });
    }
  }, [cart]);

  const handleOrderSubmit = async () => {
    setOrderDisabled(true);
    setTimeout(() => setOrderDisabled(false), 10000);

    if (!isTermsChecked) {
      alert(
        '*Potwierdzam, że zapoznałam/em się z treścią Regulaminu i Polityki Prywatności oraz akceptuję ich postanowienia.',
      );
      setOrderDisabled(false);
      throw new Error('Validation error');
    }
    if (shippingMethod === 'paczkomaty_inpost' && !selectedLocker) {
      alert('Wybierz paczkomat przed złożeniem zamówienia.');
      setOrderDisabled(false);
      throw new Error('Validation error');
    }

    if (shippingMethod === 'punkty_gls' && !selectedGlsPoint) {
      alert('Wybierz punkt GLS przed złożeniem zamówienia.');
      setOrderDisabled(false);
      throw new Error('Validation error');
    }
    if (!cart || cart.products.length === 0) {
      alert('Koszyk jest pusty!');
      setOrderDisabled(false);
      throw new Error('Validation error');
    }

    if (!shippingMethod) {
      alert('Wybierz metodę dostawy.');
      setOrderDisabled(false);
      throw new Error('Validation error');
    }

    if (!paymentMethod) {
      alert('Wybierz metodę płatności.');
      setOrderDisabled(false);
      throw new Error('Validation error');
    }

    const missingFields = [];

    if (!billingData.firstName) missingFields.push('Imię');
    if (!billingData.lastName) missingFields.push('Nazwisko');
    if (!billingData.phone) missingFields.push('Numer telefonu');
    if (!email) missingFields.push('Adres e-mail');
    if (!billingData.street) missingFields.push('Nazwa ulicy');
    if (!billingData.buildingNumber) missingFields.push('Numer budynku');
    if (!billingData.city) missingFields.push('Miasto');
    if (!billingData.postalCode) missingFields.push('Kod pocztowy');

    if (missingFields.length > 0) {
      alert(
        `Proszę uzupełnić wymagane pola: ${missingFields
          .map((field) => `\n• ${field}`)
          .join('')}`,
      );
      setOrderDisabled(false);
      throw new Error('Validation error');
    }

    // If user is not logged in and the "create account" checkbox is ticked, register the user first.
    if (!user && createAccount) {
      if (!password || password.length < 8) {
        // Invalid or missing password – skip account creation quietly
        console.log('Skipped account creation: password too short or missing');
      } else {
        try {
          await axios.post('/api/auth/register', {
            first_name: billingData.firstName,
            last_name: billingData.lastName,
            email,
            password,
          });
          console.log('Account created successfully');
        } catch (err) {
          // Log only—do not interrupt checkout flow
          console.error('Account creation failed:', err);
        }
      }
    }
    // Map country names to codes
    const mappedBillingCountry = mapCountry(billingData.country);
    const mappedShippingCountry = mapCountry(shippingData.country);

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

    // Prepare shipping meta data (if any)
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
        paymentMethod === 'pay_by_paynow_pl_pbl'
          ? 'paynow.pl - Online payments'
          : paymentMethod === 'przelewy24' ||
            paymentMethod === 'p24-online-payments'
            ? 'Przelewy24'
            : shippingTitle,
      set_paid: false,
      billing: {
        first_name: billingData.firstName,
        last_name: billingData.lastName,
        email,
        phone: billingData.phone,
        company: customerType === 'company' ? billingData.company : '',
        billing_nip: customerType === 'company' ? billingData.vatNumber : '',
        address_1: `${billingData.street} ${billingData.buildingNumber}`,
        address_2: billingData.apartmentNumber || '',
        city: billingData.city,
        postcode: billingData.postalCode,
        country: mappedBillingCountry,
      },
      meta_data: [
        {
          key: 'billing_nip',
          value: customerType === 'company' ? billingData.vatNumber : '',
        },
      ],
      coupon_lines:
        Array.isArray((cart as any)?.applied_coupons || (cart as any)?.appliedCoupons)
          ? ((cart as any).applied_coupons || (cart as any).appliedCoupons).map((c: any) => {
            const code = typeof c === 'string' ? c : c?.code;
            const discountValue = typeof c === 'object' ? Number(c?.discountValue) : NaN;
            const line: any = { code: String(code) };
            // Only send discount fields when an actual positive discount exists
            if (!isNaN(discountValue) && discountValue > 0) {
              line.discount = discountValue.toFixed(2);
              line.discount_tax = '0.00';
            }
            return line;
          })
          : (cart as any)?.coupon && (cart as any)?.coupon.code
            ? (() => {
              const code = String((cart as any).coupon.code);
              const discountValue = Number(((cart as any).coupon as any).discountValue);
              const line: any = { code };
              // For free-shipping only coupons (e.g., 'comeback') discount may be 0/undefined → send only the code
              if (!isNaN(discountValue) && discountValue > 0) {
                line.discount = discountValue.toFixed(2);
                line.discount_tax = '0.00';
              }
              return [line];
            })()
            : [],

      shipping: shippingAddress,
      shipping_lines: [
        {
          method_id: shippingMethod,
          method_title: shippingTitle || 'Paczkomaty InPost',
          total: (!isNaN(shippingPrice) ? shippingPrice : 0).toFixed(2),
          meta_data: shippingMetaData,
        },
      ],
      line_items: cart.products.map((product) => {
        const lineTotal = (product.price * product.qty).toFixed(2);
        return {
          product_id: product.productId,
          variation_id: product.variationId || undefined,
          quantity: product.qty,
          subtotal: lineTotal,
          total: lineTotal,
          meta_data: product.attributes
            ? Object.entries(product.attributes).map(([key, value]) => ({
              key,
              value,
            }))
            : [],
        };
      }),
      customer_note: shippingData.additionalInfo || '',
      customer_id: user?.id || undefined,
    };

    pushGTMEvent('add_shipping_info', {
      shipping_method: shippingMethod,
      shipping_cost: shippingPrice,
      shipping_address: {
        city: shippingAddress.city,
        country: shippingAddress.country,
        postcode: shippingAddress.postcode,
      },
    });
    pushGTMEvent('add_payment_info', {
      payment_method: paymentMethod,
      // Optionally, include additional details such as payment type or billing info
    });

    try {
      const response = await axios.post('/api/create-order', orderData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const createdOrder = response.data;

      // ── Fire‑and‑forget address save (never blocks checkout) ───────────────
      if (user && saveAddress) {
        const addressToSave = isShippingDifferent ? shippingData : billingData;

        axios
          .post(
            '/api/moje-konto/adresy',
            {
              action: 'add',
              address: addressToSave,
            },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true, // send auth cookies
            },
          )
          .then(() => {
            console.log('Address saved to account');
          })
          .catch((err) => {
            // Log error for Vercel diagnostics, but NEVER block the order flow
            console.error('Error saving address:', err);
          });
      }
      // ── end fire‑and‑forget address save ───────────────────────────────────

      pushGTMEvent('purchase', {
        transaction_id: createdOrder.id,
        value: cart.totalProductsPrice,
        currency: 'PLN', // Adjust as needed
        items: cart.products.map((product) => ({
          item_id: product.productId,
          item_name: product.name,
          price: product.price,
          quantity: product.qty,
        })),
      });

      const purchaseEventId = createdOrder.id.toString();

      // PIXEL → browser
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq(
          'track',
          'Purchase',
          {
            value: cart.totalProductsPrice,
            currency: 'PLN',
            content_ids: cart.products.map((p) => p.productId),
            contents: cart.products.map((p) => ({
              id: p.productId,
              quantity: p.qty,
            })),
          },
          { eventID: purchaseEventId },
        );
      }

      // ── Your updated CAPI block ────────────────────────────
      {
        const fbp = document.cookie.match(/_fbp=([^;]+)/)?.[1];
        const fbc = document.cookie.match(/_fbc=([^;]+)/)?.[1];
        const fbLoginId = (window as any).fb_login_id;

        // use real user.id if available, otherwise your one‐and‐only anon ID
        const externalId = user?.id || externalAnonId || uuidv4();

        const userData = {
          fb_login_id: fbLoginId,
          fbp,
          fbc,
          external_id: externalId,
          fn: billingData.firstName,
          ln: billingData.lastName,
          phone: billingData.phone,
          zip: billingData.postalCode,
          ct: billingData.city,
          email, // optional
        };

        await fetch('/api/fb-capi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'Purchase',
            eventId: purchaseEventId,
            customData: {
              value: cart.totalProductsPrice,
              currency: 'PLN',
              content_ids: cart.products.map((p) => p.productId),
              contents: cart.products.map((p) => ({
                id: p.productId,
                quantity: p.qty,
              })),
            },
            userData, // ← your full object here
          }),
        })
          .then(async (res) => {
            const json = await res.json();
            if (!res.ok) console.error('🚨 CAPI error:', json);
            else console.log('✅ CAPI success:', json);
          })
          .catch((err) => console.error('❌ CAPI network error:', err));
      }
      // ── end CAPI block ────────────────────────────────────

      // ── end Facebook Purchase tracking ────────────────────────────
      const pinterestPayload = {
        eventName: 'purchase',
        items: cart.products.map((p) => ({
          item_id: p.productId,
          item_name: p.name,
          price: p.price,
          quantity: p.qty,
        })),
        value: cart.totalProductsPrice,
        currency: 'PLN',
        order_id: createdOrder.id.toString(),
        click_id: document.cookie.match(/_epik=([^;]+)/)?.[1] || '',
        firstName: billingData.firstName,
        lastName: billingData.lastName,
        phone: billingData.phone,
        postalCode: billingData.postalCode,
        city: billingData.city,
        country: mapCountry(billingData.country),
      };

      // fire-and-forget so it won’t block the redirect
      const blob = new Blob([JSON.stringify(pinterestPayload)], {
        type: 'application/json',
      });
      navigator.sendBeacon('/api/pinterest-capi', blob);

      localStorage.setItem('recentOrderId', createdOrder.id.toString());
      localStorage.setItem('recentOrderKey', createdOrder.order_key);

      if (
        (paymentMethod === 'przelewy24' ||
          paymentMethod === 'p24-online-payments' ||
          paymentMethod === 'pay_by_paynow_pl_pbl') &&
        createdOrder.payment_url
      ) {
        router.push(createdOrder.payment_url);
      } else if (createdOrder.id && createdOrder.order_key) {
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
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-dark-pastel-red">
                Dane osobowe
              </h2>
              {!user && (
                <Link
                  href={`/logowanie?redirect=${encodeURIComponent(router.asPath)}`}
                  className="text-black underline md:border md:border-black md:px-4 md:py-2 rounded-full flex items-center text-sm mt-0 mb-4 md:mb-0 md:mt-0"
                >
                  Masz już konto? Zaloguj się
                  <img
                    src="/icons/user.svg"
                    alt="User"
                    className="w-4 h-4 md:ml-2"
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
            {!user && (
              <>
                {/* Create account opt‑in */}
                <div className="mt-6">
                  <label className="flex items-center gap-3 text-sm cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={() => setCreateAccount((prev) => !prev)}
                      className="hidden"
                    />
                    <span
                      className={`w-5 h-5 flex items-center justify-center border rounded ${createAccount ? 'bg-black text-white' : 'border-black'
                        }`}
                    >
                      {createAccount && (
                        <img src="/icons/check.svg" alt="check" className="w-4 h-4" />
                      )}
                    </span>
                    <span className="text-sm leading-tight w-full">
                      Stwórz konto
                    </span>
                  </label>
                </div>

                {/* Password field (re‑uses existing component) */}
                {createAccount && (
                  <CreateAccount onSave={({ password }) => setPassword(password)} />
                )}
              </>
            )}
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
                saveAddress={saveAddress}
                setSaveAddress={setSaveAddress}
                user={user}
              />
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-dark-pastel-red">
                Dostawa i płatność
              </h2>
              <div className="border-[#DAD3C8] md:border  rounded-[24px] px-0 md:px-[16px] py-[24px]">
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
                    <label className="flex items-center gap-3 text-sm cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={isTermsChecked}
                        onChange={() => setIsTermsChecked((prev) => !prev)}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 flex items-center justify-center border rounded ${isTermsChecked
                          ? 'bg-black text-white'
                          : 'border-black'
                          }`}
                      >
                        {isTermsChecked && (
                          <img
                            src="/icons/check.svg"
                            alt="check"
                            className="w-4 h-4"
                          />
                        )}
                      </span>
                      <span className="text-sm leading-tight w-full">
                        <span className='text-red-500'>*</span>Potwierdzam, że zapoznałam/em się z treścią{' '}
                        <Link className="underline" href="/regulamin">
                          Regulaminu
                        </Link>{' '}
                        i{' '}
                        <Link
                          className="underline"
                          href="/polityka-prywatnosci"
                        >
                          Polityki Prywatności
                        </Link>{' '}
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
                disabled={orderDisabled || !shippingMethod}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;