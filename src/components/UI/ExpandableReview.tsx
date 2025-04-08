import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

interface ExpandableReviewProps {
  content: string;
}

const ExpandableReview: React.FC<ExpandableReviewProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const cleanHTML = (html: string) =>
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight,
      );
      const maxHeight = lineHeight * 4;
      if (contentRef.current.scrollHeight > maxHeight) {
        setIsTruncated(true);
      }
    }
  }, [content]);

  return (
    <div className="mb-4">
      <div
        ref={contentRef}
        className={`text-black overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-full' : 'max-h-[6rem]'
        }`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 4,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.5rem',
          wordWrap: 'break-word',
          whiteSpace: 'normal',
        }}
        dangerouslySetInnerHTML={{ __html: cleanHTML(content) }}
      />
      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-dark-pastel-red text-sm underline"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Zwiń' : 'Rozwiń'}
        </button>
      )}
    </div>
  );
};

export default ExpandableReview;
