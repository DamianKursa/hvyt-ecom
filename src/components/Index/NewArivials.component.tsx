import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import SkeletonNowosci from '@/components/Skeletons/SkeletonNowosci';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useSWR from 'swr';

interface NowosciItem {
  id: number;
  src: string;
  mobileSrc: string;
  alt: string;
  title?: string;
}

const HERO_HEIGHT = 800;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

const maskVariants = {
  initial: { clipPath: 'inset(50% 0 0 0 round 16px)', y: 0 },
  animate: {
    clipPath: [
      'inset(50% 0 0 0 round 16px)',
      'inset(0 0 0 0 round 16px)',
      'inset(0 0 50% 0 round 16px)',
    ],
    y: [0, 0, 0],
    transition: { duration: 2, times: [0, 0.5, 1] },
  },
};

const imageVariants = {
  initial: { top: '0%' },
  animate: {
    top: ['0%', '0%', '-50%'],
    transition: { duration: 2, times: [0, 0.5, 1] },
  },
};

interface NewArrivalsSectionProps {
  useInViewTrigger?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  useInViewTrigger = false,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });
  const combinedRef = mergeRefs(sectionRef, inViewRef);

  //SWR to fetch nowości posts
  const { data: posts, error } = useSWR(
    '/api/woocommerce?action=fetchNowosciPosts',
    fetcher,
    {
      refreshInterval: 3600000,
      dedupingInterval: 600000,
    },
  );

  // Handle errors and loading state
  if (error) return <div>Error loading nowości posts</div>;
  if (!posts) return <SkeletonNowosci />;

  const nowosciItems: NowosciItem[] = posts.map((post: any) => ({
    id: post.id,
    src: post.imageUrl,
    mobileSrc: post.acf?.new_arrivals_mobile || post.imageUrl,
    alt: post.title.rendered,
    title: post.title.rendered,
  }));

  if (nowosciItems.length < 4) {
    return <p>Insufficient nowości data available.</p>;
  }

  const animationTrigger = useInViewTrigger ? inView : false;

  return (
    <section
      ref={combinedRef}
      className="container mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] py-16"
    >
      {/* Mobile View */}
      <div className="px-[16px] flex flex-col items-start mb-8 md:hidden">
        <h2 className="font-size-h2 font-bold text-neutral-darkest">
          Zobacz nasze nowości
        </h2>
        <p className="font-size-text-medium text-neutral-darkest mt-2">
          Nowi najlepsi przyjaciele Twojego domu
        </p>
        <Link
          href="/kategoria/meble"
          className="mt-4 px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
        >
          Zobacz meble →
        </Link>
      </div>
      <div className="md:hidden">
        <ResponsiveSlider
          items={nowosciItems.map((item) => ({
            src: item.mobileSrc,
            alt: item.alt,
            title: item.title,
          }))}
          renderItem={(item: { src: string; alt: string; title?: string }) => (
            <div className="relative w-full h-[300px]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center bottom',
                }}
                className="rounded-[16px]"
              />
              {item.title && (
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {item.title}
                </div>
              )}
            </div>
          )}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex gap-6">
        {/* Left Column */}
        <div className="relative w-1/2" style={{ height: '642px' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="flex gap-6 h-full">
              {/* First Left Image */}
              <div className="w-full relative overflow-hidden h-full rounded-[16px]">
                <motion.div
                  className="absolute inset-0"
                  style={{ borderRadius: '16px' }}
                  variants={maskVariants}
                  initial="initial"
                  animate={animationTrigger ? 'animate' : 'initial'}
                >
                  <motion.div
                    className="absolute"
                    style={{
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '642px',
                      borderRadius: '16px',
                    }}
                    variants={imageVariants}
                    initial="initial"
                    animate={animationTrigger ? 'animate' : 'initial'}
                  >
                    <Image
                      src={nowosciItems[0].src}
                      alt={nowosciItems[0].alt}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-[16px]"
                    />
                  </motion.div>
                </motion.div>
              </div>
              {/* Second Left Image */}
              <div className="w-full relative overflow-hidden h-full rounded-[16px]">
                <motion.div
                  className="absolute inset-0"
                  style={{ borderRadius: '16px' }}
                  variants={maskVariants}
                  initial="initial"
                  animate={animationTrigger ? 'animate' : 'initial'}
                >
                  <motion.div
                    className="absolute"
                    style={{
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '642px',
                      borderRadius: '16px',
                    }}
                    variants={imageVariants}
                    initial="initial"
                    animate={animationTrigger ? 'animate' : 'initial'}
                  >
                    <Image
                      src={nowosciItems[1].src}
                      alt={nowosciItems[1].alt}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-[16px]"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
          {/* Title Block – overlaps the images */}
          <motion.div
            initial={{ y: 0 }}
            animate={animationTrigger ? { y: -300 } : { y: 0 }}
            transition={{ duration: 1 }}
            className="absolute z-20 left-0 p-4"
          >
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Zobacz nasze nowości
            </h2>
            <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
              Nowi najlepsi przyjaciele Twojego domu
            </p>
            <Link
              href="/kategoria/meble"
              className="mt-[40px] inline-block px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz meble →
            </Link>
          </motion.div>
        </div>
        {/* Right Column – static images */}
        <div className="flex flex-col w-1/2">
          <div className="flex gap-6 h-full">
            <div className="w-full h-full">
              <Image
                src={nowosciItems[2].src}
                alt={nowosciItems[2].alt}
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-[16px]"
              />
            </div>
            <div className="w-full h-full">
              <Image
                src={nowosciItems[3].src}
                alt={nowosciItems[3].alt}
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-[16px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
