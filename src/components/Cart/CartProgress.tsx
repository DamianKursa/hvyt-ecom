import React from 'react';
import { useRouter } from 'next/router';
import { useI18n } from '@/utils/hooks/useI18n';

const CartProgress: React.FC = () => {
  const router = useRouter();
  const { t, getPath } = useI18n();
  const isCheckoutPage = router.pathname === '/checkout';
  const isThankYouPage = router.pathname === '/dziekujemy';

  // Define the steps with their corresponding paths
  const steps = [
    { label: t.cart.progress.cart, icon: '/icons/cart.svg', path: getPath('/koszyk') },
    {
      label: t.cart.progress.deliveryAndPayment,
      icon: '/icons/truck.svg',
      path: getPath('/checkout'),
    },
    {
      label: t.cart.progress.summary,
      icon: '/icons/podsumowanie.svg',
      path: getPath('/dziekujemy'),
    },
  ];

  const activeIndex = steps.findIndex(step => router.pathname === step.path || 
    (step.path.includes('koszyk') && router.pathname === '/koszyk') ||
    (step.path.includes('checkout') && router.pathname === '/checkout') ||
    (step.path.includes('dziekujemy') && router.pathname === '/dziekujemy'));

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
          <span>{t.cart.progress.backToProducts}</span>
        </div>
      )}

      {/* Steps */}
      <div className="flex items-center w-full rounded-full border border-[#E0D6CD] bg-[#F8F5F1]">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = activeIndex > index;

          const mobileFlexClass = isCheckoutPage
            ? step.path.includes('checkout')
              ? 'flex-[2]'
              : 'flex-[0.5]'
            : 'flex-1';

          return (
            <div
              key={index}
              className={`flex items-center justify-center py-4 px-4 gap-3 ${mobileFlexClass} md:flex-1 text-sm font-medium relative ${isActive ? 'bg-[#E0D6CD] font-semibold' : 'bg-transparent'
                } ${index === 0
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
              <img
                src={isCompleted ? '/icons/check-black.svg' : step.icon}
                alt={isCompleted ? 'Completed' : step.label}
                className="w-5 h-5"
              />

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
