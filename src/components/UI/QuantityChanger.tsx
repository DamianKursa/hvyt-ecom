import React from 'react';

interface QuantityChangerProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantityChanger: React.FC<QuantityChangerProps> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <button
        className="w-8 h-8 border border-gray-300 text-lg font-semibold flex items-center justify-center rounded-full hover:bg-gray-100"
        onClick={onDecrease}
        disabled={quantity <= 1} // Disable decrease if quantity is 1
      >
        −
      </button>
      <span className="text-sm font-semibold">{quantity}</span>
      <button
        className="w-8 h-8 border border-gray-300 text-lg font-semibold flex items-center justify-center rounded-full hover:bg-gray-100"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QuantityChanger;
