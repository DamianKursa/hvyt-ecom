import React from 'react';
import { useRouter } from 'next/router';

const steps = [
  { label: 'Koszyk', icon: '/icons/cart.svg', active: true },
  { label: 'Dostawa i płatność', icon: '/icons/truck.svg', active: false },
  { label: 'Podsumowanie', icon: '/icons/podsumowanie.svg', active: false },
];

const CartProgress: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Back Link */}
      <div
        className="flex items-center gap-2 text-sm text-black mb-6 cursor-pointer"
        onClick={() => router.back()} // Navigate to the previous page
      >
        <img src="/icons/arrow-left-black.svg" alt="Back" className="w-4 h-4" />
        <span>Wróć do produktów</span>
      </div>

      {/* Steps */}
      <div className="flex items-center w-full rounded-full border border-[#E0D6CD]">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center py-4 px-4 gap-3 flex-1 text-sm font-medium relative ${
              step.active ? 'bg-[#E0D6CD] font-semibold' : 'bg-transparent'
            } ${
              index === 0
                ? 'rounded-l-full'
                : index === steps.length - 1
                  ? 'rounded-r-full'
                  : ''
            }`}
          >
            {/* Border between steps */}
            {index !== 0 && (
              <div className="absolute left-0 top-0 h-full w-[1px] bg-[#E0D6CD]" />
            )}

            {/* Icon and label */}
            <img src={step.icon} alt={step.label} className="w-5 h-5" />
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartProgress;
