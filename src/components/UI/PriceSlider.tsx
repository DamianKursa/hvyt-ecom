import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  currentRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  minPrice,
  maxPrice,
  currentRange,
  onPriceChange,
}) => {
  const [range, setRange] = useState<[number, number]>(currentRange);

  useEffect(() => {
    // Ensure range is updated if currentRange prop changes
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
    onPriceChange(updatedRange);
  };

  const handleAfterChange = () => {
    onPriceChange(range);
  };

  return (
    <div className="price-slider">
      {/* Slider Header */}
      <div className="font-bold mb-4 flex justify-between items-center w-full">
        <span>Cena</span>
        <img src="/icons/arrow-down.svg" alt="Arrow" className="w-4 h-4" />
      </div>

      {/* React Slider */}
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="slider-thumb"
        renderTrack={(props, state) => {
          // Determine track color based on its index
          const backgroundColor =
            state.index === 0 || state.index === 2 ? '#e0e0e0' : '#661f30';
          return (
            <div
              {...props}
              className="horizontal-slider-track"
              style={{
                ...props.style,
                background: backgroundColor,
              }}
            />
          );
        }}
        min={minPrice}
        max={maxPrice}
        step={5}
        value={range}
        onChange={(values) => setRange(values as [number, number])}
        onAfterChange={handleAfterChange}
      />

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
          />
          <span className="absolute right-3 text-gray-500">zł</span>
        </div>
        <div className="relative flex items-center">
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            value={range[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="border border-gray-300 rounded-full px-8 py-2 w-full text-center bg-transparent"
          />
          <span className="absolute right-3 text-gray-500">zł</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
