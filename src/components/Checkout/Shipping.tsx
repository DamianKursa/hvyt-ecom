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
}) => {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scriptLoadedRef = useRef(false);

  // Fetch shipping methods on component mount
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

        // Filter for Poland-related zones (Polska/Poland)
        const polandShippingZones = data.filter((zone: ShippingZone) =>
          zone.zoneName.toLowerCase().includes('polska'),
        );

        setShippingZones(polandShippingZones);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShippingMethods();
  }, []);

  // Load EasyPack script and styles
  useEffect(() => {
    const loadEasyPackScript = () => {
      if (!scriptLoadedRef.current) {
        scriptLoadedRef.current = true;

        const script = document.createElement('script');
        script.src =
          'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
        script.async = true;

        script.onload = () => {
          console.log('EasyPack script loaded');
          initializeEasyPack();
        };

        script.onerror = () => {
          console.error('Failed to load the EasyPack script.');
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
        console.log('Initializing EasyPack...');
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

    if (shippingMethod === 'paczkomaty') {
      loadEasyPackScript();
    }
  }, [shippingMethod]);

  const openModal = () => {
    if (window.easyPack && typeof window.easyPack.modalMap === 'function') {
      window.easyPack.modalMap(
        (point: any, modal: any) => {
          modal.closeModal();
          console.log('Selected Point:', point);
          alert(`Wybrany Paczkomat: ${point.name}`);
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
            <label
              key={method.id}
              className={`flex items-center justify-between py-[16px] border-b ${
                shippingMethod === method.id
                  ? 'border-dark-pastel-red'
                  : 'border-beige-dark'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  value={method.id}
                  checked={shippingMethod === method.id}
                  onChange={() => setShippingMethod(method.id)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full ${
                    shippingMethod === method.id
                      ? 'border-4 border-dark-pastel-red'
                      : 'border-2 border-gray-400'
                  }`}
                ></span>
                <span className="ml-2">{method.title}</span>
              </div>
              <span>
                {method.cost
                  ? `${parseFloat(String(method.cost)).toFixed(2)} zł`
                  : 'Darmowa'}
              </span>
              <span>
                <img
                  src="/icons/shipping-icon.svg" // Replace with your icon path
                  alt="Shipping Icon"
                  className="w-6 h-6"
                />
              </span>
            </label>
          ))}
        </div>
      ))}
      <div
        className={`py-[16px] border-b ${
          shippingMethod === 'paczkomaty'
            ? 'border-dark-pastel-red'
            : 'border-beige-dark'
        }`}
      >
        <label className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="radio"
              value="paczkomaty"
              checked={shippingMethod === 'paczkomaty'}
              onChange={() => setShippingMethod('paczkomaty')}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full ${
                shippingMethod === 'paczkomaty'
                  ? 'border-4 border-dark-pastel-red'
                  : 'border-2 border-gray-400'
              }`}
            ></span>
            <span className="ml-2">InPost paczkomaty</span>
          </div>
          <span>Darmowa</span>
          <span>
            <img
              src="/icons/paczkomaty-icon.svg" // Replace with your icon path
              alt="Paczkomaty Icon"
              className="w-6 h-6"
            />
          </span>
        </label>
        {shippingMethod === 'paczkomaty' && (
          <button
            onClick={openModal}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Wybierz Paczkomat
          </button>
        )}
      </div>
    </div>
  );
};

export default Shipping;
