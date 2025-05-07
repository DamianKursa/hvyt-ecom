import React, { useState } from 'react';
import Image from 'next/image';
import { categoryContent, Section } from './CategoryContent';

interface CategoryDescriptionProps {
  category: string;
  /** raw HTML from WP term.description */
  wpDescription?: string;
  fullWidth?: boolean;
}

const ExpandableSection: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div
        className={`formatted-content ${isExpanded ? '' : 'line-clamp-3'} overflow-hidden`}
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

const CategoryDescription: React.FC<CategoryDescriptionProps> = ({
  category,
  wpDescription = '',
  fullWidth = true,
}) => {
  const sections: Section[] = categoryContent[category] || [];

  // Shared section wrapper
  const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <section
      className={`bg-[#F5F5F5] px-4 mt-[64px] md:mt-[88px] md:mt-0 md:my-[115px] py-[88px] ${
        fullWidth ? 'w-full' : 'container mx-auto'
      }`}
      style={{ backgroundColor: 'var(--color-beige)' }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {children}
        </div>
      </div>
    </section>
  );

  // 1) Fallback: no hard-coded sections, but we have WP HTML
  if (sections.length === 0 && wpDescription) {
    return (
      <SectionWrapper>
        {/* Text column */}
        <div className="w-full md:w-1/2 text-left">
          <div
            className="formatted-content-category"
            dangerouslySetInnerHTML={{ __html: wpDescription }}
          />
        </div>
        {/* Image column */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={`/images/${category}-description.jpg`}
            alt={`${category} description image`}
            width={800}
            height={500}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
      </SectionWrapper>
    );
  }

  // 2) Hard-coded expandable sections
  return (
    <SectionWrapper>
      {/* Left: your ExpandableSection list */}
      <div className="w-full md:w-1/2 text-left">
        {sections.map((section, i) => (
          <ExpandableSection
            key={i}
            title={section.title}
            content={section.content}
          />
        ))}
      </div>

      {/* Right: the same image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src={`/images/${category}-description.jpg`}
          alt={`${category} description image`}
          width={800}
          height={500}
          className="rounded-lg shadow-lg object-cover"
        />
      </div>
    </SectionWrapper>
  );
};

export default CategoryDescription;
