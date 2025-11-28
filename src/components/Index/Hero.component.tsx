import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondButtonText?: string;
  secondButtonLink?: string;
  imageSrc: string;
  /** Optional mobile-specific image. When provided, shown on screens < 768px */
  mobileImageSrc?: string;
  imageAlt: string;
  bgColor: string;
  /** Optional background video for the hero. When provided, box animations and the rotated overlay image are disabled. */
  videoSrc?: string;
  /** Optional poster image (e.g. obraz.png) shown before the video loads or on devices that block autoplay. */
  posterSrc?: string;
  /** Pixels of the next section to peek below the hero height (LV-style). Defaults to 80. */
  nextPeekPx?: number;
}

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  secondButtonText,
  secondButtonLink,
  imageSrc,
  mobileImageSrc,
  imageAlt,
  bgColor,
  videoSrc,
  posterSrc,
  nextPeekPx,
}) => {
  const peekPx = typeof nextPeekPx === 'number' ? nextPeekPx : 80;
  const heroRef = useRef<HTMLElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (!videoSrc || typeof window === 'undefined') {
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slowNetwork =
      typeof connection?.effectiveType === 'string' &&
      /(^2g$|^slow-2g$)/.test(connection.effectiveType);
    const shouldSkipVideo =
      motionQuery.matches || connection?.saveData || slowNetwork;

    if (shouldSkipVideo) {
      setShouldLoadVideo(false);
      return;
    }

    const node = heroRef.current;
    if (!node) {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [videoSrc]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full overflow-hidden px-0"
      style={{
        background: bgColor,
        height: `calc(90dvh - ${peekPx}px)`,
        minHeight: 560,
      }}
    >
      {videoSrc && shouldLoadVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          controls={false}
        />
      ) : (
        <>
          {/* Desktop image */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={`object-cover z-0 ${mobileImageSrc ? 'hidden md:block' : ''}`}
            priority
          />
          {/* Mobile image */}
          {mobileImageSrc && (
            <Image
              src={mobileImageSrc}
              alt={imageAlt}
              fill
              className="object-cover z-0 block md:hidden"
              priority
            />
          )}
        </>
      )}
      {/* Bottom-anchored content */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="container mx-auto px-4 md:px-6 pb-10 text-center">
          <h1
            className={`text-[14px] md:text-[20px] font-semibold leading-snug mb-2 ${videoSrc ? 'text-neutral-white' : 'text-dark-pastel-red'}`}
            dangerouslySetInnerHTML={{ __html: title }}
          ></h1>
          <p
            className={`max-w-[600px] mx-auto text-[12px] md:text-[14px] font-light mb-4 ${videoSrc ? 'text-neutral-white opacity-80' : 'text-neutral-darkest'}`}
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
          <div className="flex justify-center gap-3 flex-wrap mt-2">
            <a
              className="inline-block min-w-[140px] font-light px-4 py-2 text-sm md:text-base leading-relaxed text-neutral-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors"
              href={buttonLink}
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>

      {/* Second Mobile-Only Overlay at Bottom Right */}
      {!videoSrc || !shouldLoadVideo ? (
        <div className="absolute bottom-0 right-0 block md:hidden">
          <Image
            src="/images/bg-mobile-hero.svg"
            alt={`${imageAlt} Mobile Overlay`}
            width={300}
            height={200}
            priority
          />
        </div>
      ) : null}

      <style jsx>{`
        @media (min-width: 768px) {
          :global(video) {
            pointer-events: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
