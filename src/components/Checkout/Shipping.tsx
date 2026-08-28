import { getCurrency, Language } from '@/utils/i18n/config';
import React, { useEffect, useState, useRef, Key } from 'react';
import { useI18n } from '@/utils/hooks/useI18n';
import { ShippingMethod } from '@/types/checkout';
import { getCurrencySlugByLocale } from '@/config/currencies';
import {
  getShippingClassesFromCart,
  type CartShippingClassRef,
  resolveShippingMethodCost,
} from '@/utils/shippingCost';
import {
  isPaczkomatyMethod,
  isPunktyGlsMethod,
  placePaczkomatyFirst,
} from '@/utils/shippingMethods';

interface ShippingZone {
  zoneId: number;
  zoneName: string;
  methods: ShippingMethod[];
}

interface ShippingProps {
  shippingMethod: ShippingMethod;
  setShippingMethod: React.Dispatch<React.SetStateAction<ShippingMethod>>;
  setShippingPrice: React.Dispatch<React.SetStateAction<number>>;
  setShippingTitle: React.Dispatch<React.SetStateAction<string>>;
  setSelectedLocker: React.Dispatch<React.SetStateAction<string>>;
  setLockerSize: React.Dispatch<React.SetStateAction<string>>;
  cartTotal: number;
  cart: any;
  selectedGlsPoint: any;
  setSelectedGlsPoint: React.Dispatch<React.SetStateAction<any>>;
  selectedZone: number;
  shippingContextReady: boolean;
  isDeliveryCountrySelected: boolean;
  onCostsReadyChange?: (ready: boolean) => void;
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    easyPackAsyncInit?: () => void;
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
    SzybkaPaczkaParcel?: new () => { getParcelObject: () => any };
  }
}

const EASYPACK_SCRIPT_SRC =
  'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
const EASYPACK_STYLE_HREF =
  'https://geowidget.easypack24.net/css/easypack.css';
const EASYPACK_CONFIG = {
  defaultLocale: 'pl',
  mapType: 'osm',
  searchType: 'osm',
  points: { types: ['parcel_locker'] },
  map: { initialTypes: ['parcel_locker'] },
};

let easyPackInitialized = false;
const easyPackReadyListeners = new Set<() => void>();

const isEasyPackReady = () =>
  easyPackInitialized && typeof window.easyPack?.modalMap === 'function';

const notifyEasyPackReady = () => {
  easyPackReadyListeners.forEach((listener) => listener());
  easyPackReadyListeners.clear();
};

const initEasyPackOnce = () => {
  if (!window.easyPack) return;
  if (!easyPackInitialized) {
    window.easyPack.init(EASYPACK_CONFIG);
    easyPackInitialized = true;
  }
  notifyEasyPackReady();
};

const ensureEasyPack = () => {
  if (typeof window === 'undefined') return;

  // Official SDK hook — fires when the widget is actually ready (not just script.onload).
  window.easyPackAsyncInit = initEasyPackOnce;

  if (window.easyPack) {
    initEasyPackOnce();
    return;
  }

  if (!document.querySelector(`link[href="${EASYPACK_STYLE_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = EASYPACK_STYLE_HREF;
    document.head.appendChild(link);
  }

  if (!document.querySelector(`script[src="${EASYPACK_SCRIPT_SRC}"]`)) {
    const script = document.createElement('script');
    script.src = EASYPACK_SCRIPT_SRC;
    script.async = true;
    script.onload = () => initEasyPackOnce();
    script.onerror = () => {
      console.error('Nie udało się załadować skryptu EasyPack.');
    };
    document.body.appendChild(script);
  }
};

const whenEasyPackReady = (callback: () => void) => {
  if (isEasyPackReady()) {
    callback();
    return;
  }
  easyPackReadyListeners.add(callback);
  ensureEasyPack();
};

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

/**
 * Helper: Check if a specific coupon code is applied in the cart or client context.
 */
const hasCoupon = (cart: any, code: string): boolean => {
  const target = code.toLowerCase().trim();
  const pools: any[] = [];
  if (Array.isArray(cart?.coupons)) pools.push(...cart.coupons);
  if (Array.isArray(cart?.appliedCoupons)) pools.push(...cart.appliedCoupons);
  if (Array.isArray(cart?.applied_coupons)) pools.push(...cart.applied_coupons);
  if (Array.isArray(cart?.couponLines)) pools.push(...cart.couponLines);

  // CartContext often keeps a single coupon object/string
  const single = cart?.coupon;
  if (single) {
    const s = typeof single === 'string' ? single : (single.code || single.coupon_code || '');
    if (typeof s === 'string' && s.toLowerCase().trim() === target) return true;
  }

  const fromCart = pools.some((c: any) => {
    if (typeof c === 'string') return c.toLowerCase().trim() === target;
    if (typeof c?.code === 'string') return c.code.toLowerCase().trim() === target;
    if (typeof c?.coupon_code === 'string') return c.coupon_code.toLowerCase().trim() === target;
    return false;
  });
  if (fromCart) return true;
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCoupon = (params.get('coupon') || params.get('discount') || '').toLowerCase().trim();
      if (urlCoupon === target) return true;
      const lsKeys = ['coupon', 'coupon_code', 'appliedCoupon', 'appliedCoupons', 'applied_coupons'];
      for (const k of lsKeys) {
        const v = (window.localStorage?.getItem(k) || window.sessionStorage?.getItem(k) || '').toLowerCase();
        if (!v) continue;
        if (v === target) return true;
        if (v.includes(',')) {
          const parts = v.split(',').map((s) => s.trim());
          if (parts.includes(target)) return true;
        }
      }
      const cookie = document.cookie?.toLowerCase() || '';
      if (cookie.includes(`coupon=${target}`) || cookie.includes(`coupon_code=${target}`) || cookie.includes(`applied_coupons=${target}`)) {
        return true;
      }
    }
  } catch (e) {
    // Access to window/sessionStorage/cookies can fail (SSR, privacy settings). Intentionally ignore and fall back to no coupon found.
    void e;
  }
  return false;
};

// ZADBANO SHIPPING METHODS IDS (synchronizacja z Woocommerce)
/*
  14 - Zadbano
  22 - Zadbano z wniesieniem
*/
const ZADBANO_SHIPPING_METHODS_IDS = [14, 22];

// SHIPPING METHODS WITHOUT FREE SHIPPING (synchronizacja z Woocommerce)
/*
  3 - GLS Pobranie
*/
const NON_FREE_SHIPPING_METHODS_IDS = [3];

// FREE SHIPPING LIMITS
const FREE_SHIPPING_LIMITS:Record<string, number> = {
  PLN: 300,
  EUR: 70,
};

// const EMMA_ZADBANO_PRODUCT_IDS = new Set([
//   '7563916',
//   '7564076',
//   '7564079',
// ]);

// const buildZadbanoMethods = (): ShippingMethod[] => [
//   {
//     id: 'zadbano_bez_wniesienia',
//     method_id: 'free_shipping',
//     title: 'Zadbano (bez wniesienia)',
//     cost: 0,
//     enabled: true,
//   },
//   {
//     id: 'zadbano_z_wniesieniem',
//     method_id: 'flat_rate',
//     title: 'Zadbano z wniesieniem',
//     cost: 99,
//     enabled: true,
//   },
// ];

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
  selectedZone,
  shippingContextReady,
  isDeliveryCountrySelected,
  onCostsReadyChange,
}) => {
  const { t, language } = useI18n();
  const [cartShippingClasses, setCartShippingClasses] = useState<CartShippingClassRef[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [costsReady, setCostsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLockerData, setSelectedLockerData] = useState<any>(null);
  // State to control GLS map visibility
  const [showGlsMap, setShowGlsMap] = useState(false);
  const glsMapRef = useRef<HTMLDivElement>(null);
  const requestFlightRef = useRef(0);
  const shippingMethodRef = useRef(shippingMethod);
  shippingMethodRef.current = shippingMethod;

  const shippingIcons: Record<string, string> = {
    'kurier gls': '/icons/GLS_Logo_2021.svg',
    'kurier inpost': '/icons/inpost-kurier.svg',
    'paczkomaty inpost': '/icons/paczkomat.png',
    'paczkomaty 24/7 inpost': '/icons/paczkomat.png',
    'kurier gls - darmowa wysyłka': '/icons/GLS_Logo_2021.svg',
    'darmowa dostawa': '/icons/free-shipping.svg',
    'kurier gls pobranie': '/icons/GLS_Logo_2021.svg',
    'punkty gls': '/icons/GLS_Logo_2021.svg',
    'zadbano (bez wniesienia)': '/icons/truck.svg',
    'zadbano z wniesieniem': '/icons/truck.svg',
    'kurier gls (zagranica)': '/icons/GLS_Logo_2021.svg',
  };

  const currency_slug = getCurrencySlugByLocale(language);

  const getShippingClassesFromCartState = (cart: any): CartShippingClassRef[] =>
    getShippingClassesFromCart(cart?.products);

  const getMethodCost = (method: ShippingMethod): number =>
    resolveShippingMethodCost(method, cartShippingClasses);

  const applyShippingCost = (
    zones: ShippingZone[],
    method: ShippingMethod | undefined,
    cartClasses: CartShippingClassRef[],
  ) => {
    if (!method?.id) return;

    const methodFromZones = zones
      .flatMap((zone) => zone.methods)
      .find((entry) => String(entry.id) === String(method.id));
    const resolvedMethod = methodFromZones ?? method;
    const resolvedCost = resolveShippingMethodCost(resolvedMethod, cartClasses);

    setShippingPrice(resolvedCost);
    setCostsReady(true);
    onCostsReadyChange?.(true);
  };

  const resolveMethodForZone = (
    availableMethods: ShippingMethod[],
    currentMethod: ShippingMethod | undefined,
  ): ShippingMethod | undefined => {
    if (availableMethods.length === 0) return undefined;

    const currentId = currentMethod?.id;
    if (
      currentId &&
      availableMethods.some((method) => String(method.id) === String(currentId))
    ) {
      return availableMethods.find((method) => String(method.id) === String(currentId));
    }

    return availableMethods[0];
  };

  useEffect(() => {
    setCartShippingClasses(getShippingClassesFromCartState(cart));
  }, [cart]);

  useEffect(() => {
    if (!costsReady || !shippingMethod?.id || shippingZones.length === 0) return;
    applyShippingCost(shippingZones, shippingMethod, cartShippingClasses);
  }, [cartShippingClasses]);

  // ─── FETCH SHIPPING METHODS ──────────────────────────────────────────────
  useEffect(() => {
    const flightId = ++requestFlightRef.current;
    const isStale = () => flightId !== requestFlightRef.current;

    const beginLoading = () => {
      setLoading(true);
      setCostsReady(false);
      setShippingZones([]);
      onCostsReadyChange?.(false);
      setError(null);
    };

    if (!shippingContextReady) {
      beginLoading();
      return;
    }

    beginLoading();

    const fetchShippingMethods = async () => {
      const zoneIdAtFetch = selectedZone;

      try {

        // ZADBANO MEBLE - trzeba uwzględnić wniesienie obecnie w buildZadbanoMethods

        const hasZadbanoClass = cart?.products?.some((product: any) => {
          return product?.shipping_class === 'zadbano';
        });        

        // const hasEmmaZadbano = cart?.products?.some((product: any) => {
        //   const productId = String(product?.productId ?? '');
        //   const variationId = product?.variationId
        //     ? String(product.variationId)
        //     : null;
        //   return (
        //     EMMA_ZADBANO_PRODUCT_IDS.has(productId) ||
        //     (variationId ? EMMA_ZADBANO_PRODUCT_IDS.has(variationId) : false)
        //   );
        // });

        // if (hasEmmaZadbano) {
        //   const zadbanoMethods = buildZadbanoMethods();
        //   setShippingZones([{ zoneName: 'Zadbano', methods: zadbanoMethods, zoneId: selectedZone }]);
        //   const defaultMethod = zadbanoMethods[0];
        //   if (defaultMethod) {
        //     setShippingMethod(defaultMethod.id);
        //     setShippingTitle(defaultMethod.title);
        //     setShippingPrice(Number(defaultMethod.cost) || 0);
        //   }
        //   setLoading(false);
        //   return;
        // }

        const response = await fetch(`/api/shipping?lang=${language}`);
        if (isStale()) return;

        if (!response.ok) {
          throw new Error(t.checkout.shipping.errorLoading);
        }
        const data = await response.json();
        if (isStale()) return;

        // const selectedZoneData = data.filter((zone: ShippingZone) =>
        //   selectedZone === 'poland' ? 
        //     ( zone.zoneName.toLowerCase().includes('polska') || zone.zoneName.toLowerCase().includes('poland') ) :
        //     ( ! zone.zoneName.toLowerCase().includes('polska') && ! zone.zoneName.toLowerCase().includes('poland') )
        // );

        const selectedZoneData = data.filter(
          (zone: ShippingZone) => Number(zone.zoneId) === Number(zoneIdAtFetch),
        );
        if (isStale()) return;

        // Check if coupon has free shipping enabled OR specific coupons are applied
        // const hasFreeShipCoupon =
        //   cart?.coupon?.freeShipping === true ||
        //   hasCoupon(cart, 'comeback') ||
        //   hasCoupon(cart, 'cudodostawa');

        // console.log('DEBUG Shipping - cart.coupon:', cart?.coupon);
        // console.log('DEBUG Shipping - hasFreeShipCoupon:', hasFreeShipCoupon);

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
          '7563916',
          '7564076',
          '7564079',
          '7564085',
          '7564098',
          '7564100',
          '7564103',
          '7564082',
          '7564105',
          '7564107',
          '7564114',
          '7564116',
          '7564118',
          '7535654',
          '7535678',
        ];
        const cartContainsRestricted =
          cart?.products?.some(
            (product: any) =>
              restrictedIds.includes(String(product.productId)) ||
              (product.variationId &&
                restrictedIds.includes(String(product.variationId))),
          ) || false;

        // update zones by contstrains (only for polish shipping methods)
        let updatedZones = selectedZoneData.map((zone: ShippingZone) => {
          if (zone.zoneName.toLocaleLowerCase() !== 'polska' && zone.zoneName.toLocaleLowerCase() !== 'poland') {
            return zone;
          }

          let filteredMethods = zone.methods.filter((method) => {

            // pozostaw Metody Zadbano dla koszyka z produktami Zadbano
            if(hasZadbanoClass && ! ZADBANO_SHIPPING_METHODS_IDS.includes(Number(method.id)) ) {
              return false;
            }

            // usuń Metody Zadbano dla koszyka bez Zadbano
            if(!hasZadbanoClass && ZADBANO_SHIPPING_METHODS_IDS.includes(Number(method.id))) {
              return false;
            }

            // usuń darmowe metody jeżeli nie spełniają wymagań
            if(!hasZadbanoClass && cartTotal < FREE_SHIPPING_LIMITS[currency_slug] && method.method_id === 'free_shipping') {
              return false;
            }


            // Filter out any 'flexible shipping' references
            if (method.title.toLowerCase().includes('flexible shipping')) {
              return false;
            }


            // Filter out 'darmowa' if cartTotal < 300 and no free-shipping coupon
            // if (
            //   method.title.toLowerCase().includes('darmowa') &&
            //   cartTotal < 300 &&
            //   !hasFreeShipCoupon
            // ) {
            //   return false;
            // }
            return true;
          });

          // Darmowa dostawa powyżej progu — nie dotyczy zamówień Zadbano
          if (
            !hasZadbanoClass &&
            cartTotal >= FREE_SHIPPING_LIMITS[currency_slug]
          ) {
            filteredMethods = filteredMethods.map((method) =>
              NON_FREE_SHIPPING_METHODS_IDS.includes(Number(method.id)) ||
              ZADBANO_SHIPPING_METHODS_IDS.includes(Number(method.id))
                ? method
                : { ...method, cost: null },
            );
          }



          // DARMOWA DOSTAWA DLA INPOST oraz Punkt GLS

          // If cartTotal >= 300 or has free shipping coupon, show only a specific set and make appropriate ones free
          // if (cartTotal >= 300 || hasFreeShipCoupon) {
          //   const allowed = new Set([
          //     'kurier gls',
          //     'kurier gls pobranie',
          //     'kurier gls - darmowa wysyłka',
          //     'darmowa dostawa',
          //     'paczkomaty inpost',
          //     'punkty gls',
          //   ]);
          //   // keep only the allowed methods
          //   filteredMethods = filteredMethods.filter((method) =>
          //     allowed.has(method.title.toLowerCase()),
          //   );
          //   // make the non-COD ones free
          //   filteredMethods = filteredMethods.map((method) => {
          //     const t = method.title.toLowerCase();
          //     // Make all non-COD methods free (COD = pobranie)
          //     const isCOD = t.includes('pobranie');
          //     const makeFree = !isCOD;
          //     return makeFree ? { ...method, cost: null } : method; // keep COD cost intact
          //   });
          // }

          // Conditionally add Paczkomaty InPost
          // if (
          //   !filteredMethods.some(
          //     (method) => method.title.toLowerCase() === 'paczkomaty inpost',
          //   ) &&
          //   !cartContainsRestricted // add only if no restricted items
          // ) {
          //   filteredMethods.push({
          //     id: 'paczkomaty_inpost',
          //     title: 'Paczkomaty InPost',
          //     cost: cartTotal >= 300 || hasFreeShipCoupon ? null : 15,
          //     enabled: true,
          //   });
          // }

          // Conditionally add Punkty GLS
          // if (
          //   !filteredMethods.some(
          //     (method) => method.title.toLowerCase() === 'punkty gls',
          //   ) &&
          //   !cartContainsRestricted // add only if no restricted items
          // ) {
          //   filteredMethods.push({
          //     id: 'punkty_gls',
          //     title: 'Punkty GLS',
          //     cost: cartTotal >= 300 || hasFreeShipCoupon ? null : 15,
          //     enabled: true,
          //   });
          // }

          // Final filter pass: remove if cartContainsRestricted
          if (cartContainsRestricted) {
            filteredMethods = filteredMethods.filter(
              (method) =>
                !isPaczkomatyMethod(method) && !isPunktyGlsMethod(method),
            );
          }

          filteredMethods = placePaczkomatyFirst(filteredMethods);

          return { ...zone, methods: filteredMethods };
        });

        if (isStale()) return;

        setShippingZones(updatedZones);

        const availableMethods = updatedZones.flatMap(
          (zone: ShippingZone) => zone.methods,
        );
        const cartClasses = getShippingClassesFromCart(cart?.products);
        const methodToUse = resolveMethodForZone(
          availableMethods,
          shippingMethodRef.current,
        );

        if (isStale()) return;

        if (availableMethods.length === 0) {
          setCostsReady(true);
          onCostsReadyChange?.(true);
        } else if (methodToUse) {
          setShippingMethod(methodToUse);
          setShippingTitle(methodToUse.title);
          applyShippingCost(updatedZones, methodToUse, cartClasses);
        }

      } catch (err) {
        if (isStale()) return;
        console.error('Error fetching shipping methods:', err);
        setError(t.checkout.shipping.retryMessage);
        setTimeout(() => {
          if (flightId === requestFlightRef.current) {
            fetchShippingMethods();
          }
        }, 5000);
      } finally {
        if (!isStale()) {
          setLoading(false);
        }
      }
    };
    fetchShippingMethods();
  }, [cart, cartTotal, language, selectedZone, shippingContextReady]);

  // Recovery: ensure method + price are set after fetch when state was cleared mid-flight.
  useEffect(() => {
    if (loading || !shippingContextReady || shippingZones.length === 0) return;

    const availableMethods = shippingZones.flatMap((zone) => zone.methods);
    if (availableMethods.length === 0) {
      if (!costsReady) {
        setCostsReady(true);
        onCostsReadyChange?.(true);
      }
      return;
    }

    const methodToUse = resolveMethodForZone(availableMethods, shippingMethod);
    if (!methodToUse) return;

    const hasValidSelection =
      shippingMethod?.id &&
      availableMethods.some(
        (method) => String(method.id) === String(shippingMethod.id),
      );

    if (hasValidSelection && costsReady) return;

    setShippingMethod(methodToUse);
    setShippingTitle(methodToUse.title);
    applyShippingCost(shippingZones, methodToUse, cartShippingClasses);
  }, [
    loading,
    shippingContextReady,
    shippingZones,
    shippingMethod?.id,
    costsReady,
    cartShippingClasses,
  ]);

  // ─── HANDLING SHIPPING METHOD CHANGE ──────────────────────────────────────
  const handleShippingChange = (method: ShippingMethod) => {
    setShippingMethod(method);
    setShippingTitle(method.title);
    setShippingPrice(getMethodCost(method));
    setCostsReady(true);
    onCostsReadyChange?.(true);
    // When switching away from "Punkty GLS", do not reinitialize the GLS map.
    // if (method.id !== 'punkty_gls') {
    if (!isPunktyGlsMethod(method)) {
      setShowGlsMap(false);
    }
  };

  // ─── EASYPACK (InPost) INTEGRATION ───────────────────────────────────────────
  useEffect(() => {
    const hasPaczkomaty = shippingZones.some((zone) =>
      zone.methods.some(isPaczkomatyMethod),
    );
    if (hasPaczkomaty || isPaczkomatyMethod(shippingMethod)) {
      ensureEasyPack();
    }
  }, [shippingZones, shippingMethod?.id, shippingMethod?.title]);

  const openInpostModal = () => {
    whenEasyPackReady(() => {
      if (!window.easyPack || typeof window.easyPack.modalMap !== 'function') {
        console.error('Funkcja modalMap EasyPack jest niedostępna.');
        return;
      }
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
    });
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

  const showShippingMethods = shippingContextReady && !loading && costsReady;
  const shippingStatusMessage = !isDeliveryCountrySelected
    ? t.checkout.shipping.selectCountryForShipping
    : t.checkout.shipping.loading;

  return (
    <div>
      <h2 className="text-[20px] font-bold mb-6 text-neutral-darkest">
        {t.checkout.shipping.title}
      </h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : !showShippingMethods ? (
        <p className="py-4 text-neutral-dark">{shippingStatusMessage}</p>
      ) : (
        <>
      {shippingZones.map((zone) => (
        <div key={zone.zoneName}>
          {zone.methods.map((method) => (
            <div key={method.id}>
              <label
                className={`grid grid-cols-[60%_20%_20%] sm:grid-cols-3 items-center py-[16px] border-b ${shippingMethod.id === method.id
                  ? 'border-dark-pastel-red'
                  : 'border-beige-dark'
                  }`}
              >
                {/* First Column: Shipping Name */}
                <div className="flex items-center gap-4 w-full">
                  <input
                    type="radio"
                    value={method.id}
                    checked={shippingMethod.id === method.id}
                    onChange={() => handleShippingChange(method)}
                    className="hidden"
                    disabled={loading}
                  />
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full ${shippingMethod.id === method.id
                      ? 'border-4 border-dark-pastel-red'
                      : 'border-2 border-gray-400'
                      }`}
                  ></span>
                  <span>{method.title}</span>
                </div>

                {/* Second Column: Price */}
                <span className="text-sm text-gray-700 text-center w-full">
                  {getMethodCost(method)}
                  {/* {method.cost
                    ? `${parseFloat(String(method.cost)).toFixed(2)} ${currency.symbol}`
                    : t.checkout.shipping.free} */}
                </span>

                {/* Third Column: Icon */}
                <div className="flex justify-center w-full">
                  <img
                    src={
                      (isPaczkomatyMethod(method)
                        ? '/icons/paczkomat.png'
                        : shippingIcons[method.title.toLowerCase()]) ||
                      '/icons/delivery.svg'
                    }
                    alt={`${method.title} Icon`}
                    className="w-[50px] sm:w-[55px] h-auto"
                  />
                </div>
              </label>

              {isPaczkomatyMethod(method) &&
                (Object.keys(shippingMethod).length !== 0 && isPaczkomatyMethod(shippingMethod)) && (
                  <div>
                    <button
                      onClick={openInpostModal}
                      className="mt-6 text-black border border-black px-4 py-2 rounded-full flex items-center text-sm"
                    >
                      {t.checkout.shipping.selectLocker}
                    </button>
                    {selectedLockerData && (
                      <p className="mt-2 text-sm text-gray-700">
                        {t.checkout.shipping.selectedPoint} {selectedLockerData.id} -{' '}
                        {selectedLockerData.address}, {selectedLockerData.city},{' '}
                        {selectedLockerData.postalCode}
                      </p>
                    )}
                  </div>
                )}

              {isPunktyGlsMethod(method) &&
              (Object.keys(shippingMethod).length !== 0 && isPunktyGlsMethod(shippingMethod)) && (
                  <div>
                    <button
                      onClick={() => {
                        setShowGlsMap(true);
                      }}
                      className="mt-6 text-black border border-black px-4 py-2 rounded-full flex items-center text-sm"
                    >
                      {selectedGlsPoint
                        ? t.checkout.shipping.changeGlsPoint
                        : t.checkout.shipping.selectGlsPoint}
                    </button>
                    {selectedGlsPoint && (
                      <p className="mt-2 text-sm text-gray-700">
                        {t.checkout.shipping.selectedPoint}{' '}
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
        </>
      )}
    </div>
  );
};

export default Shipping;
