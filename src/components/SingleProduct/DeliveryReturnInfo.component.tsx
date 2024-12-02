import React from 'react';
import Image from 'next/image';

interface DeliveryReturnInfoProps {
  onScrollToSection?: () => void; // Callback for special interaction
}

const DeliveryReturnInfo: React.FC<DeliveryReturnInfoProps> = ({
  onScrollToSection,
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

  return (
    <div className="mt-4 border border-[#DAD3C8] rounded-[24px]">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center p-4 space-x-4 ${
            index !== items.length - 1 ? 'border-b border-[#DAD3C8]' : ''
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
    </div>
  );
};

export default DeliveryReturnInfo;
