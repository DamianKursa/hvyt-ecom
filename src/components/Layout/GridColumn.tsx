// components/GridColumn.tsx
import React from 'react';

interface GridColumnProps {
  span: number; // How many columns the item should span (out of 12)
  children: React.ReactNode;
}

const GridColumn: React.FC<GridColumnProps> = ({ span, children }) => {
  return (
    <div className={`w-${span}/12 px-grid-desktop-gutter`}>
      {children}
    </div>
  );
};

export default GridColumn;