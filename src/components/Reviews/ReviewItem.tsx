import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import ExpandableReview from '@/components/UI/ExpandableReview';
import ModalImageGallery, { GalleryMedia } from '../UI/ModalGalleryImage';
import { getReviewMedia, videoFrameSrc, ReviewMediaItem } from '@/lib/reviewMedia';

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  media?: ReviewMediaItem[];
  meta?: Record<string, unknown>;
  meta_data?: Array<{ key: string; value: unknown }>;
}

function PlayIcon() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 1.5v9l8-4.5-8-4.5z" />
        </svg>
      </span>
    </span>
  );
}

const ReviewItem = ({ review }: { review: Review }) => {
  const rawContent = review.review || '';
  const media = getReviewMedia(review);

  let contentWithoutAttachments = rawContent
    .replace(/(^|\r?\n)\s*Za(?:ł|l)ą?cznik(?:i)?:\s*[^\r\n]*/gi, '');

  media.forEach((item) => {
    const esc = item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    contentWithoutAttachments = contentWithoutAttachments.replace(new RegExp(esc, 'gi'), '');
  });

  contentWithoutAttachments = contentWithoutAttachments
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  contentWithoutAttachments = contentWithoutAttachments
    .replace(/Za(?:ł|l)\s*ą?cznik(?:i)?\s*:\s*[^\r\n]*/gim, '')
    .replace(/<[^>]*>(?:\s|&nbsp;)*Za(?:ł|l)\s*ą?cznik(?:i)?\s*:(?:.|\n)*?(?=(<br\s*\/?>|<\/p>|<\/div>|$))/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const processedContent = contentWithoutAttachments.replace(/\n/g, '<br/>');
  const gallery: GalleryMedia[] = media.map((item) => ({
    src: item.url,
    type: item.type,
    poster: item.poster,
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openAt = (index: number) => {
    setSelectedIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <div className="border-2 border-[#661F30] rounded-xl p-6 flex flex-col h-full">
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

      <div className="flex-1">
        <ExpandableReview content={processedContent} />
        {media.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {media.map((item, index) => (
              <button
                key={`${item.type}-${item.url}`}
                type="button"
                className="relative h-16 w-16 overflow-hidden rounded-md border border-black bg-neutral-200"
                onClick={() => openAt(index)}
                aria-label={
                  item.type === 'video'
                    ? `Odtwórz film ${index + 1}`
                    : `Powiększ zdjęcie ${index + 1}`
                }
              >
                {item.type === 'video' ? (
                  item.poster ? (
                    <img src={item.poster} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <video
                      src={videoFrameSrc(item.url)}
                      muted
                      playsInline
                      preload="metadata"
                      className="pointer-events-none h-full w-full object-cover"
                    />
                  )
                ) : (
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                )}
                {item.type === 'video' && <PlayIcon />}
              </button>
            ))}
          </div>
        )}
      </div>

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
            images={gallery}
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
