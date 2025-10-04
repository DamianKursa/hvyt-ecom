import React from 'react';
import Image from 'next/image';

interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondButtonText?: string;
  secondButtonLink?: string;
  imageSrc: string;
  imageAlt: string;
  bgColor: string;
  /** Optional background video for the hero. When provided, box animations and the rotated overlay image are disabled. */
  videoSrc?: string;
  /** Optional poster image (e.g. obraz.png) shown before the video loads or on devices that block autoplay. */
  posterSrc?: string;
  /** Pixels of the next section to peek below the hero height (LV-style). Defaults to 80. */
  nextPeekPx?: number;
}

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  secondButtonText,
  secondButtonLink,
  imageSrc,
  imageAlt,
  bgColor,
  videoSrc,
  posterSrc,
  nextPeekPx,
}) => {
  const peekPx = typeof nextPeekPx === 'number' ? nextPeekPx : 80;

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden px-0"
      style={{
        background: bgColor,
        height: `calc(90dvh - ${peekPx}px)`,
        minHeight: 560,
      }}
    >
      {videoSrc && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          controls={false}
        />
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
      {!videoSrc && (
        <div className="absolute bottom-0 right-0 block md:hidden">
          <Image
            src="/images/bg-mobile-hero.svg"
            alt={`${imageAlt} Mobile Overlay`}
            width={300}
            height={200}
            priority
          />
        </div>
      )}

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
