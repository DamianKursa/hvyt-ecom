import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/utils/hooks/useI18n';

const HeroOnas = () => {
  const { t, language } = useI18n();
  const staticBoxes = [
    { index: 2, bgColor: '#F5F5AD' },
    { index: 5, bgColor: '#F5F5AD' },
    { index: 4, bgColor: '#F5F5AD' },
    { index: 6, bgColor: '#F5F5AD' },
    { index: 8, bgColor: '#F5F5AD' },
    { index: 10, bgColor: '#F5F5AD' },
    { index: 11, bgColor: '#F5F5AD' },
  ];

  return (
    <section
      id="hero-o-nas"
      className="relative flex pt-[125px] md:items-center w-full min-h-[795px] mx-auto overflow-hidden px-4 md:px-0 bg-right bg-cover"
      style={{
        backgroundImage: language === 'en' 
          ? 'url("/images/o-nas-hero-bg.png")' 
          : 'url("/images/o-nas-hero-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <div className="container mx-auto max-w-grid-desktop h-full flex justify-between items-center">
        <div className="hidden md:grid grid-cols-3 grid-rows-4 gap-0 justify-end items-center overflow-hidden absolute right-0 top-0">
          {Array.from({ length: 12 }).map((_, idx) => {
            const boxConfig = staticBoxes.find((box) => box.index === idx);
            return (
              <div
                key={idx}
                className="w-[200px] h-[200px] relative"
                style={{
                  background: boxConfig ? boxConfig.bgColor : 'transparent',
                }}
              >
                {idx === 6 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/icons/onas-ikon.svg"
                      alt="Onas Icon"
                      width={65}
                      height={89}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col items-start justify-center w-full tracking-wide lg:w-1/2">
            <h1
              className="text-[40px] md:text-6xl font-bold leading-tight text-dark-pastel-red mb-4"
              dangerouslySetInnerHTML={{
                __html: t.aboutUs.heroTitle,
              }}
            ></h1>

            {/* Mobile Description (without forced <br />) */}
            <p className="block md:hidden text-lg leading-relaxed text-neutral-darkest mb-6">
              {t.aboutUs.heroDescriptionMobile}
            </p>
            {/* Desktop Description */}
            <p
              className="hidden md:block text-lg leading-relaxed text-neutral-darkest mb-6"
              dangerouslySetInnerHTML={{
                __html: t.aboutUs.heroDescriptionDesktop,
              }}
            ></p>
          </div>
        </div>
      </div>

      {/* Mobile-Only Overlay at Bottom Right */}
      <div className="absolute bottom-0 right-0 block md:hidden">
        <Image
          src="/images/bg-mobile-hero.svg"
          alt="Onas Mobile Overlay"
          width={300}
          height={200}
          priority
        />
      </div>
    </section>
  );
};

export default HeroOnas;
