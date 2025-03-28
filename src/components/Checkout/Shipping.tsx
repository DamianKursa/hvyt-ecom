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
  cartTotal: number;
  cart: any;
  selectedGlsPoint: any;
  setSelectedGlsPoint: React.Dispatch<React.SetStateAction<any>>;
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
    SzybkaPaczkaMap?: {
      init: (config: {
        lang: string;
        country_parcelshops: string;
        el: string;
        parcel_weight: string;
        center_point: string;
        map_type: boolean;
        mapbox_key: string;
        google_maps_key: string;
        geolocation: boolean;
        parcelshop_type: string;
      }) => void;
    };
    SzybkaPaczkaParcel?: new () => {
      getParcelObject: () => any;
    };
  }
}

/**
 * Helper: Extract the GLS selection.
 * If the returned object has a nested "ParcelShop.selected" property, use that.
 * Otherwise, if it has a "selected" property, use that.
 * Else, return the object as-is.
 */
const extractSelected = (obj: any) => {
  if (!obj) return null;
  if (obj.ParcelShop && obj.ParcelShop.selected) {
    return { ...obj.ParcelShop.selected };
  }
  if (obj.selected) {
    return { ...obj.selected };
  }
  return { ...obj };
};

/**
 * Helper: Validate that the extracted object is a valid GLS selection.
 * We require that it is not the window object and that it has a nonempty "id" property.
 */
const isValidSelection = (obj: any): boolean => {
  if (!obj || obj === window) return false;
  if (typeof obj.id !== 'string' || obj.id.trim() === '') return false;
  return true;
};

/**
 * Helper: Safely retrieve a field from an object (case‑insensitive).
 */
const getField = (obj: any, field: string): string => {
  if (!obj) return '';
  return (
    obj[field] || obj[field.toLowerCase()] || obj[field.toUpperCase()] || ''
  );
};

const Shipping: React.FC<ShippingProps> = ({
  shippingMethod,
  setShippingMethod,
  setShippingPrice,
  setShippingTitle,
  setSelectedLocker,
  setLockerSize,
  cartTotal,
  cart,
  selectedGlsPoint,
  setSelectedGlsPoint,
}) => {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLockerData, setSelectedLockerData] = useState<any>(null);
  const scriptLoadedRef = useRef(false);
  // State to control GLS map visibility
  const [showGlsMap, setShowGlsMap] = useState(false);
  // Ref for the GLS map container
  const glsMapRef = useRef<HTMLDivElement>(null);

  const shippingIcons: Record<string, string> = {
    'kurier gls': '/icons/GLS_Logo_2021.svg',
    'kurier inpost': '/icons/inpost-kurier.svg',
    'paczkomaty inpost': '/icons/paczkomat.png',
    'kurier gls - darmowa wysyłka': '/icons/GLS_Logo_2021.svg',
    'darmowa dostawa': '/icons/free-shipping.svg',
    'kurier gls pobranie': '/icons/GLS_Logo_2021.svg',
    'punkty gls': '/icons/GLS_Logo_2021.svg',
  };

  // ─── FETCH SHIPPING METHODS ──────────────────────────────────────────────
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/shipping');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać metod dostawy');
        }
        const data = await response.json();
        // Define restricted IDs
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
        const cartContainsRestricted =
          cart &&
          cart.products &&
          cart.products.some(
            (product: any) =>
              restrictedIds.includes(String(product.productId)) ||
              (product.variationId &&
                restrictedIds.includes(String(product.variationId))),
          );
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
                'punkty gls', // use "Punkty GLS" option
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
          if (
            !filteredMethods.some(
              (method) => method.title.toLowerCase() === 'punkty gls',
            )
          ) {
            filteredMethods.push({
              id: 'punkty_gls',
              title: 'Punkty GLS',
              cost: cartTotal >= 300 ? null : 15,
              enabled: true,
            });
          }
          if (cartContainsRestricted) {
            filteredMethods = filteredMethods.filter(
              (method) => method.id !== 'paczkomaty_inpost',
            );
          }
          return { ...zone, methods: filteredMethods };
        });
        setShippingZones(updatedZones);
      } catch (err) {
        console.error('Błąd podczas pobierania metod dostawy:', err);
        setError(
          'Wystąpił błąd podczas ładowania metod dostawy. Ponowna próba za 5 sekund.',
        );
        setTimeout(() => {
          fetchShippingMethods();
        }, 5000);
      } finally {
        setLoading(false);
      }
    };
    fetchShippingMethods();
  }, [cart, cartTotal]);

  // ─── HANDLING SHIPPING METHOD CHANGE ──────────────────────────────────────
  const handleShippingChange = (method: ShippingMethod) => {
    setShippingMethod(method.id);
    setShippingTitle(method.title || 'Paczkomaty InPost');
    const price = Number(method.cost) || 0;
    setShippingPrice(price);
    // When switching away from "Punkty GLS", do not reinitialize the GLS map.
    if (method.id !== 'punkty_gls') {
      setShowGlsMap(false);
    }
  };

  // ─── EASYPACK (InPost) INTEGRATION ───────────────────────────────────────────
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
          console.error('Nie udało się załadować skryptu EasyPack.');
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

  const openInpostModal = () => {
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
      console.error('Funkcja modalMap EasyPack jest niedostępna.');
    }
  };

  // ─── GLS INTEGRATION: LOAD SCRIPT & INIT INLINE MAP ─────────────────────────
  useEffect(() => {
    const loadGlsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (
          document.querySelector(
            'script[src="https://mapa.gls-poland.com/js/v4.0/maps_sdk.js"]',
          )
        ) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://mapa.gls-poland.com/js/v4.0/maps_sdk.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Nie udało się załadować skryptu map GLS'));
        document.body.appendChild(script);
      });
    };

    if (showGlsMap) {
      loadGlsScript()
        .then(() => {
          if (window.SzybkaPaczkaMap && glsMapRef.current) {
            window.SzybkaPaczkaMap.init({
              lang: 'PL',
              country_parcelshops: 'PL',
              el: glsMapRef.current.id,
              parcel_weight: '5',
              center_point: 'Warszawa, Polska',
              map_type: false,
              mapbox_key: '',
              google_maps_key: '',
              geolocation: true,
              parcelshop_type: 'pudo',
            });
          } else {
            console.error('Kontener GLS nie został znaleziony.');
          }
        })
        .catch((error) => {
          console.error('Błąd ładowania skryptu map GLS:', error);
        });
    }
  }, [showGlsMap]);

  // ─── GLS INTEGRATION: POLL FOR SELECTION USING SzybkaPaczkaParcel & EVENT LISTENER ─────────
  useEffect(() => {
    let interval: number | null = null;

    if (showGlsMap && window.SzybkaPaczkaParcel) {
      const parcel = new window.SzybkaPaczkaParcel();
      interval = window.setInterval(() => {
        const result = parcel.getParcelObject();

        const extracted = extractSelected(result);

        if (isValidSelection(extracted)) {
          setSelectedGlsPoint(extracted);

          clearInterval(interval!);
          setShowGlsMap(false);
        } else {
          console.log('Polling result is not a valid selection.');
        }
      }, 200);
    }

    const handleGlsEvent = (e: any) => {
      console.log('get_parcel_shop event:', e);
      const extracted = extractSelected(e.detail) || extractSelected(e.target);
      if (isValidSelection(extracted)) {
        setSelectedGlsPoint(extracted);
        setShowGlsMap(false);
      } else {
        console.log('Event did not contain a valid selection.');
      }
    };
    window.addEventListener('get_parcel_shop', handleGlsEvent);

    return () => {
      if (interval !== null) clearInterval(interval);
      window.removeEventListener('get_parcel_shop', handleGlsEvent);
    };
  }, [showGlsMap]);

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
          {zone.methods.map((method) => (
            <div key={method.id}>
              <label
                className={`grid grid-cols-[60%_20%_20%] sm:grid-cols-3 items-center py-[16px] border-b ${
                  shippingMethod === method.id
                    ? 'border-dark-pastel-red'
                    : 'border-beige-dark'
                }`}
              >
                {/* First Column: Shipping Name */}
                <div className="flex items-center gap-4 w-full">
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
                  <span className="truncate">{method.title}</span>
                </div>

                {/* Second Column: Price */}
                <span className="text-sm text-gray-700 text-center w-full">
                  {method.cost
                    ? `${parseFloat(String(method.cost)).toFixed(2)} zł`
                    : 'Darmowa'}
                </span>

                {/* Third Column: Icon */}
                <div className="flex justify-center w-full">
                  <img
                    src={
                      shippingIcons[method.title.toLowerCase()] ||
                      '/icons/default.svg'
                    }
                    alt={`${method.title} Icon`}
                    className="w-[50px] sm:w-[55px] h-auto"
                  />
                </div>
              </label>

              {method.id === 'paczkomaty_inpost' &&
                shippingMethod === 'paczkomaty_inpost' && (
                  <div>
                    <button
                      onClick={openInpostModal}
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

              {method.id === 'punkty_gls' &&
                shippingMethod === 'punkty_gls' && (
                  <div>
                    <button
                      onClick={() => {
                        setShowGlsMap(true);
                      }}
                      className="mt-6 text-black border border-black px-4 py-2 rounded-full flex items-center text-sm"
                    >
                      {selectedGlsPoint
                        ? 'Zmień punkt GLS'
                        : 'Wybierz punkt GLS'}
                    </button>
                    {selectedGlsPoint && (
                      <p className="mt-2 text-sm text-gray-700">
                        Wybrany punkt:{' '}
                        {getField(selectedGlsPoint, 'name') || 'N/A'} –{' '}
                        {getField(selectedGlsPoint, 'street') || 'N/A'},{' '}
                        {getField(selectedGlsPoint, 'city') || 'N/A'},{' '}
                        {getField(selectedGlsPoint, 'postal_code') || 'N/A'}
                      </p>
                    )}
                    {showGlsMap && (
                      <div
                        id="gls_map"
                        ref={glsMapRef}
                        className="szybkapaczka_map mt-4"
                        style={{ width: '500px', height: '500px' }}
                      ></div>
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
