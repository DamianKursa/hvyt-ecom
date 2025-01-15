import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface BoxConfig {
  index: number;
  bgColor: string;
  animationType?: 'slidingToTransparent' | 'slidingToBg' | 'slidingTopToBottom';
}

interface AnimationStep {
  step: number;
  animatedBoxes: BoxConfig[];
}

interface HeroProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  imageAlt: string;
  bgColor: string;
  staticBoxes: BoxConfig[];
  animationSteps: AnimationStep[];
}

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  imageAlt,
  bgColor,
  staticBoxes,
  animationSteps,
}) => {
  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      // Set static backgrounds
      staticBoxes.forEach(({ index, bgColor }) => {
        const box = boxesRef.current[index];
        if (box) {
          const slidingBg = box.querySelector<HTMLElement>('.sliding-bg');
          if (slidingBg) {
            slidingBg.style.background = bgColor;
          }
        }
      });

      // Animate boxes in steps
      animationSteps.forEach(({ step, animatedBoxes }) => {
        setTimeout(() => {
          animatedBoxes.forEach(({ index, bgColor, animationType }) => {
            const box = boxesRef.current[index];
            if (box) {
              const slidingBg = box.querySelector<HTMLElement>('.sliding-bg');
              if (slidingBg) {
                if (animationType === 'slidingToTransparent') {
                  slidingBg.style.background = `linear-gradient(to right, ${bgColor} 100%, transparent 0%)`;
                  slidingBg.style.animation = `slidingToTransparent 1s ease-in-out forwards`;
                } else if (animationType === 'slidingToBg') {
                  slidingBg.style.background = `linear-gradient(to right, ${bgColor} 100%, transparent 0%)`;
                  slidingBg.style.animation = `slidingToBg 1s ease-in-out forwards`;
                } else if (animationType === 'slidingTopToBottom') {
                  slidingBg.style.background = `linear-gradient(to bottom, ${bgColor} 100%, transparent 0%)`;
                  slidingBg.style.animation = `slidingTopToBottom 1s ease-in-out forwards`;
                }
              }
            }
          });
        }, step * 500); // Delay animations based on step number
      });
    }
  }, [staticBoxes, animationSteps]);

  return (
    <section
      id="hero"
      className="relative flex items-center w-full min-h-[795px] overflow-hidden px-4 md:px-0"
      style={{
        background: bgColor,
      }}
    >
      <div className="container mx-auto max-w-grid-desktop h-full flex justify-between items-center">
        {/* Grid of boxes */}
        <div className="absolute right-0 top-0 grid grid-cols-3 grid-rows-4 gap-0 justify-end items-center overflow-hidden">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              ref={(el) => {
                boxesRef.current[idx] = el;
              }}
              className="w-[200px] h-[200px] relative overflow-hidden"
            >
              <div className="sliding-bg"></div>
            </div>
          ))}
        </div>

        {/* Overlay Image */}
        <div
          className="absolute inset-0 flex justify-center items-center animate-overlay"
          style={{ transformOrigin: 'center center' }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1270}
            height={698}
            className="animate-overlay"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-start justify-center w-full tracking-wide lg:w-1/2">
            <h1
              className="text-[64px] font-bold leading-tight text-dark-pastel-red mb-4"
              dangerouslySetInnerHTML={{ __html: title }}
            ></h1>
            <p
              className="text-[18px] font-normal  text-neutral-darkest mb-6"
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>

            <div className="flex space-x-4">
              <a
                className="inline-block min-w-[162px] px-6 py-3 text-lg leading-relaxed text-neutral-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors"
                href={buttonLink}
              >
                {buttonText}
              </a>
              <a
                className="inline-block px-6 py-3 text-lg border border-black text-black rounded-full hover:border-dark-pastel-red hover:bg-transparent hover:text-dark-pastel-red transition-colors"
                href={buttonLink}
              >
                Zobacz gałki
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .animate-overlay {
            animation: overlayScaleRotate 4s ease-in-out forwards;
          }

          @keyframes overlayScaleRotate {
            0% {
              transform: rotate(40deg) scale(1);
            }
            100% {
              transform: rotate(0deg) scale(2);
            }
          }

          @keyframes slidingToTransparent {
            0% {
              left: 0%;
            }
            100% {
              left: 100%;
            }
          }

          @keyframes slidingToBg {
            0% {
              left: -100%;
            }
            100% {
              left: 0%;
            }
          }

          @keyframes slidingTopToBottom {
            0% {
              top: 0%;
            }
            100% {
              top: 100%;
            }
          }

          .sliding-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .animate-overlay {
            max-width: 100%;
            object-fit: cover;
            image-rendering: auto; /* Adjust scaling behavior */
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
