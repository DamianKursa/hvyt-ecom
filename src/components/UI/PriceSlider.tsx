import { getCurrency, Language } from '@/utils/i18n/config';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  currentRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  disabled?: boolean;
  categorySlug?: string; // Optional prop if you need to disable the slider or button externally
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  minPrice,
  maxPrice,
  currentRange,
  onPriceChange,
  categorySlug,
  disabled = false,
}) => {

  const [range, setRange] = useState<[number, number]>(currentRange);
  
  const router = useRouter();
  const currency = getCurrency(router?.locale as Language ?? 'pl');

  useEffect(() => {
    // Update local state if currentRange prop changes
    setRange(currentRange);
  }, [currentRange]);

  const handleInputChange = (index: number, value: string) => {
    const numericValue = Math.max(
      minPrice,
      Math.min(maxPrice, parseInt(value, 10) || minPrice),
    );
    const updatedRange = [...range] as [number, number];
    updatedRange[index] = numericValue;
    setRange(updatedRange);
  };

  const handleSliderChange = (values: number | number[]) => {
    // ReactSlider passes values as number[]
    setRange(values as [number, number]);
  };

  // New function to call onPriceChange only when the user clicks "Apply"
  const handleApplyPriceFilter = () => {
    onPriceChange(range);
  };

  return (
    <div className="px-2 py-2 price-slider">
      {/* React Slider */}
      {categorySlug !== 'meble' && (
        // @ts-ignore
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          renderTrack={(trackProps: any, state: { index: number }) => {
            const backgroundColor = state.index === 0 || state.index === 2 ? '#e0e0e0' : '#661f30';
            const { style, ...rest } = trackProps || {};
            return (
              <div
                {...(rest as any)}
                className="horizontal-slider-track"
                style={{ ...(style || {}), background: backgroundColor }}
              />
            );
          }}
          min={minPrice}
          max={maxPrice}
          step={1}
          value={range}
          onChange={handleSliderChange}
        />
      )}

      {/* Input Fields for Prices */}
      <div className="flex justify-between mt-4 gap-4">
        <div className="relative flex items-center">
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            value={range[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="border border-gray-300 rounded-full px-8 py-2 w-full text-center bg-transparent"
            disabled={disabled}
          />
          <span className="absolute right-3 text-gray-500">{currency.symbol}</span>
        </div>
        <div className="relative flex items-center">
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            value={range[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="border border-gray-300 rounded-full px-8 py-2 w-full text-center bg-transparent"
            disabled={disabled}
          />
          <span className="absolute right-3 text-gray-500">{currency.symbol}</span>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleApplyPriceFilter}
          disabled={disabled}
          className="px-4 py-2 bg-black text-white rounded-full hover:bg-neutral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zastosuj
        </button>
      </div>
    </div>
  );
};

export default PriceSlider;
