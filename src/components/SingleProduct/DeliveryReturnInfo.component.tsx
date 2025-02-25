import React from 'react';
import Image from 'next/image';

interface DeliveryReturnInfoProps {
  onScrollToSection?: () => void; // Callback for special interaction
  stock?: number | null; // Stock quantity (number or null)
  stockStatus?: string; // e.g. "instock"
}

const DeliveryReturnInfo: React.FC<DeliveryReturnInfoProps> = ({
  onScrollToSection,
  stock,
  stockStatus,
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

  // Render stock row if either a numeric stock value is provided or if stockStatus is instock.
  const shouldRenderStockRow =
    (typeof stock === 'number' && !isNaN(stock)) || stockStatus === 'instock';

  // Determine total number of rows.
  const totalRows = items.length + (shouldRenderStockRow ? 1 : 0);

  return (
    <div className="mt-4 border border-[#DAD3C8] rounded-[24px]">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center p-4 space-x-4 ${
            // If a stock row exists, these items are never the last overall;
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

      {shouldRenderStockRow && (
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
            {typeof stock === 'number' && !isNaN(stock)
              ? stock >= 50
                ? 'Ponad 50 szt. na stanie. Wysyłka w 24h!'
                : `Tylko ${stock} szt. na stanie. Wysyłka w 24h!`
              : stockStatus === 'instock' && 'Na stanie. Wysyłka w 25h'}
          </span>
        </div>
      )}
    </div>
  );
};

export default DeliveryReturnInfo;
