import React, { useState } from 'react';
import Image from 'next/image';
import { categoryContent, Section } from './CategoryContent';

interface CategoryDescriptionProps {
  category: string;
  fullWidth?: boolean;
}

const ExpandableSection: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
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
  fullWidth = true,
}) => {
  const categorySections: Section[] = categoryContent[category] || [
    { title: 'Brak opisu dla tej kategorii', content: '' },
  ];

  return (
    <section
      className={`bg-[#F5F5F5] my-[115px] py-[88px] ${fullWidth ? 'w-full' : 'container mx-auto'}`}
      style={{ backgroundColor: 'var(--color-beige)' }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Text Column */}
          <div className="w-full md:w-1/2 text-left">
            {categorySections.map((section, index) => (
              <ExpandableSection
                key={index}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>

          {/* Image Column */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src={`/images/${category}-description.jpg`}
              alt={`${category} description image`}
              width={800}
              height={500}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryDescription;
