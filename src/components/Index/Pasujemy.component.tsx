import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAnimateOnScroll } from '../Animations/useAnimateOnScroll'; // Import the updated hook
import 'swiper/css';

const PasujemyWszedzie = () => {
  const sectionRef = useRef(null);
  const isVisible = useAnimateOnScroll(sectionRef); // Use the hook

  return (
    <section className="container mx-auto max-w-grid-desktop mt-[115px] pb-[88px] py-16" ref={sectionRef}>
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-8">
          {/* Section title and description */}
          <div>
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Pasujemy wszędzie
            </h2>
            <p className="font-size-text-medium text-neutral-darkest">
              Dobierz uchwyt do swojego wnętrza
            </p>
          </div>
          {/* Button */}
          <Link
            href="#"
            className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
          >
            Zobacz przeznaczenie →
          </Link>
        </div>

        {/* Image Flexbox Layout */}
        <div className="space-y-6">
          {/* First row: 50/50 split */}
          <div className="flex gap-6">
            <div className={`relative w-full transition-all duration-[4000ms] min-h-[350px] ${isVisible ? 'min-h-[435px]' : ''}`}>
              <Image
                src="/images/6_2.png"
                alt="Meble dziecięce"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Meble dziecięce
              </div>
            </div>
            <div className={`relative w-full transition-all duration-[4000ms] min-h-[350px] ${isVisible ? 'min-h-[435px]' : ''}`}>
              <Image
                src="/images/5_1.png"
                alt="Meble pokojowe"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Meble pokojowe
              </div>
            </div>
          </div>

          {/* Second row: 70/30 split initially, animate to 50/50 */}
          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[70%] min-h-[350px]'}`}
            >
              <Image
                src="/images/4_1.png"
                alt="Meble kuchenne"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Meble kuchenne
              </div>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[30%] min-h-[350px]'}`}
            >
              <Image
                src="/images/6_3.png"
                alt="Szafy"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Szafy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View: Swiper */}
      <div className="md:hidden">
        <Swiper spaceBetween={16} slidesPerView={1.2}>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="/images/6_2.png"
                alt="Meble dziecięce"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Meble dziecięce
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="/images/5_1.png"
                alt="Meble pokojowe"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Meble pokojowe
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="/images/4_1.png"
                alt="Meble kuchenne"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Meble kuchenne
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="/images/6_3.png"
                alt="Szafy"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Szafy
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default PasujemyWszedzie;
