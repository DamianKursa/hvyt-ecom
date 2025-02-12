import React, { useState } from 'react';

interface ToggleSectionProps {
  title: string;
  content: string; // HTML content
}

const ToggleSection: React.FC<ToggleSectionProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="toggle-section border-b border-gray-300 pb-4">
      {/* Title */}
      <h2 className="text-[28px] font-semibold mb-4">{title}</h2>

      {/* Content */}
      <div
        className={`formatted-content ${
          isExpanded ? '' : 'line-clamp-2'
        } whitespace-pre-wrap`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-black mb-[24px] underline hover:text-dark-pastel-red mt-2"
      >
        {isExpanded ? 'Zwiń' : 'Rozwiń'}
      </button>
    </div>
  );
};

export default ToggleSection;
