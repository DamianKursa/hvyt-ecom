import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Image from 'next/image';

interface ExpandableSectionProps {
  title: string;
  content: string;
  isWymiary?: boolean; // Optional prop for special handling of "Wymiary"
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  content,
  isWymiary = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cleanHTML = (html: string) =>
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  const stripHTMLTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Function to format "Wymiary" content into a two-column layout
  const renderWymiaryContent = () => {
    const strippedContent = stripHTMLTags(content); // Strip HTML tags
    const lines = strippedContent.split('\n'); // Split content into lines
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {lines.map((line, index) => {
          const [label, value] = line.split(':'); // Split label and value
          if (!label || !value) return null; // Skip invalid lines
          return (
            <React.Fragment key={index}>
              <div className="font-light text-black">{label.trim()}:</div>
              <div className=" text-black">{value.trim()}</div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`py-2 border-b ${
        isExpanded ? 'border-dark-pastel-red' : 'border-gray-300'
      }`}
    >
      {/* Section Title */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-[24px] flex justify-between items-center py-2 text-lg font-semibold"
      >
        <span className="text-[20px]">{title}</span>
        <Image
          src={isExpanded ? '/icons/minus.svg' : '/icons/plus-sign.svg'}
          alt={isExpanded ? 'Collapse' : 'Expand'}
          width={24}
          height={24}
        />
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="formatted-content py-[24px]">
          {isWymiary ? (
            renderWymiaryContent()
          ) : (
            <div dangerouslySetInnerHTML={{ __html: cleanHTML(content) }} />
          )}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
