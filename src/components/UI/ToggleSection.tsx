// ToggleSection.tsx
import React, { useState } from 'react';

interface ToggleSectionProps {
  title: string;
  content: string; // Processed HTML content
}

const ToggleSection: React.FC<ToggleSectionProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 border-b border-gray-300">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div
        className={`formatted-content ${isExpanded ? '' : 'line-clamp-3'}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-black underline hover:text-dark-pastel-red mt-2"
      >
        {isExpanded ? 'Zwiń' : 'Rozwiń'}
      </button>
    </div>
  );
};

export default ToggleSection;
