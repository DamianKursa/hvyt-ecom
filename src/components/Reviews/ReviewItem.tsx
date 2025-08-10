import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import ExpandableReview from '@/components/UI/ExpandableReview';
import ModalImageGallery from '../UI/ModalGalleryImage';

interface Review {
  id: number;
  reviewer: string;
  review: string; // review content text (may include URLs we append)
  rating: number;
  date_created: string;
}

const ReviewItem = ({ review }: { review: Review }) => {
  // Robustly extract up to 5 image URLs
  const rawContent = review.review || '';
  const imageUrls = Array.from(
    new Set(
      (rawContent.match(/https?:\/\/[^\s)]+?\.(?:png|jpe?g|gif|webp)/gi) || [])
    )
  ).slice(0, 5);

  let contentWithoutAttachments = rawContent
    .replace(/(^|\r?\n)\s*Za(?:ł|l)ą?cznik(?:i)?:\s*[^\r\n]*/gi, '');

  // Strip each extracted URL occurrence from the remaining text
  imageUrls.forEach((u) => {
    const esc = u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    contentWithoutAttachments = contentWithoutAttachments.replace(
      new RegExp(esc, 'gi'),
      ''
    );
  });

  // Normalize excessive blank lines and trim
  contentWithoutAttachments = contentWithoutAttachments
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Extra defensive cleanup: remove any remaining "Załączniki:" fragments (plain or HTML-wrapped)
  contentWithoutAttachments = contentWithoutAttachments
    // plain text anywhere in the line
    .replace(/Za(?:ł|l)\s*ą?cznik(?:i)?\s*:\s*[^\r\n]*/gim, '')
    // HTML-wrapped variants like "<strong>Załączniki:</strong> ..." up to common block terminators
    .replace(/<[^>]*>(?:\s|&nbsp;)*Za(?:ł|l)\s*ą?cznik(?:i)?\s*:(?:.|\n)*?(?=(<br\s*\/?>|<\/p>|<\/div>|$))/gim, '')
    // collapse leftover multiple blank lines again
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [processedContent, setProcessedContent] = useState<string>('');
  const [modalImages, setModalImages] = useState<string[]>([]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Build HTML content similar to SingleProductDetails (attachments already stripped above)
    let base = contentWithoutAttachments.replace(/\n/g, '<br/>');
    // Do not append inline images; they will be shown only in the thumbnail list below
    setProcessedContent(base);
    setModalImages(imageUrls);
  }, [contentWithoutAttachments, imageUrls]);

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'IMG') return;

    // Try to get the raw src attribute first (not the absolute URL), then fall back to the resolved src
    const el = target as HTMLImageElement;
    const rawSrc = el.getAttribute('src') || '';
    const resolvedSrc = el.src || '';

    // Prefer matching by raw attribute, but also try the fully-resolved URL
    let index = modalImages.findIndex((m) => m === rawSrc);
    if (index === -1) {
      // Try to normalize by creating absolute URLs for comparison (in case sanitizer/browser expanded it)
      try {
        const normalizedModal = modalImages.map((m) => {
          // If m is already absolute, URL(...) will keep it; if relative, it will resolve against current origin
          return new URL(m, window.location.origin).href;
        });
        index = normalizedModal.findIndex((href) => href === resolvedSrc);
      } catch {
        // ignore URL errors and keep index as -1
      }
    }

    if (index > -1) {
      setSelectedIndex(index);
      setIsGalleryOpen(true);
    }
  };

  return (
    <div className="border-2 border-[#661F30] rounded-xl p-6 flex flex-col h-full" onClick={handleImageClick}>
      {/* Rating Section */}
      <div className="mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={index < review.rating ? 'text-[#E44D61]' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">{review.rating}/5</p>
      </div>

      {/* Review Text */}
      <div className="flex-1">
        <ExpandableReview content={processedContent} />
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Załącznik ${i + 1}`}
                className="w-14 h-14 object-cover rounded-md cursor-pointer border border-black"
                onClick={() => {
                  setSelectedIndex(i);
                  setIsGalleryOpen(true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIndex(i);
                    setIsGalleryOpen(true);
                  }
                }}
                aria-label={`Otwórz podgląd obrazu ${i + 1} w galerii`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 mt-4">
        <Image
          src="/images/dummy-user.jpg"
          alt={review.reviewer || 'Reviewer'}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h4 className="text-md font-medium text-black">{review.reviewer || 'Anonymous'}</h4>
        </div>
      </div>

      {isClient && isGalleryOpen &&
        createPortal(
          <ModalImageGallery
            images={modalImages}
            selectedImageIndex={selectedIndex}
            onClose={() => setIsGalleryOpen(false)}
          />,
          document.body
        )
      }
    </div>
  );
};

export default ReviewItem;
