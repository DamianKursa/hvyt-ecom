import React from 'react';

interface IconRendererProps {
  icons: (string | undefined)[];
  iconPath: string; // Base path for the icons, e.g., "/icons/kolekcja/"
  iconSize?: number; // Optional size for icons (default: 34px)
  gap?: number; // Optional gap between icons (default: 5px)
}

const IconRenderer: React.FC<IconRendererProps> = ({
  icons,
  iconPath,
  iconSize = 44,
  gap = 5,
}) => {
  const filteredIcons = icons.filter((icon) => icon); // Filter out undefined or null icons

  return (
    <div
      className="flex items-start absolute top-4 left-6"
      style={{
        gap: `${gap}px`,
        lineHeight: `${iconSize}px`, // Ensures proper alignment with icon size
      }}
    >
      {filteredIcons.map((iconName, index) => (
        <div
          key={index}
          className="relative"
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            display: 'inline-block',
          }}
        >
          <img
            src={`${iconPath}${iconName}.svg`}
            alt={iconName || 'icon'}
            style={{
              width: '100%',
              height: '100%',
              display: 'block', // Prevents spacing issues in inline-block
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default IconRenderer;
