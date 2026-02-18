import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { useAnimateOnScroll } from '../Animations/useAnimateOnScroll';
import { useI18n } from '@/utils/hooks/useI18n';

interface ColorItem {
  src: string;
  alt: string;
  title: string;
  href: string;
}

const WybierzColor = () => {
  const {t, getPath} = useI18n();
  const sectionRef = useRef(null);
  const isVisible = useAnimateOnScroll(sectionRef);

  const colorItems: ColorItem[] = [
    {
      src: '/images/6.png',
      alt: t.index.chooseColorSilver,
      title: t.index.chooseColorSilver,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=srebrny`,
    },
    {
      src: '/images/5.png',
      alt: t.index.chooseColorBlack,
      title: t.index.chooseColorBlack,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=czarny`,
    },
    {
      src: '/images/zloto.png',
      alt: t.index.chooseColorGold,
      title: t.index.chooseColorGold,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=zloty`,
    },
    {
      src: '/images/4.png',
      alt: t.index.chooseColorsColors,
      title: t.index.chooseColorsColors,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=pozostale`
    },
  ];

  return (
    <section
      className="container px-4 md:px-4 lg:px-4 2xl:px-0 mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] py-16"
      ref={sectionRef}
    >
      {/* Title, Description, and Button */}
      <div className="flex flex-col items-start mb-8 md:flex-row md:justify-between md:items-center md:px-0 px-4">
        {/* Mobile and Desktop Title, Description */}
        <div className="flex flex-col mb-4 md:mb-0">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">
            {t.index.chooseColorTitle}
          </h2>
          <p className="font-size-text-medium text-neutral-darkest mt-[10px] md:mt-0">
            {t.index.chooseColorDescription}
          </p>
        </div>
        {/* Button */}
        <Link
          href={getPath('/kategoria/uchwyty-meblowe')}
          className="px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all self-start md:self-auto"
        >
          {t.index.chooseColorCheck} →
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="space-y-6">
          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'min-h-[435px]' : 'min-h-[350px]'
                } w-[50%]`}
            >
              <Link href={`${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=srebrny`}>
                <Image
                  src="/images/6.png"
                  alt={t.index.chooseColorSilver}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.chooseColorSilver}
                </div>
              </Link>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'min-h-[435px]' : 'min-h-[350px]'
                } w-[50%]`}
            >
              <Link href={`${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=czarny`}>
                <Image
                  src="/images/5.png"
                  alt={t.index.chooseColorBlack}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.chooseColorBlack}
                </div>
              </Link>
            </div>
          </div>
          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[30%] min-h-[350px]'
                }`}
            >
              <Link href={`${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=zloty`}>
                <Image
                  src="/images/zloto.png"
                  alt={t.index.chooseColorGold}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.chooseColorGold}
                </div>
              </Link>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[70%] min-h-[350px]'
                }`}
            >
              <Link href={`${getPath('/kategoria/uchwyty-meblowe')}?pa_kolor=pozostale`}>
                <Image
                  src="/images/4.png"
                  alt={t.index.chooseColorsColors}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.chooseColorsColors}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View: Responsive Slider (with links) */}
      <div className="md:hidden">
        <ResponsiveSlider
          items={colorItems}
          renderItem={(item: ColorItem) => (
            <Link href={item.href}>
              <div className="relative w-full h-[350px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-dark-pastel-red">
                  {item.title}
                </div>
              </div>
            </Link>
          )}
        />
      </div>
    </section>
  );
};

export default WybierzColor;
