import React, { useEffect, useState, useRef } from 'react';

interface ShippingMethod {
  id: string;
  title: string;
  cost: string | number | null; // Handle different types of cost
  enabled: boolean;
}

interface ShippingZone {
  zoneName: string;
  methods: ShippingMethod[];
}

interface ShippingProps {
  shippingMethod: string;
  setShippingMethod: React.Dispatch<React.SetStateAction<string>>;
  setShippingPrice: React.Dispatch<React.SetStateAction<number>>;
  setShippingTitle: React.Dispatch<React.SetStateAction<string>>;
  setSelectedLocker: React.Dispatch<React.SetStateAction<string>>;
  setLockerSize: React.Dispatch<React.SetStateAction<string>>;
  cartTotal: number; // Pass the cart total to dynamically display shipping methods
  cart: any; // <-- New prop (or type it properly based on your Cart type)
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    easyPack?: {
      init: (config?: object) => void;
      modalMap?: (
        callback: (point: any, modal: any) => void,
        options?: { width?: number; height?: number },
      ) => void;
    };
  }
}

const Shipping: React.FC<ShippingProps> = ({
  shippingMethod,
  setShippingMethod,
  setShippingPrice,
  setShippingTitle,
  setSelectedLocker,
  setLockerSize,
  cartTotal,
  cart,
}) => {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLockerData, setSelectedLockerData] = useState<any>(null);
  const scriptLoadedRef = useRef(false);

  const shippingIcons: Record<string, string> = {
    'kurier gls': '/icons/GLS_Logo_2021.svg',
    'kurier inpost': '/icons/inpost-kurier.svg',
    'paczkomaty inpost': '/icons/paczkomat.png',
    'kurier gls - darmowa wysyłka': '/icons/GLS_Logo_2021.svg',
    'darmowa dostawa': '/icons/free-shipping.svg',
    'kurier gls pobranie': '/icons/GLS_Logo_2021.svg',
  };

  // Fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/shipping');
        if (!response.ok) {
          throw new Error('Failed to fetch shipping methods');
        }

        const data = await response.json();

        // Define the restricted IDs as strings.
        const restrictedIds = [
          '7543167',
          '7543168',
          '7543161',
          '7543162',
          '7535674',
          '7535675',
          '7535636',
          '7535637',
          '7535655',
          '7535679',
        ];

        // Determine if any product in the cart has a restricted productId or variationId.
        const cartContainsRestricted =
          cart &&
          cart.products &&
          cart.products.some(
            (product: any) =>
              restrictedIds.includes(String(product.productId)) ||
              (product.variationId &&
                restrictedIds.includes(String(product.variationId))),
          );

        // Process the shipping zones and methods
        const updatedZones = data.map((zone: ShippingZone) => {
          let filteredMethods = zone.methods.filter(
            (method) =>
              !method.title.toLowerCase().includes('flexible shipping') &&
              !(
                method.title.toLowerCase().includes('darmowa') &&
                cartTotal < 300
              ),
          );

          if (cartTotal >= 300) {
            filteredMethods = filteredMethods.filter((method) =>
              [
                'darmowa dostawa',
                'kurier gls - darmowa wysyłka',
                'paczkomaty inpost',
              ].includes(method.title.toLowerCase()),
            );

            if (
              !filteredMethods.some(
                (method) => method.title.toLowerCase() === 'darmowa dostawa',
              )
            ) {
              filteredMethods.push({
                id: 'free_shipping',
                title: 'Darmowa Dostawa',
                cost: null,
                enabled: true,
              });
            }
          }

          // Always add Paczkomaty InPost if it isn't already present
          if (
            !filteredMethods.some(
              (method) => method.title.toLowerCase() === 'paczkomaty inpost',
            )
          ) {
            filteredMethods.push({
              id: 'paczkomaty_inpost',
              title: 'Paczkomaty InPost',
              cost: cartTotal >= 300 ? null : 15,
              enabled: true,
            });
          }

          // If the cart contains any restricted items, filter out paczkomaty_inpost.
          if (cartContainsRestricted) {
            filteredMethods = filteredMethods.filter(
              (method) => method.id !== 'paczkomaty_inpost',
            );
          }

          console.log(
            `Updated zone (${zone.zoneName}):`,
            JSON.stringify(filteredMethods, null, 2),
          );

          return { ...zone, methods: filteredMethods };
        });

        setShippingZones(updatedZones);
      } catch (err) {
        console.error('Error fetching shipping methods:', err);
        setError('An error occurred while fetching shipping methods.');
      } finally {
        setLoading(false);
      }
    };

    fetchShippingMethods();
  }, [cart, cartTotal]);

  // Handle dynamic shipping method change
  const handleShippingChange = (method: ShippingMethod) => {
    console.log('Selected method:', method);
    setShippingMethod(method.id);
    setShippingTitle(method.title || 'Paczkomaty InPost'); // Ensure fallback
    const price = Number(method.cost) || 0;
    setShippingPrice(price);
    console.log(`Updated shipping title: ${method.title}, price: ${price}`);
  };

  useEffect(() => {
    const loadEasyPackScript = () => {
      if (!scriptLoadedRef.current) {
        scriptLoadedRef.current = true;

        const script = document.createElement('script');
        script.src =
          'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
        script.async = true;

        script.onload = () => {
          initializeEasyPack();
        };

        script.onerror = () => {
          console.error('Failed to load EasyPack script.');
        };

        document.body.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://geowidget.easypack24.net/css/easypack.css';
        document.head.appendChild(link);
      } else {
        initializeEasyPack();
      }
    };

    const initializeEasyPack = () => {
      if (window.easyPack) {
        window.easyPack.init({
          defaultLocale: 'pl',
          mapType: 'osm',
          searchType: 'osm',
          points: {
            types: ['parcel_locker'],
          },
          map: {
            initialTypes: ['parcel_locker'],
          },
        });
      }
    };

    if (shippingMethod === 'paczkomaty_inpost') {
      loadEasyPackScript();
    }
  }, [shippingMethod]);

  const openModal = () => {
    if (window.easyPack && typeof window.easyPack.modalMap === 'function') {
      window.easyPack.modalMap(
        (point: any, modal: any) => {
          modal.closeModal();
          const lockerData = {
            id: point.name,
            address: point.address.line1,
            city: point.address.city,
            postalCode: point.address.postalCode,
          };
          setSelectedLocker(point.name);
          setSelectedLockerData(lockerData);
        },
        { width: 500, height: 600 },
      );
    } else {
      console.error('EasyPack modalMap is not available.');
    }
  };

  if (loading) {
    return <p>Loading shipping methods...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-[20px] font-bold mb-6 text-neutral-darkest">
        Wybierz sposób dostawy
      </h2>
      {shippingZones.map((zone) => (
        <div key={zone.zoneName}>
          <h3 className="text-lg font-medium mb-2">{zone.zoneName}</h3>
          {zone.methods.map((method) => (
            <div key={method.id}>
              <label
                className={`grid grid-cols-3 items-center py-[16px] border-b ${
                  shippingMethod === method.id
                    ? 'border-dark-pastel-red'
                    : 'border-beige-dark'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={() => handleShippingChange(method)}
                    className="hidden"
                    disabled={loading}
                  />
                  <span
                    className={`w-5 h-5 rounded-full ${
                      shippingMethod === method.id
                        ? 'border-4 border-dark-pastel-red'
                        : 'border-2 border-gray-400'
                    }`}
                  ></span>
                  <span>{method.title}</span>
                </div>
                <span className="text-center">
                  {method.cost
                    ? `${parseFloat(String(method.cost)).toFixed(2)} zł`
                    : 'Darmowa'}
                </span>
                <img
                  src={
                    shippingIcons[method.title.toLowerCase()] ||
                    '/icons/default.svg'
                  }
                  alt={`${method.title} Icon`}
                  className="w-[55px] h-auto mx-auto"
                />
              </label>

              {method.id === 'paczkomaty_inpost' &&
                shippingMethod === 'paczkomaty_inpost' && (
                  <div>
                    <button
                      onClick={openModal}
                      className="mt-6 text-black border border-black px-4 py-2 rounded-full flex items-center text-sm"
                    >
                      Wybierz Paczkomat
                    </button>
                    {selectedLockerData && (
                      <p className="mt-2 text-sm text-gray-700">
                        Wybrany punkt: {selectedLockerData.id} -{' '}
                        {selectedLockerData.address}, {selectedLockerData.city},{' '}
                        {selectedLockerData.postalCode}
                      </p>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Shipping;
