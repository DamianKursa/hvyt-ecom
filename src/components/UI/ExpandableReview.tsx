import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface ExpandableReviewProps {
  content: string; // The review content
}

const ExpandableReview: React.FC<ExpandableReviewProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const cleanHTML = (html: string) =>
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  useEffect(() => {
    if (contentRef.current) {
      // Check if the content exceeds 4 lines
      const maxHeight =
        parseFloat(getComputedStyle(contentRef.current).lineHeight) * 4;
      if (contentRef.current.scrollHeight > maxHeight) {
        setIsTruncated(true);
      }
    }
  }, [content]);

  return (
    <div className="mb-4">
      <div
        ref={contentRef}
        className={`formatted-content text-black overflow-hidden transition-all ${
          isExpanded ? 'max-h-full' : 'max-h-[4.5rem]'
        }`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 4, // Limit to 4 lines when not expanded
          WebkitBoxOrient: 'vertical',
        }}
        dangerouslySetInnerHTML={{ __html: cleanHTML(content) }}
      />
      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-dark-pastel-red text-sm underline"
        >
          {isExpanded ? 'Zwiń' : 'Rozwiń'}
        </button>
      )}
    </div>
  );
};

export default ExpandableReview;
