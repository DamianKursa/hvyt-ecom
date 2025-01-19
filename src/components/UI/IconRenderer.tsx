import React from 'react';

interface IconRendererProps {
  icons: (string | null | undefined)[]; // Allow null or undefined to skip missing icons
  iconPath: string; // Base path for the icons (e.g., "/icons/")
  iconHeight?: number; // Height for icons (default: 24px)
  gap?: number; // Gap between icons (default: 5px)
  containerClassName?: string; // Optional class for the container
  iconClassName?: string; // Optional class for individual icons
  top?: number; // Top offset for positioning
  left?: number; // Left offset for positioning
}

const IconRenderer: React.FC<IconRendererProps> = ({
  icons,
  iconPath,
  iconHeight = 24,
  gap = 5,
  containerClassName = '',
  iconClassName = '',
  top = 20,
  left = 30,
}) => {
  // Filter out missing or invalid icons
  const filteredIcons = icons.filter((icon) => !!icon);

  return (
    <div
      className={`flex ${containerClassName}`}
      style={{
        gap: `${gap}px`,
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 10, // Ensure it appears above the background
      }}
    >
      {filteredIcons.map((iconName, index) => (
        <img
          key={index}
          src={`${iconPath}${iconName}.svg`}
          alt={`Icon ${iconName}`}
          className={iconClassName}
          style={{
            height: `${iconHeight}px`, // Set fixed height for icons
            width: 'auto', // Maintain aspect ratio
            objectFit: 'contain', // Prevent distortion of SVGs
            display: 'inline-block', // Ensure proper rendering
          }}
        />
      ))}
    </div>
  );
};

export default IconRenderer;
