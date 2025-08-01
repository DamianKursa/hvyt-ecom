import React from 'react';
import Image from 'next/image';

interface DeliveryReturnInfoProps {
  onScrollToSection?: () => void;
  stock?: number | null;
  stockStatus?: string;
  isMeble?: boolean;
}

const DeliveryReturnInfo: React.FC<DeliveryReturnInfoProps> = ({
  onScrollToSection,
  stock,
  stockStatus,
  isMeble,
}) => {
  const items = [
    {
      icon: '/icons/zwrot.svg',
      text: '30 dni na zwrot',
      alt: 'Return Policy',
    },
    {
      icon: '/icons/galka.png',
      text: 'Sprawdź produkty w tym samym kolorze',
      alt: 'Frequently bought together',
      isInteractive: true,
    },
  ];

  // Always show both items, even for meble
  const filteredItems = items;

  // Render stock row if meble or if stock positive / in stock
  const shouldRenderStockRow =
    Boolean(isMeble) ||
    (typeof stock === 'number' && stock > 0) ||
    stockStatus === 'instock';

  return (
    <div className="mt-4 border border-beige-dark rounded-[24px]">
      {shouldRenderStockRow && (
        <div
          className={`flex items-center p-4 space-x-4 w-full ${filteredItems.length > 0 ? 'border-b border-[#DAD3C8]' : ''}`}
        >
          <Image
            src="/icons/stock.svg"
            alt="Stock info"
            width={24}
            height={24}
          />
          <span className="text-black font-medium">
            {typeof stock === 'number' && stock > 0
              ? stock >= 50
                ? 'Ponad 50 szt. na stanie. Wysyłka w 24h!'
                : `Tylko ${stock} szt. na stanie. Wysyłka w 24h!`
              : stockStatus === 'instock'
                ? 'Na stanie. Wysyłka w 24h!'
                : null}
          </span>
        </div>
      )}
      {filteredItems.map((item, index) => (
        <div
          key={index}
          className={`flex items-center p-4 space-x-4 w-full ${index < filteredItems.length - 1 ? 'border-b border-[#DAD3C8]' : ''
            }`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src={item.icon}
              alt={item.alt}
              width={item.isInteractive ? 16 : 24}
              height={item.isInteractive ? 16 : 24}
            />
          </div>
          <span className="text-black">
            {item.isInteractive ? (
              <>
                <span
                  className="underline cursor-pointer text-dark-pastel-red"
                  onClick={onScrollToSection}
                >
                  Sprawdź
                </span>{' '}
                produkty w tym samym kolorze
              </>
            ) : (
              item.text
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DeliveryReturnInfo;
