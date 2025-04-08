// components/GridColumn.tsx
import React from 'react';

interface GridColumnProps {
  span: number;
  children: React.ReactNode;
}

const GridColumn: React.FC<GridColumnProps> = ({ span, children }) => {
  return (
    <div className={`w-${span}/12 px-grid-desktop-gutter`}>{children}</div>
  );
};

export default GridColumn;
