import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { useAnimateOnScroll } from '../Animations/useAnimateOnScroll';
import 'swiper/css';
import { useI18n } from '@/utils/hooks/useI18n';

interface PasujemyWszedzieItem {
  src: string;
  alt: string;
  title: string;
  href: string;
}

const PasujemyWszedzie = () => {
  const {t, getPath} = useI18n();
  const sectionRef = useRef(null);
  const isVisible = useAnimateOnScroll(sectionRef);

  const pasujemyItems: PasujemyWszedzieItem[] = [
    {
      src: '/images/6_2.png',
      alt: t.index.fitChildrensFurniture,
      title: t.index.fitChildrensFurniture,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_przeznaczenie=do-mebli-dzieciecych`,
    },
    {
      src: '/images/5_1.png',
      alt: t.index.fitLivingRoomFurniture,
      title: t.index.fitLivingRoomFurniture,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_przeznaczenie=do-mebli-pokojowych`,
    },
    {
      src: '/images/4_1.png',
      alt: t.index.fitKitchenFurniture,
      title: t.index.fitKitchenFurniture,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_przeznaczenie=do-mebli-kuchennych`,
    },
    {
      src: '/images/6_3.png',
      alt: t.index.fitWardrobes,
      title: t.index.fitWardrobes,
      href: `${getPath('/kategoria/uchwyty-meblowe')}?pa_przeznaczenie=do-szaf`,
    },
  ];

  return (
    <section
      className="container px-4 md:px-4 lg:px-4 2xl:px-0 mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] pb-[88px] py-16"
      ref={sectionRef}
    >
      {/* Title, Description, and Button */}
      <div className="flex flex-col items-start mb-8 md:flex-row md:justify-between md:items-center md:px-0 px-4">
        <div className="flex flex-col mb-4 md:mb-0">
          <h2 className="font-size-h2 font-bold text-neutral-darkest">
            {t.index.fitTitle}
          </h2>
          <p className="font-size-text-medium text-neutral-darkest mt-[10px] md:mt-0">
            {t.index.fitDescritpion}
          </p>
        </div>
        <Link
          href={getPath('/kategoria/uchwyty-meblowe')}
          className="px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all self-start md:self-auto"
        >
          {t.index.seeAll} →
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="space-y-6">
          <div className="flex gap-6">
            <div
              className={`relative w-full transition-all duration-[4000ms] min-h-[350px] ${isVisible ? 'min-h-[435px]' : ''
                }`}
            >
              <Link href="/kategoria/uchwyty-meblowe?pa_przeznaczenie=do-mebli-dzieciecych">
                <Image
                  src="/images/6_2.png"
                  alt={t.index.fitChildrensFurniture}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.fitChildrensFurniture}
                </div>
              </Link>
            </div>
            <div
              className={`relative w-full transition-all duration-[4000ms] min-h-[350px] ${isVisible ? 'min-h-[435px]' : ''
                }`}
            >
              <Link href="/kategoria/uchwyty-meblowe?pa_przeznaczenie=do-mebli-pokojowych">
                <Image
                  src="/images/5_1.png"
                  alt={t.index.fitLivingRoomFurniture}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.fitLivingRoomFurniture}
                </div>
              </Link>
            </div>
          </div>

          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[70%] min-h-[350px]'
                }`}
            >
              <Link href="/kategoria/uchwyty-meblowe?pa_przeznaczenie=do-mebli-kuchennych">
                <Image
                  src="/images/4_1.png"
                  alt={t.index.fitKitchenFurniture}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.fitKitchenFurniture}
                </div>
              </Link>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[30%] min-h-[350px]'
                }`}
            >
              <Link href="/kategoria/uchwyty-meblowe?pa_przeznaczenie=do-szaf">
                <Image
                  src="/images/6_3.png"
                  alt={t.index.fitWardrobes}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {t.index.fitWardrobes}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View: Responsive Slider (with Links) */}
      <div className="md:hidden">
        <ResponsiveSlider
          items={pasujemyItems}
          renderItem={(item: PasujemyWszedzieItem) => (
            <Link href={item.href}>
              <div className="relative w-full h-[350px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
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

export default PasujemyWszedzie;
