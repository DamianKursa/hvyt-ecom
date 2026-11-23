import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ExpandableReview from '@/components/UI/ExpandableReview';
import ModalImageGallery, { GalleryMedia } from '../UI/ModalGalleryImage';
import LoaderSpinner from '@/components/UI/LoaderSpinner';
import { getReviewMedia, ReviewMediaItem } from '@/lib/reviewMedia';

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

function preloadFullMedia(item: ReviewMediaItem) {
  return new Promise<void>((resolve) => {
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.preload = 'auto';
      const finish = () => {
        video.removeAttribute('src');
        video.load();
        resolve();
      };
      video.addEventListener('loadeddata', finish, { once: true });
      video.addEventListener('error', finish, { once: true });
      video.src = item.url;
      return;
    }

    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = item.url;
  });
}

function ReviewThumb({
  item,
  index,
  onOpen,
}: {
  item: ReviewMediaItem;
  index: number;
  onOpen: (index: number) => void;
}) {
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [src, setSrc] = useState(item.thumb || item.url);
  const showIfDecoded = (node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setReady(true);
  };

  const openFullSize = async () => {
    if (opening) return;
    setOpening(true);
    try {
      await preloadFullMedia(item);
    } finally {
      setOpening(false);
    }
    onOpen(index);
  };

  return (
    <button
      type="button"
      className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[8px] bg-beige"
      onClick={openFullSize}
      aria-busy={opening}
      aria-label={
        item.type === 'video'
          ? `Odtwórz film ${index + 1}`
          : `Powiększ zdjęcie ${index + 1}`
      }
    >
      <img
        ref={showIfDecoded}
        src={src}
        alt=""
        loading="lazy"
        onLoad={() => setReady(true)}
        onError={() => {
          if (item.type === 'image' && src !== item.url) setSrc(item.url);
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
      {item.type === 'video' && <PlayIcon />}
      {opening && (
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-beige/80">
          <LoaderSpinner className="animate-spin h-8 w-8" />
        </span>
      )}
    </button>
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
    poster: item.type === 'video' ? item.thumb : undefined,
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openAt = (index: number) => {
    setSelectedIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <div className="mb-[36px]">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex items-center gap-0.5 text-[24px] leading-none">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={index < review.rating ? 'text-[#E44D61]' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-[20px] leading-none text-black">{review.rating}/5</span>
      </div>

      <div className="text-[16px] leading-[24px] text-black">
        <ExpandableReview content={processedContent} />
      </div>

      <p className="text-[16px] font-bold text-black">{review.reviewer || 'Anonymous'}</p>

      {media.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {media.map((item, index) => (
            <ReviewThumb
              key={`${item.type}-${item.url}`}
              item={item}
              index={index}
              onOpen={openAt}
            />
          ))}
        </div>
      )}

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
