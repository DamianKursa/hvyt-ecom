import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const NaszeKolekcje = () => {
  return (
    <section
      className="w-full pt-[88px] py-16"
      style={{ backgroundColor: 'var(--color-beige)' }}
    >
      {/* Content Wrapper for 1440px max width */}
      <div className="container mx-auto max-w-grid-desktop">
        <div className="hidden md:block">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-size-h2 font-bold text-neutral-darkest">
                Sprawdź nasze kolekcje
              </h2>
              <p className="font-size-text-medium text-neutral-darkest">
                Zobacz co ostatnio nowego dodaliśmy dla Ciebie.
              </p>
            </div>
            <Link
              href="#"
              className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz wszystkie kolekcje →
            </Link>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-4 gap-6">
            {/* First image */}
            <div className="relative w-full">
              <Image
                src="/images/kolekcje_1.png"
                alt="It’s all about colors"
                width={400} // Use responsive layout with width and height
                height={446}
                layout="responsive"
                objectFit="cover"
                quality={100} // Ensure image clarity
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-dark-pastel-red">
                It’s all about colors
              </div>
            </div>

            {/* Second image */}
            <div className="relative w-full">
              <Image
                src="/images/kolekcje_2.png"
                alt="Piccoli miracoli"
                width={400}
                height={446}
                layout="responsive"
                objectFit="cover"
                quality={100}
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neon-yellow">
                Piccoli miracoli
              </div>
            </div>

            {/* Third image */}
            <div className="relative w-full">
              <Image
                src="/images/kolekcje_3.png"
                alt="Mosiężne"
                width={400}
                height={446}
                layout="responsive"
                objectFit="cover"
                quality={100}
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neutral-darkest">
                Mosiężne
              </div>
            </div>

            {/* Fourth image */}
            <div className="relative w-full">
              <Image
                src="/images/kolekcje_4.png"
                alt="Leon"
                width={400}
                height={446}
                layout="responsive"
                objectFit="cover"
                quality={100}
                className="rounded-lg"
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-dark-pastel-red">
                Leon
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Swiper */}
        <div className="md:hidden">
          <Swiper spaceBetween={16} slidesPerView={1.2}>
            <SwiperSlide>
              <div className="relative w-full">
                <Image
                  src="/images/kolekcje_1.png"
                  alt="It’s all about colors"
                  width={400}
                  height={446}
                  layout="responsive"
                  objectFit="cover"
                  quality={100}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  It’s all about colors
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full">
                <Image
                  src="/images/kolekcje_2.png"
                  alt="Piccoli miracoli"
                  width={400}
                  height={446}
                  layout="responsive"
                  objectFit="cover"
                  quality={100}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neon-yellow">
                  Piccoli miracoli
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full">
                <Image
                  src="/images/kolekcje_3.png"
                  alt="Mosiężne"
                  width={400}
                  height={446}
                  layout="responsive"
                  objectFit="cover"
                  quality={100}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  Mosiężne
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full">
                <Image
                  src="/images/kolekcje_4.png"
                  alt="Leon"
                  width={400}
                  height={446}
                  layout="responsive"
                  objectFit="cover"
                  quality={100}
                  className="rounded-lg"
                />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-dark-pastel-red">
                  Leon
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default NaszeKolekcje;
