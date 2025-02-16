import React from 'react';
import Image from 'next/image';

interface DeliveryReturnInfoProps {
  onScrollToSection?: () => void; // Callback for special interaction
  stock?: number; // Optional stock quantity prop
}

const DeliveryReturnInfo: React.FC<DeliveryReturnInfoProps> = ({
  onScrollToSection,
  stock,
}) => {
  const items = [
    {
      icon: '/icons/wysylka-w-24.svg',
      text: 'Wysyłka w 24h',
      alt: 'Shipping within 24 hours',
    },
    {
      icon: '/icons/zwrot.svg',
      text: '30 dni na zwrot',
      alt: 'Return Policy',
    },
    {
      icon: '/icons/kupowane-razem.svg',
      text: 'Sprawdź produkty w tym samym kolorze',
      alt: 'Frequently bought together',
      isInteractive: true,
    },
  ];

  // Determine total number of rows.
  const totalRows = items.length + (stock !== undefined ? 1 : 0);

  return (
    <div className="mt-4 border border-[#DAD3C8] rounded-[24px]">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center p-4 space-x-4 ${
            // If a stock row exists, this item is never the last overall;
            // otherwise, only add border if it's not the last item in items.
            index !== totalRows - 1 ? 'border-b border-[#DAD3C8]' : ''
          }`}
          style={{ width: '80%' }}
        >
          <Image src={item.icon} alt={item.alt} width={24} height={24} />
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

      {/* New row: Stock information (last row overall – no bottom border) */}
      {stock !== undefined && (
        <div
          className="flex items-center p-4 space-x-4"
          style={{ width: '80%' }}
        >
          <Image
            src="/icons/stock.svg"
            alt="Stock info"
            width={24}
            height={24}
          />
          <span className="text-black font-medium">
            {stock < 50 ? 'Mały stan magazynowy' : 'Duża ilość w magazynie'}
          </span>
        </div>
      )}
    </div>
  );
};

export default DeliveryReturnInfo;
