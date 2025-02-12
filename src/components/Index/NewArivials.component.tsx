import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { fetchNowosciPosts } from '@/utils/api/woocommerce';
import SkeletonNowosci from '@/components/Skeletons/SkeletonNowosci';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface NowosciItem {
  id: number;
  src: string; // Image URL
  alt: string; // Image Alt Text
  title?: string; // Optional title
}

const HERO_HEIGHT = 800;

// Utility to merge refs.
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

/*
  We are not changing the overall animation or mask behavior.
  The only update is that we now include the "round 16px" parameter in our
  clipPath values so that the clip respects the 16px border radius.
  
  The variants are updated as follows:
  
  - Initial: 'inset(50% 0 0 0 round 16px)' → shows bottom half (with rounded corners)
  - Mid: 'inset(0 0 0 0 round 16px)' → full image visible
  - Final: 'inset(0 0 50% 0 round 16px)' → mask positioned at top, showing bottom half of image
*/
const maskVariants = {
  initial: { clipPath: 'inset(50% 0 0 0 round 16px)', y: 0 },
  animate: {
    clipPath: [
      'inset(50% 0 0 0 round 16px)', // initial: bottom half visible with rounded corners
      'inset(0 0 0 0 round 16px)', // mid: full image visible with rounded corners
      'inset(0 0 50% 0 round 16px)', // final: mask shows top 50% of container with rounded corners
    ],
    y: [0, 0, 0],
    transition: { duration: 2, times: [0, 0.5, 1] },
  },
};

const imageVariants = {
  initial: { top: '0%' },
  animate: {
    top: ['0%', '0%', '-50%'], // final: image shifted up by 50% (i.e. -321px in a 642px container)
    transition: { duration: 2, times: [0, 0.5, 1] },
  },
};

const NewArrivalsSection = () => {
  const [nowosciItems, setNowosciItems] = useState<NowosciItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroOut, setHeroOut] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef } = useInView({ threshold: 1, triggerOnce: true });
  const combinedRef = mergeRefs(sectionRef, inViewRef);

  useEffect(() => {
    const loadNowosci = async () => {
      try {
        const posts = await fetchNowosciPosts();
        const items: NowosciItem[] = posts.map((post) => ({
          id: post.id,
          src: post.imageUrl,
          alt: post.title.rendered,
          title: post.title.rendered,
        }));
        setNowosciItems(items);
      } catch (error) {
        console.error('Error fetching Nowosci items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNowosci();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset >= HERO_HEIGHT && !heroOut) {
        setHeroOut(true);
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          document.body.style.overflow = '';
        }, 1200);
      } else if (window.pageYOffset < HERO_HEIGHT && heroOut) {
        setHeroOut(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroOut]);

  if (loading) {
    return <SkeletonNowosci />;
  }
  if (nowosciItems.length < 4) {
    return <p>Insufficient Nowosci data available.</p>;
  }

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
          Nowa gałka HALOHOLD projektu Moniki Rogusz-Witkoś.
        </p>
        <Link
          href="#"
          className="mt-4 px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
        >
          Zobacz nowości →
        </Link>
      </div>
      <div className="md:hidden">
        <ResponsiveSlider
          items={nowosciItems.map((item) => ({
            src: item.src,
            alt: item.alt,
            title: item.title,
          }))}
          renderItem={(item: { src: string; alt: string; title?: string }) => (
            <div className="relative w-full h-[300px]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
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
                  animate={heroOut ? 'animate' : 'initial'}
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
                    animate={heroOut ? 'animate' : 'initial'}
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
                  animate={heroOut ? 'animate' : 'initial'}
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
                    animate={heroOut ? 'animate' : 'initial'}
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
            animate={heroOut ? { y: -300 } : { y: 0 }}
            transition={{ duration: 1 }}
            className="absolute z-20 left-0 p-4"
          >
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Zobacz nasze nowości
            </h2>
            <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
              Nowa gałka HALOHOLD projektu Moniki Rogusz-Witkoś.
            </p>
            <Link
              href="#"
              className="mt-[40px] inline-block px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz nowości →
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
