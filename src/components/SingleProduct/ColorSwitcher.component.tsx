import React from 'react';

interface ColorSwitcherProps {
  options: string[]; // Array of available colors
  selectedColor: string | null; // Currently selected color
  onColorChange: (color: string) => void; // Callback for handling color change
  colorMap: { [key: string]: string }; // Map of color names to their corresponding hex codes
}

const ColorSwitcher: React.FC<ColorSwitcherProps> = ({
  options,
  selectedColor,
  onColorChange,
  colorMap,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base font-semibold">Kolor:</span>
      <div className="flex gap-2 mt-2">
        {options.map((color, index) => (
          <div
            key={index}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-md cursor-pointer border ${
              selectedColor === color
                ? 'border-dark-pastel-red'
                : 'border-neutral-dark'
            }`}
            style={{ backgroundColor: colorMap[color] || '#ccc' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSwitcher;
