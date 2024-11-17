import React from 'react';
import Image from 'next/image';

interface InfoItem {
  icon: string; // Path to the icon
  text: string; // Text to display
  alt: string; // Alt text for the icon
}

interface DeliveryReturnInfoProps {
  items: InfoItem[]; // Array of information items
}

const DeliveryReturnInfo: React.FC<DeliveryReturnInfoProps> = ({ items }) => {
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
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
};

export default DeliveryReturnInfo;
