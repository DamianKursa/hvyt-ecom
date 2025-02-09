import React from 'react';
import { useRouter } from 'next/router';

const CartProgress: React.FC = () => {
  const router = useRouter();

  // Define the steps with their corresponding paths
  const steps = [
    { label: 'Koszyk', icon: '/icons/cart.svg', path: '/koszyk' },
    {
      label: 'Dostawa i płatność',
      icon: '/icons/truck.svg',
      path: '/checkout',
    },
    {
      label: 'Podsumowanie',
      icon: '/icons/podsumowanie.svg',
      path: '/dziekujemy',
    },
  ];

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
      <div className="flex items-center w-full rounded-full border border-[#E0D6CD] bg-[#F8F5F1]">
        {steps.map((step, index) => {
          const isActive = router.pathname === step.path; // Check if the current route matches the step's path

          return (
            <div
              key={index}
              className={`flex items-center justify-center py-4 px-4 gap-3 flex-1 text-sm font-medium relative ${
                isActive ? 'bg-[#E0D6CD] font-semibold' : 'bg-transparent'
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
          );
        })}
      </div>
    </div>
  );
};

export default CartProgress;
