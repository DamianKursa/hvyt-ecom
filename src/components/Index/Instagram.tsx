import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Instagram = () => {
  return (
    <section className="container mx-auto max-w-grid-desktop mt-[115px] py-16">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-8">
          {/* Section title and description */}
          <div>
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Hvyt w waszych domach
            </h2>
            <p className="font-size-text-medium text-neutral-darkest">
              Zainspiruj się i zobacz jak nasze produkty sprawdzają się u innych.            
            </p>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-4 gap-6">
          {/* First image */}
          <div className="relative w-full h-[350px] col-span-1">
            <Image
              src="https://via.placeholder.com/500"
              alt="It's all about colors"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Second image */}
          <div className="relative w-full h-[350px] col-span-1">
            <Image
              src="https://via.placeholder.com/500"
              alt="Piccoli miracoli"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Third image */}
          <div className="relative w-full h-[350px] col-span-1">
            <Image
              src="https://via.placeholder.com/500"
              alt="Mosiężne"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Fourth image */}
          <div className="relative w-full h-[350px] col-span-1">
            <Image
              src="https://via.placeholder.com/500"
              alt="Leon"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Centered Button with Instagram Icon */}
        <div className="flex justify-center mt-8">
          <Link
            href="#"
            className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all flex items-center space-x-2"
          >
            <span>Zobacz nasz Instagram</span>
            <img src="/icons/Instagram.svg" alt="Instagram Icon" className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Mobile View: Swiper */}
      <div className="md:hidden">
        <Swiper spaceBetween={16} slidesPerView={1.2}>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="https://via.placeholder.com/500"
                alt="It’s all about colors"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="https://via.placeholder.com/500"
                alt="Piccoli miracoli"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="https://via.placeholder.com/500"
                alt="Mosiężne"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[350px]">
              <Image
                src="https://via.placeholder.com/500"
                alt="Leon"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Instagram;
