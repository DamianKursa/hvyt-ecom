import React from 'react';

interface ColorSwitcherProps {
  options: string[];
  selectedColor: string | null;
  onColorChange: (color: string) => void;
  colorMap: { [key: string]: string };
}

const ColorSwitcher: React.FC<ColorSwitcherProps> = ({
  options,
  selectedColor,
  onColorChange,
  colorMap,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base font-light">Kolor:</span>
      <div className="flex gap-2">
        {options.map((color, index) => (
          <div
            key={index}
            onClick={() => onColorChange(color)}
            className={`relative w-6 h-6 rounded-md cursor-pointer border ${
              selectedColor === color ? 'border-dark-pastel-red' : ''
            }`}
            style={{
              backgroundColor: colorMap[color] || '#ccc',
            }}
          >
            {/* Tooltip */}
            <div className="absolute -top-10 left-[-5px] opacity-0 transition-opacity duration-200 bg-beige-dark text-black px-2 py-1 rounded-md text-[12px] font-light pointer-events-none whitespace-nowrap">
              {color}
              {/* Pointer */}
              <div className="absolute bottom-[-4px] left-[12px] w-2 h-2 bg-beige-dark rotate-45 transform"></div>
            </div>

            {/* Hover Effect */}
            <style jsx>{`
              div:hover > div {
                opacity: 1;
              }
            `}</style>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSwitcher;
