import React from 'react';
import Image from 'next/image';

interface KolekcjaDescriptionProps {
  /** raw HTML from ACF dodatkowy_opis_kolekcji */
  content: string;
  /** image URL for the collection */
  imageUrl: string;
  /** full width or container centered */
  fullWidth?: boolean;
}

const KolekcjaDescription: React.FC<KolekcjaDescriptionProps> = ({
  content,
  imageUrl,
  fullWidth = true,
}) => {
  if (!content || content.trim() === '') {
    return null;
  }
  // Shared section wrapper with beige background and padding
  const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section
      className={`bg-[#F5F5F5] px-4 mt-[64px] md:mt-[88px] md:my-[115px] py-[88px] ${fullWidth ? 'w-full' : 'container mx-auto'
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

  return (
    <SectionWrapper>
      {/* Left: Image column */}
      <div className="w-full md:w-1/2 flex justify-center order-1">
        <Image
          src={imageUrl || '/placeholder.jpg'}
          alt="Opis kolekcji obraz"
          width={800}
          height={500}
          className="rounded-lg shadow-lg object-cover"
        />
      </div>

      {/* Right: Text column */}
      <div className="w-full md:w-1/2 text-left order-2">
        <div
          className="formatted-content-category"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </SectionWrapper>
  );
};

export default KolekcjaDescription;