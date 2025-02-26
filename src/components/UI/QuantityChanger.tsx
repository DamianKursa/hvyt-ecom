import React from 'react';

interface QuantityChangerProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

const QuantityChanger: React.FC<QuantityChangerProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  className,
}) => {
  const baseClasses =
    'flex items-center justify-between space-x-3 border border-beige-dark rounded-full lg:min-w-[140px]';
  // If a custom className is provided, use it; otherwise, default to "p-2"
  const paddingClass = className !== undefined ? className : 'p-2';

  return (
    <div className={`${baseClasses} ${paddingClass}`}>
      <button
        className="w-8 h-8 text-[24px] flex items-center justify-center rounded-full hover:bg-gray-100"
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        −
      </button>
      <span className="text-lg">{quantity}</span>
      <button
        className="w-8 h-8 text-[24px] flex items-center justify-center rounded-full hover:bg-gray-100"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QuantityChanger;
