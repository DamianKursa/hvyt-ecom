import React from 'react';
import { useRouter } from 'next/router';

const CartProgress: React.FC = () => {
  const router = useRouter();
  const isCheckoutPage = router.pathname === '/checkout';
  const isThankYouPage = router.pathname === '/dziekujemy';

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
    <div className="flex mt-6 md:mt-0 flex-col gap-4 w-full">
      {/* Back Link: only show if not on the thank you page */}
      {!isThankYouPage && (
        <div
          className="flex items-center gap-2 text-sm text-black mb-6 cursor-pointer"
          onClick={() => router.back()}
        >
          <img
            src="/icons/arrow-left-black.svg"
            alt="Back"
            className="w-4 h-4"
          />
          <span>Wróć do produktów</span>
        </div>
      )}

      {/* Steps */}
      <div className="flex items-center w-full rounded-full border border-[#E0D6CD] bg-[#F8F5F1]">
        {steps.map((step, index) => {
          const isActive = router.pathname === step.path;

          const mobileFlexClass = isCheckoutPage
            ? step.path === '/checkout'
              ? 'flex-[2]'
              : 'flex-[0.5]'
            : 'flex-1';

          return (
            <div
              key={index}
              className={`flex items-center justify-center py-4 px-4 gap-3 ${mobileFlexClass} md:flex-1 text-sm font-medium relative ${
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

              {/* Icon */}
              <img src={step.icon} alt={step.label} className="w-5 h-5" />

              {/* Label: on mobile, show only for active step; on md+ show always */}
              <span className={`${isActive ? 'block' : 'hidden'} md:block`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartProgress;
