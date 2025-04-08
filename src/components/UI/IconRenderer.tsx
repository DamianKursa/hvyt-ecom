import React from 'react';

interface IconRendererProps {
  icons: (string | null | undefined)[];
  iconPath: string;
  iconHeight?: number;
  gap?: number;
  containerClassName?: string;
  iconClassName?: string;
  top?: number;
  left?: number;
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
  const filteredIcons = icons.filter((icon) => !!icon);

  return (
    <div
      className={`flex ${containerClassName}`}
      style={{
        gap: `${gap}px`,
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 10,
      }}
    >
      {filteredIcons.map((iconName, index) => (
        <img
          key={index}
          src={`${iconPath}${iconName}.svg`}
          alt={`Icon ${iconName}`}
          className={iconClassName}
          style={{
            height: `${iconHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: 'inline-block',
          }}
        />
      ))}
    </div>
  );
};

export default IconRenderer;
