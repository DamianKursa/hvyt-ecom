import React from 'react';

const InlineSVGIcon: React.FC<{ svgContent: string; size?: number }> = ({
  svgContent,
  size = 44,
}) => (
  <div
    dangerouslySetInnerHTML={{ __html: svgContent }}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      display: 'inline-block',
      backgroundColor: 'transparent', // Force background transparency
    }}
  />
);

export default InlineSVGIcon;
