import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Image from 'next/image';

interface ExpandableSectionProps {
  title: string;
  content: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  content,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cleanHTML = (html: string) =>
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  return (
    <div className="py-2 border-b border-gray-300">
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
      {isExpanded && (
        <div
          className=" formatted-content py-[24px]"
          dangerouslySetInnerHTML={{ __html: cleanHTML(content) }}
        />
      )}
    </div>
  );
};

export default ExpandableSection;
