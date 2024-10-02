import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAnimateOnScroll } from '../Animations/useAnimateOnScroll'; // Import the updated hook
import 'swiper/css';

const WybierzColor = () => {
  const sectionRef = useRef(null);
  const isVisible = useAnimateOnScroll(sectionRef); // Use the hook

  return (
    <section className="container mx-auto max-w-grid-desktop mt-[115px] py-16" ref={sectionRef}>
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-8">
          {/* Section title and description */}
          <div>
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Wybierz kolor, który lubisz
            </h2>
            <p className="font-size-text-medium text-neutral-darkest">
              Diabeł tkwi w szczegółach, niech kolor podkręci Twoje wnętrze!
            </p>
          </div>
          {/* Button */}
          <Link
            href="#"
            className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
          >
            Sprawdź wszystkie kolory →
          </Link>
        </div>

        {/* Image Flexbox Layout */}
        <div className="space-y-6">
          {/* First row: Only height animation */}
          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'min-h-[435px]' : 'min-h-[350px]'} w-[50%]`}
            >
              <Image
                src="/images/6.png"
                alt="Srebro"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Srebro
              </div>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'min-h-[435px]' : 'min-h-[350px]'} w-[50%]`}
            >
              <Image
                src="/images/5.png"
                alt="Czerń"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Czerń
              </div>
            </div>
          </div>

          {/* Second row: Width and height animation, 50/50 split */}
          <div className="flex gap-6">
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[30%] min-h-[350px]'}`}
            >
              <Image
                src="/images/zloto.png"
                alt="Złoto"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Złoto
              </div>
            </div>
            <div
              className={`relative transition-all duration-[4000ms] ${isVisible ? 'w-[50%] min-h-[435px]' : 'w-[70%] min-h-[350px]'}`}
            >
              <Image
                src="/images/4.png"
                alt="Kolory"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Kolory
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
                src="/images/6.png"
                alt="Srebro"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Srebro
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="/images/5.png"
                alt="Czerń"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Czerń
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="/images/zloto.png"
                alt="Złoto"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Złoto
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="/images/4.png"
                alt="Kolory"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Kolory
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default WybierzColor;
